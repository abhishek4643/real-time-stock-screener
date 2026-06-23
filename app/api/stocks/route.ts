import { NextResponse } from 'next/server';
import { getStockUniverse } from '@/lib/stockCache';

export async function GET(request: Request) {
  const start = performance.now();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '5000');

  try {
    const stocks = getStockUniverse();
    const paginated = stocks.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      meta: {
        total: stocks.length,
        page,
        pageSize,
        timestamp: new Date().toISOString(),
        executionTimeMs: Math.round(performance.now() - start),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        meta: { total: 0, page, pageSize, timestamp: new Date().toISOString(), executionTimeMs: 0 },
        error: { code: 'INTERNAL_ERROR', message: String(error) },
      },
      { status: 500 }
    );
  }
}
