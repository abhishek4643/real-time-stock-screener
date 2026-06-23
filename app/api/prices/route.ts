import { NextResponse } from 'next/server';
import { getStockUniverse } from '@/lib/stockCache';
import { simulateNextPrice } from '@/lib/ohlcvGenerator';
import type { PriceUpdate } from '@/types/stock';

export async function GET() {
  const stocks = getStockUniverse();

  const updateCount = Math.min(50, Math.floor(stocks.length * 0.01));
  const updates: PriceUpdate[] = [];

  for (let i = 0; i < updateCount; i++) {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const newPrice = simulateNextPrice(stock.lastPrice, 0.01 + stock.beta * 0.005);
    const changeAbsolute = newPrice - stock.previousClose;
    const changePercent = (changeAbsolute / stock.previousClose) * 100;

    stock.lastPrice = Math.round(newPrice * 100) / 100;
    stock.changeAbsolute = Math.round(changeAbsolute * 100) / 100;
    stock.changePercent = Math.round(changePercent * 100) / 100;
    stock.lastUpdated = Date.now();

    updates.push({
      symbol: stock.symbol,
      lastPrice: stock.lastPrice,
      changePercent: stock.changePercent,
      changeAbsolute: stock.changeAbsolute,
      volume: stock.volume + Math.round(Math.random() * 10000),
      timestamp: Date.now(),
      direction: changeAbsolute > 0 ? 'up' : changeAbsolute < 0 ? 'down' : 'flat',
    });
  }

  return NextResponse.json({ success: true, data: updates, timestamp: Date.now() });
}
