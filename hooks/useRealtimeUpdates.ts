'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useStockStore } from '@/stores/stockStore';
import type { PriceUpdate } from '@/types/stock';

// WebSocket simulation using polling (since Next.js doesn't support raw WS in App Router)
// This simulates a WebSocket connection by polling the /api/prices endpoint

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000];
const POLL_INTERVAL = 2000; // Poll every 2 seconds

export function useRealtimeUpdates() {
  const setWsStatus = useStockStore((s) => s.setWsStatus);
  const batchUpdatePrices = useStockStore((s) => s.batchUpdatePrices);

  const pendingUpdates = useRef<Record<string, PriceUpdate>>({});
  const rafId = useRef<number | null>(null);
  const reconnectAttempt = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnected = useRef(false);

  const flushUpdates = useCallback(() => {
    if (Object.keys(pendingUpdates.current).length > 0) {
      batchUpdatePrices({ ...pendingUpdates.current });
      pendingUpdates.current = {};
    }
    rafId.current = null;
  }, [batchUpdatePrices]);

  const scheduleFlush = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(flushUpdates);
    }
  }, [flushUpdates]);

  const fetchPriceUpdates = useCallback(async () => {
    try {
      const response = await fetch('/api/prices', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch prices');

      const json = await response.json();
      const updates: PriceUpdate[] = json.data;

      if (!isConnected.current) {
        isConnected.current = true;
        reconnectAttempt.current = 0;
        setWsStatus('connected');
      }

      for (const update of updates) {
        pendingUpdates.current[update.symbol] = update;
      }
      scheduleFlush();
    } catch (error) {
      console.warn('Price update error:', error);
      if (isConnected.current) {
        isConnected.current = false;
        setWsStatus('reconnecting');
      }
      reconnectAttempt.current++;
    }
  }, [setWsStatus, scheduleFlush]);

  useEffect(() => {
    setWsStatus('connecting');

    // Initial fetch
    fetchPriceUpdates();

    // Set up polling interval
    intervalRef.current = setInterval(fetchPriceUpdates, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      isConnected.current = false;
    };
  }, [fetchPriceUpdates, setWsStatus]);
}
