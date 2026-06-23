import { describe, it, expect } from 'vitest';
import { filterStocks } from '@/lib/filterEngine';
import { generateMockStocks } from '@/lib/mockDataGenerator';
import type { FilterConfig, Stock } from '@/types/stock';

const STOCKS = generateMockStocks(5000);

describe('Filter Engine — Operator Tests', () => {
  it('gte filter: marketCap >= 50000', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'marketCap', operator: 'gte', value: 50000, enabled: true }];
    const result = filterStocks(STOCKS, filters);
    expect(result.every(s => s.marketCap >= 50000)).toBe(true);
  });

  it('lte filter: pe <= 20', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'pe', operator: 'lte', value: 20, enabled: true }];
    const result = filterStocks(STOCKS, filters);
    expect(result.every(s => s.pe !== null && (s.pe as number) <= 20)).toBe(true);
  });

  it('between filter: rsi14 between 30-70', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'rsi14', operator: 'between', value: [30, 70], enabled: true }];
    const result = filterStocks(STOCKS, filters);
    expect(result.every(s => s.rsi14 >= 30 && s.rsi14 <= 70)).toBe(true);
  });

  it('in filter: sector in [IT, Banking]', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'sector', operator: 'in', value: ['IT', 'Banking'], enabled: true }];
    const result = filterStocks(STOCKS, filters);
    expect(result.every(s => ['IT', 'Banking'].includes(s.sector))).toBe(true);
  });

  it('eq filter: macdSignal = Bullish', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'macdSignal', operator: 'eq', value: 'Bullish', enabled: true }];
    const result = filterStocks(STOCKS, filters);
    expect(result.every(s => s.macdSignal === 'Bullish')).toBe(true);
  });

  it('returns all stocks when no filters active', () => {
    const result = filterStocks(STOCKS, []);
    expect(result.length).toBe(5000);
  });

  it('disabled filters are ignored', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'marketCap', operator: 'gte', value: 1e9, enabled: false }];
    const result = filterStocks(STOCKS, filters);
    expect(result.length).toBe(5000);
  });

  it('combinatorial AND filters', () => {
    const filters: FilterConfig[] = [
      { id: '1', field: 'marketCap', operator: 'gte', value: 10000, enabled: true },
      { id: '2', field: 'roe',       operator: 'gte', value: 15,    enabled: true },
      { id: '3', field: 'sector',    operator: 'in',  value: ['IT', 'Banking'], enabled: true },
    ];
    const result = filterStocks(STOCKS, filters);
    expect(result.every(s =>
      s.marketCap >= 10000 && s.roe >= 15 && ['IT', 'Banking'].includes(s.sector)
    )).toBe(true);
  });

  it('returns empty array when no stocks match', () => {
    const filters: FilterConfig[] = [{ id: '1', field: 'marketCap', operator: 'gte', value: 1e12, enabled: true }];
    const result = filterStocks(STOCKS, filters);
    expect(result.length).toBe(0);
  });
});

describe('Filter Engine — Performance', () => {
  it('filters 5000 stocks with 5 criteria in under 200ms', () => {
    const filters: FilterConfig[] = [
      { id: '1', field: 'marketCap',    operator: 'gte',     value: 10000,          enabled: true },
      { id: '2', field: 'pe',           operator: 'between', value: [10, 30],       enabled: true },
      { id: '3', field: 'sector',       operator: 'in',      value: ['IT', 'Banking'], enabled: true },
      { id: '4', field: 'rsi14',        operator: 'between', value: [30, 70],       enabled: true },
      { id: '5', field: 'debtToEquity', operator: 'lte',     value: 1.0,            enabled: true },
    ];

    const start = performance.now();
    const result = filterStocks(STOCKS, filters);
    const elapsed = performance.now() - start;

    console.log(`Filter time: ${elapsed.toFixed(2)}ms for ${STOCKS.length} stocks → ${result.length} results`);
    expect(elapsed).toBeLessThan(200);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('search query filters correctly', () => {
    const result = filterStocks(STOCKS, [], 'IT');
    expect(result.length).toBeGreaterThan(0);
  });
});
