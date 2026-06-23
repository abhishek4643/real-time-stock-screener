import type { OHLCV } from '@/types/stock';

function normalRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function generateOHLCV(
  startPrice: number,
  days: number = 365,
  volatility: number = 0.02,
  avgVolume: number = 1_000_000,
): OHLCV[] {
  const candles: OHLCV[] = [];
  let currentPrice = startPrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyReturn = normalRandom() * volatility;
    const open = currentPrice;
    const intraday1 = open * (1 + normalRandom() * volatility * 0.5);
    const intraday2 = open * (1 + normalRandom() * volatility * 0.5);
    const close = open * (1 + dailyReturn);
    const high = Math.max(open, close, intraday1, intraday2) * (1 + Math.abs(normalRandom()) * 0.005);
    const low  = Math.min(open, close, intraday1, intraday2) * (1 - Math.abs(normalRandom()) * 0.005);

    const volumeMultiplier = 1 + Math.abs(dailyReturn) * 10;
    const volume = Math.round(avgVolume * volumeMultiplier * (0.5 + Math.random()));

    candles.push({
      time: Math.floor(date.getTime() / 1000),
      open: round2(open),
      high: round2(Math.max(open, close, high)),
      low:  round2(Math.min(open, close, low)),
      close: round2(close),
      volume,
    });

    currentPrice = close;
  }

  return candles;
}

export function simulateNextPrice(
  currentPrice: number,
  volatility: number = 0.02,
  drift: number = 0.0001,
  dt: number = 1 / 252,
): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const randomShock = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
  const priceChange = drift * dt + volatility * Math.sqrt(dt) * randomShock;
  return round2(currentPrice * (1 + priceChange));
}
