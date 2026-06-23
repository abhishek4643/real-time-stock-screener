import type { OHLCV } from '@/types/stock';

// ============================================================
// Simple Moving Average
// ============================================================
export function calculateSMA(prices: number[], period: number): (number | undefined)[] {
  const result: (number | undefined)[] = new Array(prices.length).fill(undefined);
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result[i] = sum / period;
  }
  return result;
}

// ============================================================
// Exponential Moving Average
// ============================================================
export function calculateEMA(prices: number[], period: number): (number | undefined)[] {
  const result: (number | undefined)[] = new Array(prices.length).fill(undefined);
  if (prices.length < period) return result;

  // Seed with SMA
  const seed = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result[period - 1] = seed;

  const k = 2 / (period + 1);
  for (let i = period; i < prices.length; i++) {
    result[i] = prices[i] * k + (result[i - 1] as number) * (1 - k);
  }
  return result;
}

// ============================================================
// Bollinger Bands (population std dev, financial convention)
// ============================================================
export interface BollingerResult {
  upper: number | undefined;
  middle: number | undefined;
  lower: number | undefined;
}

export function calculateBollinger(prices: number[], period: number = 20, multiplier: number = 2): BollingerResult[] {
  const result: BollingerResult[] = new Array(prices.length).fill({ upper: undefined, middle: undefined, lower: undefined });
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    // Population standard deviation
    const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    result[i] = {
      upper: mean + multiplier * stdDev,
      middle: mean,
      lower: mean - multiplier * stdDev,
    };
  }
  return result;
}

// ============================================================
// RSI - Relative Strength Index
// ============================================================
export function calculateRSI(prices: number[], period: number = 14): (number | undefined)[] {
  const result: (number | undefined)[] = new Array(prices.length).fill(undefined);
  if (prices.length < period + 1) return result;

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const delta = prices[i] - prices[i - 1];
    gains.push(Math.max(delta, 0));
    losses.push(Math.abs(Math.min(delta, 0)));
  }

  // First average (SMA of first `period` gains/losses)
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const rsi = (avgGain: number, avgLoss: number): number => {
    if (avgLoss === 0) return 100;
    if (avgGain === 0) return 0;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  };

  result[period] = rsi(avgGain, avgLoss);

  for (let i = period + 1; i < prices.length; i++) {
    const gi = i - 1; // gains array offset
    avgGain = (avgGain * (period - 1) + gains[gi]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[gi]) / period;
    result[i] = rsi(avgGain, avgLoss);
  }

  return result;
}

// ============================================================
// Volume Profile
// ============================================================
export interface VolumeProfileBucket {
  priceLevel: number;
  volume: number;
  normalizedVolume: number; // 0-1 for rendering
}

export function calculateVolumeProfile(candles: OHLCV[], buckets: number = 40): VolumeProfileBucket[] {
  if (candles.length === 0) return [];

  const priceMin = Math.min(...candles.map(c => c.low));
  const priceMax = Math.max(...candles.map(c => c.high));
  const bucketSize = (priceMax - priceMin) / buckets;

  const volumeByBucket = new Array(buckets).fill(0);

  for (const candle of candles) {
    const lowBucket  = Math.floor((candle.low  - priceMin) / bucketSize);
    const highBucket = Math.min(Math.floor((candle.high - priceMin) / bucketSize), buckets - 1);
    const spanBuckets = Math.max(1, highBucket - lowBucket + 1);
    const volPerBucket = candle.volume / spanBuckets;

    for (let b = lowBucket; b <= highBucket; b++) {
      if (b >= 0 && b < buckets) {
        volumeByBucket[b] += volPerBucket;
      }
    }
  }

  const maxVol = Math.max(...volumeByBucket);

  return volumeByBucket.map((vol, i) => ({
    priceLevel: priceMin + (i + 0.5) * bucketSize,
    volume: Math.round(vol),
    normalizedVolume: maxVol > 0 ? vol / maxVol : 0,
  }));
}
