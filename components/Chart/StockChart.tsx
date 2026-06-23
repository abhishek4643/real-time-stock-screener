'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { calculateSMA, calculateEMA, calculateBollinger, calculateRSI } from '@/lib/indicators';
import type { OHLCV } from '@/types/stock';
import { X, TrendingUp, BarChart2, Activity, Layers, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface StockChartProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  onClose: () => void;
  isDark?: boolean;
}

type IndicatorKey = 'SMA20' | 'SMA50' | 'SMA200' | 'EMA12' | 'EMA26' | 'Bollinger' | 'RSI' | 'Volume';
type TimeFrame = '1M' | '3M' | '6M' | '1Y';

const INDICATOR_COLORS: Record<IndicatorKey, string> = {
  SMA20: '#3B82F6',
  SMA50: '#F97316',
  SMA200: '#8B5CF6',
  EMA12: '#06B6D4',
  EMA26: '#EC4899',
  Bollinger: '#3B82F6',
  RSI: '#8B5CF6',
  Volume: '#94A3B8',
};

export function StockChart({ symbol, companyName, currentPrice, changePercent, onClose, isDark = true }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const candlestickRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const seriesRefs = useRef<Record<string, ISeriesApi<'Line' | 'Area'> | null>>({});

  const [ohlcvData, setOhlcvData] = useState<OHLCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<TimeFrame>('3M');
  const [activeIndicators, setActiveIndicators] = useState<Set<IndicatorKey>>(
    new Set<IndicatorKey>(['SMA20', 'SMA50', 'Bollinger', 'RSI', 'Volume'])
  );
  const [crosshairData, setCrosshairData] = useState<OHLCV | null>(null);

  // Fetch stock history
  useEffect(() => {
    setLoading(true);
    fetch(`/api/stocks/${symbol}`)
      .then(r => r.json())
      .then(json => {
        if (json.data?.history) {
          setOhlcvData(json.data.history);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [symbol]);

  const filterByTimeframe = useCallback((data: OHLCV[], tf: TimeFrame): OHLCV[] => {
    const days = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[tf];
    const cutoff = Date.now() / 1000 - days * 86400;
    return data.filter(d => d.time >= cutoff);
  }, []);

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current || ohlcvData.length === 0) return;

    let chart: IChartApi;
    let rsiChart: IChartApi;

    import('lightweight-charts').then(({ createChart, CrosshairMode }) => {
      if (!chartContainerRef.current) return;

      const bg = isDark ? '#141925' : '#FFFFFF';
      const textColor = isDark ? '#94A3B8' : '#64748B';
      const gridColor = isDark ? '#1E2433' : '#F1F5F9';
      const borderColor = isDark ? '#1E2433' : '#E2E8F0';

      // Cleanup old chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 340,
        layout: { textColor, background: { type: 'solid' as any, color: bg } },
        grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
        crosshair: { mode: CrosshairMode.Normal },
        timeScale: { timeVisible: true, secondsVisible: false, borderColor },
        rightPriceScale: { borderColor },
      });

      chartRef.current = chart;

      // Candlestick series
      const candlestick = chart.addCandlestickSeries({
        upColor: '#22C55E',
        downColor: '#EF4444',
        borderUpColor: '#16A34A',
        borderDownColor: '#DC2626',
        wickUpColor: '#16A34A',
        wickDownColor: '#DC2626',
      });

      const filtered = filterByTimeframe(ohlcvData, timeframe);
      const closes = filtered.map(d => d.close);

      candlestick.setData(filtered as any);
      candlestickRef.current = candlestick as any;

      if (activeIndicators.has('SMA20')) {
        const sma20 = calculateSMA(closes, 20);
        const smaSeries = chart.addLineSeries({ color: INDICATOR_COLORS.SMA20, lineWidth: 1, title: 'SMA 20' });
        smaSeries.setData(filtered.map((d, i) => ({ time: d.time, value: sma20[i] ?? NaN })).filter(d => !isNaN(d.value)) as any);
        seriesRefs.current['SMA20'] = smaSeries as any;
      }

      if (activeIndicators.has('SMA50')) {
        const sma50 = calculateSMA(closes, 50);
        const s = chart.addLineSeries({ color: INDICATOR_COLORS.SMA50, lineWidth: 1, title: 'SMA 50' });
        s.setData(filtered.map((d, i) => ({ time: d.time, value: sma50[i] ?? NaN })).filter(d => !isNaN(d.value)) as any);
      }

      if (activeIndicators.has('SMA200')) {
        const sma200 = calculateSMA(closes, 200);
        const s = chart.addLineSeries({ color: INDICATOR_COLORS.SMA200, lineWidth: 1, title: 'SMA 200' });
        s.setData(filtered.map((d, i) => ({ time: d.time, value: sma200[i] ?? NaN })).filter(d => !isNaN(d.value)) as any);
      }

      if (activeIndicators.has('EMA12')) {
        const ema12 = calculateEMA(closes, 12);
        const s = chart.addLineSeries({ color: INDICATOR_COLORS.EMA12, lineWidth: 1, lineStyle: 1, title: 'EMA 12' });
        s.setData(filtered.map((d, i) => ({ time: d.time, value: ema12[i] ?? NaN })).filter(d => !isNaN(d.value)) as any);
      }

      if (activeIndicators.has('Bollinger')) {
        const boll = calculateBollinger(closes, 20, 2);
        const upper = chart.addLineSeries({ color: INDICATOR_COLORS.Bollinger, lineWidth: 1, lineStyle: 2, title: 'BB Upper' });
        const lower = chart.addLineSeries({ color: INDICATOR_COLORS.Bollinger, lineWidth: 1, lineStyle: 2, title: 'BB Lower' });
        const middle = chart.addLineSeries({ color: '#60A5FA', lineWidth: 1, lineStyle: 2, title: 'BB Mid' });
        upper.setData(filtered.map((d, i) => ({ time: d.time, value: boll[i]?.upper ?? NaN })).filter(d => !isNaN(d.value)) as any);
        lower.setData(filtered.map((d, i) => ({ time: d.time, value: boll[i]?.lower ?? NaN })).filter(d => !isNaN(d.value)) as any);
        middle.setData(filtered.map((d, i) => ({ time: d.time, value: boll[i]?.middle ?? NaN })).filter(d => !isNaN(d.value)) as any);
      }

      // Volume as histogram
      if (activeIndicators.has('Volume')) {
        const volSeries = chart.addHistogramSeries({
          color: '#94A3B850',
          priceFormat: { type: 'volume' },
          priceScaleId: 'volume',
        } as any);
        volSeries.setData(filtered.map(d => ({ time: d.time, value: d.volume, color: d.close >= d.open ? '#22C55E30' : '#EF444430' })) as any);
        chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      }

      // RSI sub-chart
      if (activeIndicators.has('RSI') && rsiContainerRef.current) {
        if (rsiChartRef.current) { rsiChartRef.current.remove(); rsiChartRef.current = null; }

        rsiChart = createChart(rsiContainerRef.current, {
          width: rsiContainerRef.current.clientWidth,
          height: 100,
          layout: { textColor, background: { type: 'solid' as any, color: bg } },
          grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
          crosshair: { mode: CrosshairMode.Normal },
          timeScale: { visible: false, borderColor },
          rightPriceScale: { scaleMargins: { top: 0.1, bottom: 0.1 }, borderColor },
        });

        rsiChartRef.current = rsiChart;

        const rsiVals = calculateRSI(closes, 14);
        const rsiSeries = rsiChart.addLineSeries({ color: INDICATOR_COLORS.RSI, lineWidth: 2, title: 'RSI 14' });
        rsiSeries.setData(filtered.map((d, i) => ({ time: d.time, value: rsiVals[i] ?? NaN })).filter(d => !isNaN(d.value)) as any);

        // Overbought/Oversold lines
        const ob = rsiChart.addLineSeries({ color: '#EF4444', lineWidth: 1, lineStyle: 2 });
        const os = rsiChart.addLineSeries({ color: '#22C55E', lineWidth: 1, lineStyle: 2 });
        const times = filtered.map(d => d.time);
        if (times.length > 0) {
          ob.setData([{ time: times[0], value: 70 }, { time: times[times.length - 1], value: 70 }] as any);
          os.setData([{ time: times[0], value: 30 }, { time: times[times.length - 1], value: 30 }] as any);
        }

        // Sync timescales
        chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
          if (range) rsiChart.timeScale().setVisibleLogicalRange(range);
        });
      }

      // Crosshair data
      chart.subscribeCrosshairMove(param => {
        if (param.point && param.seriesData) {
          const data = param.seriesData.get(candlestick);
          if (data) setCrosshairData(data as any);
        }
      });

      // Responsive resize
      const ro = new ResizeObserver(() => {
        if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        if (rsiContainerRef.current && rsiChart) rsiChart.applyOptions({ width: rsiContainerRef.current.clientWidth });
      });
      if (chartContainerRef.current) ro.observe(chartContainerRef.current);

      return () => {
        ro.disconnect();
        chart.remove();
        if (rsiChart) rsiChart.remove();
        chartRef.current = null;
        rsiChartRef.current = null;
      };
    });
  }, [ohlcvData, timeframe, activeIndicators, isDark, filterByTimeframe]);

  const toggleIndicator = (key: IndicatorKey) => {
    setActiveIndicators(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isUp = changePercent >= 0;

  return (
    <div className="flex flex-col h-full bg-themed-surface/80 border-l border-themed backdrop-blur-2xl relative shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
      {/* Ambient background glow matching price trend */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ background: isUp ? 'radial-gradient(circle at center top, #22C55E, transparent 60%)' : 'radial-gradient(circle at center top, #EF4444, transparent 60%)' }}
      />
      
      {/* Chart Header */}
      <div className="px-5 py-4 border-b border-themed bg-themed-header/50 flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-extrabold text-themed-primary text-lg">{symbol}</span>
            <span className={clsx('text-base font-bold tabular-nums', isUp ? 'text-positive' : 'text-negative')}>
              ₹{currentPrice.toFixed(2)}
            </span>
            <div className={clsx('flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold', isUp ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative')}>
              {isUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
              <span>{Math.abs(changePercent).toFixed(2)}%</span>
            </div>
          </div>
          <div className="text-[11px] text-themed-muted uppercase tracking-wide font-semibold mt-1">{companyName}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOhlcvData([])}
            className="p-2 rounded-lg bg-themed-input hover:bg-brand-500/10 text-themed-secondary hover:text-brand-500 transition-colors focus-ring"
            aria-label="Refresh chart"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-themed-input hover:bg-negative/10 text-themed-secondary hover:text-negative transition-colors focus-ring"
            aria-label="Close chart"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="px-5 py-3 border-b border-themed flex items-center gap-3 relative z-10">
        <div className="flex items-center p-1 rounded-lg bg-themed-input border border-themed-subtle">
          {(['1M', '3M', '6M', '1Y'] as TimeFrame[]).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={clsx(
                'px-3 py-1 rounded-md text-[11px] font-bold transition-all',
                timeframe === tf 
                  ? 'bg-themed-surface text-brand-500 shadow-sm' 
                  : 'text-themed-muted hover:text-themed-primary'
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Indicator toggles */}
        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          {(Object.entries(INDICATOR_COLORS) as [IndicatorKey, string][]).map(([key, color]) => {
            const isActive = activeIndicators.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleIndicator(key)}
                className={clsx(
                  'px-2.5 py-1 rounded-md text-[10px] font-bold transition-all duration-300 border',
                  isActive
                    ? 'border-transparent text-white'
                    : 'border-themed text-themed-muted hover:border-themed-strong hover:text-themed-primary bg-themed-input'
                )}
                style={isActive ? { backgroundColor: color, boxShadow: `0 0 10px ${color}40` } : {}}
                aria-pressed={isActive}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Crosshair OHLCV tooltip */}
      {crosshairData && (
        <div className="px-5 py-2 border-b border-themed flex items-center gap-5 text-[11px] font-mono relative z-10 bg-themed-surface/50">
          <span className="text-themed-muted">O: <span className="text-themed-primary font-semibold">₹{crosshairData.open?.toFixed(2)}</span></span>
          <span className="text-themed-muted">H: <span className="text-positive font-semibold">₹{crosshairData.high?.toFixed(2)}</span></span>
          <span className="text-themed-muted">L: <span className="text-negative font-semibold">₹{crosshairData.low?.toFixed(2)}</span></span>
          <span className="text-themed-muted">C: <span className="text-themed-primary font-semibold">₹{crosshairData.close?.toFixed(2)}</span></span>
          <span className="text-themed-muted">V: <span className="text-brand-500 font-semibold">{crosshairData.volume?.toLocaleString('en-IN')}</span></span>
        </div>
      )}

      {/* Chart area */}
      <div className="flex-1 overflow-hidden relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 border-2 border-brand-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-themed-muted text-[11px] uppercase tracking-widest font-semibold">Loading Chart</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div ref={chartContainerRef} className="flex-1" />
            {activeIndicators.has('RSI') && (
              <div>
                <div className="px-3 py-1 text-[9px] text-themed-muted font-bold uppercase tracking-[0.2em] border-t border-themed bg-themed-input">
                  RSI (14) — <span className="text-negative/70">Overbought 70</span> | <span className="text-positive/70">Oversold 30</span>
                </div>
                <div ref={rsiContainerRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
