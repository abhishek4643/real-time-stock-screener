'use client';
import { memo, useRef, useEffect, useState } from 'react';
import { formatPrice, formatPercent, formatVolume, formatMarketCap, formatPE } from '@/lib/formatters';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import { clsx } from 'clsx';
import type { Stock, PriceUpdate } from '@/types/stock';

// PriceCell — with flash animation on update
interface PriceCellProps {
  value: number;
  update?: PriceUpdate;
}

export const PriceCell = memo(function PriceCell({ value, update }: PriceCellProps) {
  const [flashClass, setFlashClass] = useState('');
  const prevPrice = useRef(value);

  useEffect(() => {
    if (update && update.lastPrice !== prevPrice.current) {
      const dir = update.direction;
      setFlashClass(dir === 'up' ? 'flash-green' : dir === 'down' ? 'flash-red' : '');
      prevPrice.current = update.lastPrice;
      const timer = setTimeout(() => setFlashClass(''), 350);
      return () => clearTimeout(timer);
    }
  }, [update]);

  const displayPrice = update?.lastPrice ?? value;

  return (
    <span className={clsx('num-cell font-semibold text-themed-primary', flashClass)}>
      {formatPrice(displayPrice)}
    </span>
  );
}, (prev, next) => prev.update?.timestamp === next.update?.timestamp && prev.value === next.value);

// ChangeCell
interface ChangeCellProps {
  changePercent: number;
  changeAbsolute: number;
  update?: PriceUpdate;
}

export const ChangeCell = memo(function ChangeCell({ changePercent, changeAbsolute, update }: ChangeCellProps) {
  const pct = update?.changePercent ?? changePercent;
  const abs = update?.changeAbsolute ?? changeAbsolute;
  const isUp = pct >= 0;
  const isFlat = Math.abs(pct) < 0.01;

  return (
    <div className={clsx('flex items-center gap-1 num-cell', isFlat ? 'text-gray-400' : isUp ? 'text-positive' : 'text-negative')}>
      {isFlat ? <Minus size={12} /> : isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      <div className="flex flex-col leading-none">
        <span className="text-xs">{formatPercent(pct)}</span>
        <span className="text-[10px] text-themed-muted opacity-80">₹{Math.abs(abs).toFixed(2)}</span>
      </div>
    </div>
  );
}, (prev, next) => prev.update?.timestamp === next.update?.timestamp);

// VolumeCell
export const VolumeCell = memo(function VolumeCell({ value, vsAvg }: { value: number; vsAvg: Stock['volumeVsAvg'] }) {
  const colorMap: Record<Stock['volumeVsAvg'], string> = {
    '3x': 'text-brand-500 dark:text-brand-400',
    '2x': 'text-positive',
    'Above': 'text-themed-secondary',
    'Below': 'text-themed-muted',
  };
  return (
    <div className="flex flex-col leading-none">
      <span className={clsx('num-cell', colorMap[vsAvg])}>{formatVolume(value)}</span>
      <span className={clsx('text-[10px]', colorMap[vsAvg], 'opacity-80')}>{vsAvg}</span>
    </div>
  );
});

// MarketCapCell
export const MarketCapCell = memo(function MarketCapCell({ value, category }: { value: number; category: Stock['marketCapCategory'] }) {
  const colorMap: Record<Stock['marketCapCategory'], string> = {
    'Large Cap': 'text-brand-500 dark:text-brand-400',
    'Mid Cap': 'text-cyan-500 dark:text-cyan-400',
    'Small Cap': 'text-yellow-600 dark:text-yellow-400',
    'Micro Cap': 'text-themed-muted',
  };
  return (
    <div className="flex flex-col leading-none">
      <span className="num-cell text-themed-secondary font-medium">{formatMarketCap(value)}</span>
      <span className={clsx('text-[10px]', colorMap[category])}>{category}</span>
    </div>
  );
});

// RSICell
export const RSICell = memo(function RSICell({ value }: { value: number }) {
  const isOverbought = value >= 70;
  const isOversold = value <= 30;
  const width = `${value}%`;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all',
            isOverbought ? 'bg-negative' : isOversold ? 'bg-positive' : 'bg-brand-400'
          )}
          style={{ width }}
        />
      </div>
      <span className={clsx('num-cell text-xs min-w-[32px] text-right',
        isOverbought ? 'text-negative' : isOversold ? 'text-positive' : 'text-gray-300'
      )}>
        {value.toFixed(1)}
      </span>
    </div>
  );
});

// PECell (handle null)
export const PECell = memo(function PECell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-600 text-xs">N/A</span>;
  const isHigh = value > 50;
  return (
    <span className={clsx('num-cell', isHigh ? 'text-negative/80' : 'text-gray-200')}>
      {value.toFixed(1)}
    </span>
  );
});

// WatchlistCell
export const WatchlistCell = memo(function WatchlistCell({
  isWatched,
  onToggle,
}: { isWatched: boolean; onToggle: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onToggle}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={isWatched}
    >
      <Star
        size={14}
        className={clsx('transition-colors', isWatched ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-gray-400')}
      />
    </button>
  );
});

// SectorCell
const SECTOR_COLORS: Record<string, string> = {
  IT:             'bg-purple-500/20 text-purple-300',
  Banking:        'bg-blue-500/20 text-blue-300',
  Pharma:         'bg-green-500/20 text-green-300',
  Auto:           'bg-orange-500/20 text-orange-300',
  FMCG:           'bg-yellow-500/20 text-yellow-300',
  Metal:          'bg-gray-500/20 text-gray-300',
  Energy:         'bg-red-500/20 text-red-300',
  Realty:         'bg-pink-500/20 text-pink-300',
  Telecom:        'bg-cyan-500/20 text-cyan-300',
  Infrastructure: 'bg-amber-500/20 text-amber-300',
  Media:          'bg-fuchsia-500/20 text-fuchsia-300',
  Chemicals:      'bg-lime-500/20 text-lime-300',
  Others:         'bg-slate-500/20 text-slate-300',
};

export const SectorCell = memo(function SectorCell({ sector }: { sector: string }) {
  return (
    <span className={clsx('px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap', SECTOR_COLORS[sector] ?? 'bg-gray-500/20 text-gray-300')}>
      {sector}
    </span>
  );
});

// MACDCell
export const MACDCell = memo(function MACDCell({ signal }: { signal: Stock['macdSignal'] }) {
  const config = {
    Bullish: { cls: 'badge-green', icon: '▲' },
    Bearish: { cls: 'badge-red',   icon: '▼' },
    Neutral: { cls: 'badge-yellow',icon: '▶' },
  }[signal];
  return <span className={clsx('badge', config.cls)}>{config.icon} {signal}</span>;
});
