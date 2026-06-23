import { generateMockStocks } from '@/lib/mockDataGenerator';
import type { Stock } from '@/types/stock';

// Shared server-side cache for the stock universe
let cachedStocks: Stock[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function getStockUniverse(): Stock[] {
  if (cachedStocks && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedStocks;
  }
  cachedStocks = generateMockStocks(5000);
  cacheTimestamp = Date.now();
  return cachedStocks;
}
