'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { useStockStore } from '@/stores/stockStore';
import { filterStocks } from '@/lib/filterEngine';
import type { Stock } from '@/types/stock';

interface UseStockScreenerOptions {
  enabled?: boolean;
}

export function useStockScreener({ enabled = true }: UseStockScreenerOptions = {}) {
  const filters = useStockStore((s) => s.activeFilters);
  const searchQuery = useStockStore((s) => s.searchQuery);
  const sortConfig = useStockStore((s) => s.sortConfig);
  const livePrices = useStockStore((s) => s.livePrices);
  const setStockUniverse = useStockStore((s) => s.setStockUniverse);
  const showWatchlistOnly = useStockStore((s) => s.showWatchlistOnly);
  const watchlist = useStockStore((s) => s.watchlist);
  const queryClient = useQueryClient();

  const { data: allStocks, isLoading, error } = useQuery<Stock[]>({
    queryKey: ['stocks', 'universe'],
    queryFn: async () => {
      const res = await fetch('/api/stocks');
      if (!res.ok) throw new Error('Failed to fetch stocks');
      const json = await res.json();
      const stocks = json.data as Stock[];
      setStockUniverse(stocks);
      return stocks;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  // Merge live prices into stock data
  const mergedStocks = useMemo(() => {
    if (!allStocks) return [];
    return allStocks.map(stock => {
      const live = livePrices[stock.symbol];
      if (!live) return stock;
      return {
        ...stock,
        lastPrice: live.lastPrice,
        changePercent: live.changePercent,
        changeAbsolute: live.changeAbsolute,
        lastUpdated: live.timestamp,
      };
    });
  }, [allStocks, livePrices]);

  // Apply filters + search + watchlist
  const filteredStocks = useMemo(() => {
    let result = filterStocks(mergedStocks, filters, searchQuery);
    if (showWatchlistOnly) {
      result = result.filter(s => watchlist.includes(s.symbol));
    }
    return result;
  }, [mergedStocks, filters, searchQuery, showWatchlistOnly, watchlist]);

  // Apply sort
  const sortedStocks = useMemo(() => {
    const { column, direction } = sortConfig;
    return [...filteredStocks].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredStocks, sortConfig]);

  const prefetchStockDetail = useCallback((symbol: string) => {
    queryClient.prefetchQuery({
      queryKey: ['stock', symbol],
      queryFn: () => fetch(`/api/stocks/${symbol}`).then(r => r.json()),
    });
  }, [queryClient]);

  return {
    stocks: sortedStocks,
    allStocksCount: allStocks?.length ?? 0,
    filteredCount: filteredStocks.length,
    isLoading,
    error,
    prefetchStockDetail,
  };
}
