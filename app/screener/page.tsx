'use client';
import { Suspense, lazy, useCallback } from 'react';
import { useStockStore } from '@/stores/stockStore';
import { Header } from '@/components/Layout/Header';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { DataGrid } from '@/components/DataGrid/DataGrid';
import { useStockScreener } from '@/hooks/useStockScreener';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { ShaderBackground } from '@/components/Layout/ShaderBackground';

const StockChart = lazy(() => import('@/components/Chart/StockChart').then(m => ({ default: m.StockChart })));

export default function ScreenerPage() {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  const selectedSymbol = useStockStore((s) => s.selectedSymbol);
  const chartPanelOpen = useStockStore((s) => s.chartPanelOpen);
  const setSelectedSymbol = useStockStore((s) => s.setSelectedSymbol);
  const toggleChartPanel = useStockStore((s) => s.toggleChartPanel);
  const searchQuery = useStockStore((s) => s.searchQuery);
  const setSearchQuery = useStockStore((s) => s.setSearchQuery);
  const livePrices = useStockStore((s) => s.livePrices);

  // Start real-time price updates
  useRealtimeUpdates();

  // Get screener data
  const { stocks, allStocksCount, filteredCount, isLoading } = useStockScreener();

  const selectedStock = selectedSymbol
    ? stocks.find(s => s.symbol === selectedSymbol) ?? null
    : null;

  const handleCloseChart = useCallback(() => {
    if (chartPanelOpen) toggleChartPanel();
    setSelectedSymbol(null);
  }, [chartPanelOpen, toggleChartPanel, setSelectedSymbol]);

  // Get live price for selected stock
  const selectedLiveData = selectedSymbol ? livePrices[selectedSymbol] : undefined;
  const selectedPrice = selectedLiveData?.lastPrice ?? selectedStock?.lastPrice ?? 0;
  const selectedChange = selectedLiveData?.changePercent ?? selectedStock?.changePercent ?? 0;

  return (
    <div className={clsx('min-h-screen flex flex-col relative', isDark ? 'dark' : '')}>
      <ShaderBackground />
      {/* Header */}
      <Header
        filteredCount={filteredCount}
        totalCount={allStocksCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Filter Sidebar */}
        <FilterPanel filteredCount={filteredCount} totalCount={allStocksCount} />

        {/* Data Grid */}
        <div className={clsx(
          'flex flex-col overflow-hidden transition-all duration-300',
          chartPanelOpen ? 'flex-1 min-w-0' : 'flex-1'
        )}>
          <DataGrid stocks={stocks} isLoading={isLoading} />
        </div>

        {/* Chart Panel */}
        {chartPanelOpen && selectedSymbol && (
          <div className="w-[420px] xl:w-[520px] 2xl:w-[600px] flex-shrink-0 overflow-hidden animate-slide-in">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center bg-surface-900/80 border-l border-white/10">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <StockChart
                symbol={selectedSymbol}
                companyName={selectedStock?.companyName ?? selectedSymbol}
                currentPrice={selectedPrice}
                changePercent={selectedChange}
                onClose={handleCloseChart}
                isDark={isDark}
              />
            </Suspense>
          </div>
        )}
      </div>

      {/* Performance status bar */}
      <div className="h-6 border-t border-themed bg-themed-header/50 flex items-center px-4 gap-4">
        <span className="text-[10px] text-themed-muted font-medium">
          EquityPulse v1.0 — Production Stock Screener
        </span>
        <span className="text-[10px] text-themed-secondary">|</span>
        <span className="text-[10px] text-themed-muted font-medium">
          {filteredCount.toLocaleString('en-IN')} / {allStocksCount.toLocaleString('en-IN')} stocks
        </span>
        <span className="text-[10px] text-themed-secondary">|</span>
        <span className="text-[10px] text-themed-muted font-medium">
          NSE + BSE © {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}
