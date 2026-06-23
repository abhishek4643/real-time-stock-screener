'use client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import type { FilterConfig, SortConfig, Stock, PriceUpdate, WSConnectionStatus } from '@/types/stock';

interface StockStore {
  // Universe
  stockUniverse: Stock[];
  setStockUniverse: (stocks: Stock[]) => void;

  // Filter state
  activeFilters: FilterConfig[];
  searchQuery: string;
  addFilter: (filter: FilterConfig) => void;
  updateFilter: (filterId: string, updates: Partial<FilterConfig>) => void;
  removeFilter: (filterId: string) => void;
  clearAllFilters: () => void;
  setSearchQuery: (q: string) => void;

  // Sort state
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;

  // Selection state
  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;

  // Real-time prices
  livePrices: Record<string, PriceUpdate>;
  batchUpdatePrices: (updates: Record<string, PriceUpdate>) => void;

  // WebSocket status
  wsStatus: WSConnectionStatus;
  setWsStatus: (status: WSConnectionStatus) => void;

  // Watchlist
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  showWatchlistOnly: boolean;
  toggleWatchlistOnly: () => void;

  // Filter panel
  filterPanelOpen: boolean;
  toggleFilterPanel: () => void;
  chartPanelOpen: boolean;
  toggleChartPanel: () => void;
}

export const useStockStore = create<StockStore>()(
  immer(
    devtools(
      persist(
        (set, get) => ({
          // Universe
          stockUniverse: [],
          setStockUniverse: (stocks) => set((state) => { state.stockUniverse = stocks; }),

          // Filters
          activeFilters: [],
          searchQuery: '',
          addFilter: (filter) => set((state) => {
            const existing = state.activeFilters.findIndex(f => f.field === filter.field);
            if (existing >= 0) {
              state.activeFilters[existing] = filter;
            } else {
              state.activeFilters.push(filter);
            }
          }),
          updateFilter: (filterId, updates) => set((state) => {
            const idx = state.activeFilters.findIndex(f => f.id === filterId);
            if (idx >= 0) Object.assign(state.activeFilters[idx], updates);
          }),
          removeFilter: (filterId) => set((state) => {
            state.activeFilters = state.activeFilters.filter(f => f.id !== filterId);
          }),
          clearAllFilters: () => set((state) => {
            state.activeFilters = [];
            state.searchQuery = '';
          }),
          setSearchQuery: (q) => set((state) => { state.searchQuery = q; }),

          // Sort
          sortConfig: { column: 'marketCap', direction: 'desc' },
          setSortConfig: (config) => set((state) => { state.sortConfig = config; }),

          // Selection
          selectedSymbol: null,
          setSelectedSymbol: (symbol) => set((state) => { state.selectedSymbol = symbol; }),

          // Live prices
          livePrices: {},
          batchUpdatePrices: (updates) => set((state) => {
            for (const [symbol, update] of Object.entries(updates)) {
              state.livePrices[symbol] = update;
            }
          }),

          // WebSocket status
          wsStatus: 'connecting',
          setWsStatus: (status) => set((state) => { state.wsStatus = status; }),

          // Watchlist
          watchlist: [],
          toggleWatchlist: (symbol) => set((state) => {
            const idx = state.watchlist.indexOf(symbol);
            if (idx >= 0) state.watchlist.splice(idx, 1);
            else state.watchlist.push(symbol);
          }),
          isInWatchlist: (symbol) => get().watchlist.includes(symbol),
          showWatchlistOnly: false,
          toggleWatchlistOnly: () => set((state) => { state.showWatchlistOnly = !state.showWatchlistOnly; }),

          // UI
          filterPanelOpen: false,
          toggleFilterPanel: () => set((state) => { state.filterPanelOpen = !state.filterPanelOpen; }),
          chartPanelOpen: false,
          toggleChartPanel: () => set((state) => { state.chartPanelOpen = !state.chartPanelOpen; }),
        }),
        {
          name: 'equitypulse-store',
          partialize: (state) => ({
            watchlist: state.watchlist,
            filterPanelOpen: state.filterPanelOpen,
            sortConfig: state.sortConfig,
          }),
        }
      )
    )
  )
);
