import type { FilterDefinition } from '@/types/stock';

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  { field: 'marketCap',        label: 'Market Cap (Cr)',    type: 'range',       category: 'Fundamentals',    min: 0,    max: 2000000, step: 100,  unit: '₹ Cr' },
  { field: 'pe',               label: 'P/E Ratio',          type: 'range',       category: 'Fundamentals',    min: -100, max: 500,    step: 1 },
  { field: 'pb',               label: 'P/B Ratio',          type: 'range',       category: 'Fundamentals',    min: 0,    max: 100,    step: 0.1 },
  { field: 'dividendYield',    label: 'Dividend Yield (%)', type: 'range',       category: 'Fundamentals',    min: 0,    max: 25,     step: 0.1,  unit: '%' },
  { field: 'eps',              label: 'EPS (₹)',            type: 'range',       category: 'Fundamentals',    min: -500, max: 5000,   step: 1,    unit: '₹' },
  { field: 'roe',              label: 'ROE (%)',            type: 'range',       category: 'Fundamentals',    min: -100, max: 200,    step: 1,    unit: '%' },
  { field: 'roce',             label: 'ROCE (%)',           type: 'range',       category: 'Fundamentals',    min: -100, max: 200,    step: 1,    unit: '%' },
  { field: 'debtToEquity',     label: 'Debt/Equity',        type: 'range',       category: 'Fundamentals',    min: 0,    max: 15,     step: 0.1 },
  { field: 'currentRatio',     label: 'Current Ratio',      type: 'range',       category: 'Fundamentals',    min: 0,    max: 20,     step: 0.1 },
  { field: 'promoterHolding',  label: 'Promoter Holding (%)',type: 'range',      category: 'Fundamentals',    min: 0,    max: 100,    step: 1,    unit: '%' },
  { field: 'revenueGrowthYoY', label: 'Revenue Growth YoY (%)',type: 'range',   category: 'Fundamentals',    min: -100, max: 500,    step: 1,    unit: '%' },
  { field: 'profitGrowthYoY',  label: 'Profit Growth YoY (%)', type: 'range',   category: 'Fundamentals',    min: -100, max: 1000,   step: 1,    unit: '%' },

  { field: 'lastPrice',        label: 'Last Price (₹)',      type: 'range',      category: 'Market Data',     min: 0,    max: 500000, step: 10,   unit: '₹' },
  { field: 'week52HighProximity', label: '52W High Proximity (%)', type: 'range', category: 'Market Data',   min: 0,    max: 100,    step: 1,    unit: '%' },
  { field: 'week52LowProximity',  label: '52W Low Proximity (%)',  type: 'range', category: 'Market Data',   min: 0,    max: 100,    step: 1,    unit: '%' },
  { field: 'avgVolume20D',     label: 'Avg Volume (20D)',    type: 'range',       category: 'Market Data',     min: 0,    max: 100000000, step: 10000 },
  { field: 'beta',             label: 'Beta',               type: 'range',       category: 'Market Data',     min: -2,   max: 5,      step: 0.1 },
  { field: 'changePercent',    label: 'Day Change (%)',      type: 'range',       category: 'Market Data',     min: -20,  max: 20,     step: 0.5,  unit: '%' },

  {
    field: 'sector',
    label: 'Sector',
    type: 'multiselect',
    category: 'Classification',
    options: ['IT', 'Banking', 'Pharma', 'Auto', 'FMCG', 'Metal', 'Energy', 'Realty', 'Telecom', 'Infrastructure', 'Media', 'Chemicals', 'Others'],
  },
  {
    field: 'marketCapCategory',
    label: 'Market Cap Category',
    type: 'multiselect',
    category: 'Classification',
    options: ['Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'],
  },
  {
    field: 'indexMembership',
    label: 'Index Membership',
    type: 'multiselect',
    category: 'Classification',
    options: ['NIFTY 50', 'NIFTY Next 50', 'NIFTY Midcap 100', 'NIFTY Smallcap 250', 'BSE Sensex'],
  },

  { field: 'rsi14',           label: 'RSI (14)',            type: 'range',       category: 'Technical',       min: 0,    max: 100,    step: 1 },
  { field: 'atr',             label: 'ATR',                 type: 'range',       category: 'Technical',       min: 0,    max: 500,    step: 1 },
  {
    field: 'macdSignal',
    label: 'MACD Signal',
    type: 'select',
    category: 'Technical',
    options: ['Bullish', 'Bearish', 'Neutral'],
  },
  {
    field: 'bollingerPosition',
    label: 'Bollinger Band Position',
    type: 'select',
    category: 'Technical',
    options: ['Above', 'Within', 'Below'],
  },
  {
    field: 'volumeVsAvg',
    label: 'Volume vs 20D Avg',
    type: 'select',
    category: 'Technical',
    options: ['Below', 'Above', '2x', '3x'],
  },

  { field: 'isInWatchlist',   label: 'Watchlist Only',      type: 'boolean',     category: 'Custom' },
];

export const SECTORS = ['IT', 'Banking', 'Pharma', 'Auto', 'FMCG', 'Metal', 'Energy', 'Realty', 'Telecom', 'Infrastructure', 'Media', 'Chemicals', 'Others'] as const;
export const INDICES = ['NIFTY 50', 'NIFTY Next 50', 'NIFTY Midcap 100', 'NIFTY Smallcap 250', 'BSE Sensex'] as const;
