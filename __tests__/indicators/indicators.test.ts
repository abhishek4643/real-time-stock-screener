import { describe, it, expect } from 'vitest';
import { calculateSMA, calculateEMA, calculateBollinger, calculateRSI } from '@/lib/indicators';

// ── SMA Tests ────────────────────────────────────────────────
describe('Simple Moving Average (SMA)', () => {
  it('calculates SMA correctly for a basic dataset', () => {
    const prices = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
    const sma5 = calculateSMA(prices, 5);
    expect(sma5[4]).toBeCloseTo(14, 1);  // (10+12+14+16+18)/5 = 14
    expect(sma5[9]).toBeCloseTo(24, 1);  // (20+22+24+26+28)/5 = 24
  });

  it('returns undefined for periods with insufficient data', () => {
    const prices = [10, 12, 14];
    const sma5 = calculateSMA(prices, 5);
    expect(sma5[0]).toBeUndefined();
    expect(sma5[2]).toBeUndefined();
  });

  it('handles single-element period', () => {
    const prices = [42, 43, 44];
    const sma1 = calculateSMA(prices, 1);
    expect(sma1[0]).toBe(42);
    expect(sma1[2]).toBe(44);
  });

  it('returns correct length array', () => {
    const prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sma3 = calculateSMA(prices, 3);
    expect(sma3.length).toBe(10);
  });

  it('SMA equals last price for period=1', () => {
    const prices = [100, 200, 300];
    const sma = calculateSMA(prices, 1);
    expect(sma[0]).toBe(100);
    expect(sma[1]).toBe(200);
    expect(sma[2]).toBe(300);
  });
});

// ── EMA Tests ────────────────────────────────────────────────
describe('Exponential Moving Average (EMA)', () => {
  it('seeds EMA with SMA for first period', () => {
    const prices = [10, 12, 14, 16, 18];
    const ema5 = calculateEMA(prices, 5);
    // First EMA = SMA(5) = (10+12+14+16+18)/5 = 14
    expect(ema5[4]).toBeCloseTo(14, 1);
  });

  it('returns undefined before period is reached', () => {
    const prices = [10, 12, 14, 16];
    const ema5 = calculateEMA(prices, 5);
    expect(ema5[3]).toBeUndefined();
  });

  it('EMA period=1 equals the price itself', () => {
    const prices = [100, 200, 300];
    const ema = calculateEMA(prices, 1);
    expect(ema[0]).toBeCloseTo(100, 0);
  });
});

// ── Bollinger Band Tests ──────────────────────────────────────
describe('Bollinger Bands', () => {
  it('middle band equals SMA(20)', () => {
    const prices = Array.from({ length: 30 }, (_, i) => 100 + i);
    const boll = calculateBollinger(prices, 20);
    const sma = calculateSMA(prices, 20);
    expect(boll[19]?.middle).toBeCloseTo(sma[19] as number, 3);
  });

  it('upper band is above middle band', () => {
    const prices = Array.from({ length: 30 }, () => 100 + Math.random() * 20);
    const boll = calculateBollinger(prices, 20);
    expect((boll[25]?.upper ?? 0)).toBeGreaterThan(boll[25]?.middle ?? 0);
  });

  it('lower band is below middle band', () => {
    const prices = Array.from({ length: 30 }, () => 100 + Math.random() * 20);
    const boll = calculateBollinger(prices, 20);
    expect((boll[25]?.lower ?? 0)).toBeLessThan(boll[25]?.middle ?? Infinity);
  });

  it('bands are undefined before period', () => {
    const prices = Array.from({ length: 15 }, (_, i) => 100 + i);
    const boll = calculateBollinger(prices, 20);
    expect(boll[10]?.upper).toBeUndefined();
  });

  it('constant prices produce zero-width bands', () => {
    const prices = Array.from({ length: 25 }, () => 100);
    const boll = calculateBollinger(prices, 20);
    expect(boll[24]?.upper).toBeCloseTo(100, 5);
    expect(boll[24]?.lower).toBeCloseTo(100, 5);
  });
});

// ── RSI Tests ────────────────────────────────────────────────
describe('Relative Strength Index (RSI)', () => {
  it('RSI = 100 when all changes are positive', () => {
    const prices = Array.from({ length: 20 }, (_, i) => 100 + i * 2);
    const rsi = calculateRSI(prices, 14);
    const lastRsi = rsi.filter(v => v !== undefined).pop()!;
    expect(lastRsi).toBeCloseTo(100, 0);
  });

  it('RSI = 0 when all changes are negative', () => {
    const prices = Array.from({ length: 20 }, (_, i) => 200 - i * 2);
    const rsi = calculateRSI(prices, 14);
    const lastRsi = rsi.filter(v => v !== undefined).pop()!;
    expect(lastRsi).toBeCloseTo(0, 0);
  });

  it('RSI is between 0 and 100', () => {
    const prices = Array.from({ length: 50 }, () => 100 + (Math.random() - 0.5) * 20);
    const rsi = calculateRSI(prices, 14);
    const defined = rsi.filter(v => v !== undefined) as number[];
    expect(defined.every(v => v >= 0 && v <= 100)).toBe(true);
  });

  it('returns undefined before period+1 data', () => {
    const prices = Array.from({ length: 14 }, (_, i) => 100 + i);
    const rsi = calculateRSI(prices, 14);
    // Need at least period+1 = 15 prices for first RSI
    expect(rsi[13]).toBeUndefined();
  });
});
