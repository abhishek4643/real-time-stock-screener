import { NextResponse } from 'next/server';
import { getStockUniverse } from '@/lib/stockCache';
import { generateOHLCV } from '@/lib/ohlcvGenerator';

export async function GET(
  _request: Request,
  { params }: { params: { symbol: string } }
) {
  const start = performance.now();
  const { symbol } = params;

  const stocks = getStockUniverse();
  const stock = stocks.find(s => s.symbol === symbol);

  if (!stock) {
    return NextResponse.json(
      { success: false, data: null, error: { code: 'NOT_FOUND', message: `Symbol ${symbol} not found` } },
      { status: 404 }
    );
  }

  const history = generateOHLCV(stock.lastPrice, 365, 0.018 + stock.beta * 0.01, stock.avgVolume20D);

  return NextResponse.json({
    success: true,
    data: { ...stock, history },
    meta: {
      total: 1,
      page: 1,
      pageSize: 1,
      timestamp: new Date().toISOString(),
      executionTimeMs: Math.round(performance.now() - start),
    },
  });
}
