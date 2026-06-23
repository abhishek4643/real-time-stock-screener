'use client';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useRef, useCallback, useMemo, useState } from 'react';
import type { Stock } from '@/types/stock';
import { useStockStore } from '@/stores/stockStore';
import {
  PriceCell, ChangeCell, VolumeCell, MarketCapCell,
  RSICell, PECell, WatchlistCell, SectorCell, MACDCell,
} from '@/components/cells/Cells';
import { formatPercent } from '@/lib/formatters';
import { ArrowUp, ArrowDown, ArrowUpDown, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';

const ROW_HEIGHT = 44;
const OVERSCAN = 12;

const columnHelper = createColumnHelper<Stock>();

interface DataGridProps {
  stocks: Stock[];
  isLoading: boolean;
}

export const DataGrid = memo(function DataGrid({ stocks, isLoading }: DataGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSymbol = useStockStore((s) => s.selectedSymbol);
  const setSelectedSymbol = useStockStore((s) => s.setSelectedSymbol);
  const toggleWatchlist = useStockStore((s) => s.toggleWatchlist);
  const watchlist = useStockStore((s) => s.watchlist);
  const livePrices = useStockStore((s) => s.livePrices);
  const toggleChartPanel = useStockStore((s) => s.toggleChartPanel);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'marketCap', desc: true }]);

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'watchlist',
      header: '',
      size: 44,
      cell: ({ row }) => {
        const sym = row.original.symbol;
        return (
          <WatchlistCell
            isWatched={watchlist.includes(sym)}
            onToggle={e => { e.stopPropagation(); toggleWatchlist(sym); }}
          />
        );
      },
    }),
    columnHelper.accessor('symbol', {
      header: 'Symbol',
      size: 110,
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-mono font-bold text-brand-400 text-sm">{getValue()}</div>
          <div className="text-[10px] text-gray-500 truncate max-w-[100px]">{row.original.companyName.split(' ').slice(0, 2).join(' ')}</div>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('lastPrice', {
      header: 'LTP',
      size: 130,
      cell: ({ getValue, row }) => (
        <PriceCell value={getValue()} update={livePrices[row.original.symbol]} />
      ),
    }),
    columnHelper.accessor('changePercent', {
      header: '% Change',
      size: 110,
      cell: ({ getValue, row }) => (
        <ChangeCell
          changePercent={getValue()}
          changeAbsolute={row.original.changeAbsolute}
          update={livePrices[row.original.symbol]}
        />
      ),
    }),
    columnHelper.accessor('marketCap', {
      header: 'Mkt Cap',
      size: 130,
      cell: ({ getValue, row }) => <MarketCapCell value={getValue()} category={row.original.marketCapCategory} />,
    }),
    columnHelper.accessor('volume', {
      header: 'Volume',
      size: 100,
      cell: ({ getValue, row }) => <VolumeCell value={getValue()} vsAvg={row.original.volumeVsAvg} />,
    }),
    columnHelper.accessor('pe', {
      header: 'P/E',
      size: 80,
      cell: ({ getValue }) => <PECell value={getValue()} />,
    }),
    columnHelper.accessor('pb', {
      header: 'P/B',
      size: 70,
      cell: ({ getValue }) => <span className="num-cell text-themed-secondary font-medium">{getValue()?.toFixed(1)}</span>,
    }),
    columnHelper.accessor('roe', {
      header: 'ROE %',
      size: 80,
      cell: ({ getValue }) => {
        const v = getValue();
        return <span className={clsx('num-cell font-medium', v >= 15 ? 'text-positive' : v < 0 ? 'text-negative' : 'text-themed-secondary')}>{v?.toFixed(1)}%</span>;
      },
    }),
    columnHelper.accessor('roce', {
      header: 'ROCE %',
      size: 85,
      cell: ({ getValue }) => {
        const v = getValue();
        return <span className={clsx('num-cell font-medium', v >= 20 ? 'text-positive' : v < 0 ? 'text-negative' : 'text-themed-secondary')}>{v?.toFixed(1)}%</span>;
      },
    }),
    columnHelper.accessor('dividendYield', {
      header: 'Div Yield',
      size: 90,
      cell: ({ getValue }) => <span className="num-cell text-themed-secondary font-medium">{formatPercent(getValue(), 2)}</span>,
    }),
    columnHelper.accessor('promoterHolding', {
      header: 'Promoter %',
      size: 100,
      cell: ({ getValue }) => {
        const v = getValue();
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-themed-strong rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${v}%` }} />
            </div>
            <span className="num-cell text-xs text-themed-secondary font-medium min-w-[32px]">{v?.toFixed(0)}%</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('debtToEquity', {
      header: 'D/E',
      size: 70,
      cell: ({ getValue }) => {
        const v = getValue();
        return <span className={clsx('num-cell font-medium', v > 2 ? 'text-negative/80' : 'text-themed-secondary')}>{v?.toFixed(2)}</span>;
      },
    }),
    columnHelper.accessor('rsi14', {
      header: 'RSI (14)',
      size: 120,
      cell: ({ getValue }) => <RSICell value={getValue()} />,
    }),
    columnHelper.accessor('macdSignal', {
      header: 'MACD',
      size: 100,
      cell: ({ getValue }) => <MACDCell signal={getValue()} />,
    }),
    columnHelper.accessor('sector', {
      header: 'Sector',
      size: 110,
      cell: ({ getValue }) => <SectorCell sector={getValue()} />,
    }),
    columnHelper.accessor('beta', {
      header: 'Beta',
      size: 70,
      cell: ({ getValue }) => {
        const v = getValue();
        return <span className={clsx('num-cell', v > 1.5 ? 'text-negative/80' : v < 0.5 ? 'text-gray-500' : 'text-gray-300')}>{v?.toFixed(2)}</span>;
      },
    }),
    columnHelper.accessor('week52HighProximity', {
      header: '52W High %',
      size: 100,
      cell: ({ getValue }) => <span className="num-cell text-gray-300">{getValue()?.toFixed(1)}%</span>,
    }),
    columnHelper.accessor('revenueGrowthYoY', {
      header: 'Rev Growth',
      size: 100,
      cell: ({ getValue }) => {
        const v = getValue();
        return <span className={clsx('num-cell', v >= 20 ? 'text-positive' : v < 0 ? 'text-negative' : 'text-gray-300')}>{formatPercent(v)}</span>;
      },
    }),
  ], [watchlist, livePrices, toggleWatchlist]);

  const table = useReactTable({
    data: stocks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom = virtualRows.length > 0
    ? totalSize - virtualRows[virtualRows.length - 1].end
    : 0;

  const handleRowClick = useCallback((symbol: string) => {
    setSelectedSymbol(symbol);
    useStockStore.getState().toggleChartPanel();
  }, [setSelectedSymbol]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-themed-base">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-themed-muted text-sm font-semibold tracking-wide uppercase">Initializing Data Engine...</p>
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-themed-base">
        <div className="text-center space-y-4 max-w-sm p-8 rounded-2xl glass-panel">
          <div className="w-16 h-16 rounded-full bg-themed-input flex items-center justify-center mx-auto shadow-inner">
            <BarChart2 size={32} className="text-themed-muted" />
          </div>
          <div>
            <p className="text-themed-primary font-bold text-lg">No matches found</p>
            <p className="text-themed-muted text-sm mt-1">Try relaxing your filter criteria or searching for a different symbol.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-themed-base relative">
      {/* Search and Filters Status */}
      <div className="px-5 py-3 border-b border-themed bg-themed-header/50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {stocks.length > 0 && (
            <span className="text-[11px] font-semibold text-themed-muted uppercase tracking-wider">
              {stocks.length.toLocaleString('en-IN')} Matches
            </span>
          )}
          <div className="flex items-center gap-3">
            {table.getAllColumns().find(c => c.id === 'volumeVsAvg')?.getIsFiltered() && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-500/10 text-brand-500 dark:text-brand-400">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" /> Breakout Vol
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto virtual-list"
        role="grid"
        aria-label="Stock Screener Results"
        aria-rowcount={stocks.length}
        aria-colcount={columns.length}
      >
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-10 bg-themed-header backdrop-blur-xl border-b border-themed-strong shadow-sm"
          role="row"
          aria-rowindex={1}
        >
          <div className="flex" style={{ width: table.getTotalSize() || 'auto' }}>
            {table.getFlatHeaders().map((header, i) => (
              <div
                key={header.id}
                role="columnheader"
                aria-colindex={i + 1}
                aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
                style={{ width: header.getSize() }}
                className="flex-shrink-0 px-3 py-3 select-none border-r border-themed-subtle last:border-r-0"
              >
                <div
                  className={clsx(
                    'flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500',
                    header.column.getCanSort() && 'cursor-pointer hover:text-gray-300 transition-colors'
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                  tabIndex={header.column.getCanSort() ? 0 : -1}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      header.column.toggleSorting();
                    }
                  }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' && <ArrowUp size={10} className="text-brand-400" />}
                  {header.column.getIsSorted() === 'desc' && <ArrowDown size={10} className="text-brand-400" />}
                  {!header.column.getIsSorted() && header.column.getCanSort() && (
                    <ArrowUpDown size={10} className="text-gray-700 hover:text-gray-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Virtual rows */}
        <div style={{ height: totalSize, position: 'relative' }}>
          {paddingTop > 0 && <div style={{ height: paddingTop }} />}

          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index];
            const isSelected = row.original.symbol === selectedSymbol;

            return (
              <div
                key={row.id}
                role="row"
                aria-rowindex={virtualRow.index + 2}
                aria-selected={isSelected}
                style={{ height: ROW_HEIGHT }}
                className={clsx(
                  'flex items-center grid-row',
                  isSelected && 'selected'
                )}
                onClick={() => handleRowClick(row.original.symbol)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRowClick(row.original.symbol);
                }}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <div
                    key={cell.id}
                    role="gridcell"
                    aria-colindex={i + 1}
                    style={{ width: cell.column.getSize(), flexShrink: 0 }}
                    className="px-3 overflow-hidden"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}

          {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
        </div>
      </div>
    </div>
  );
});
