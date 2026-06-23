import type { FilterPreset } from '@/types/stock';

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'value-stocks',
    name: 'Value Stocks',
    description: 'Low P/E, high ROE, conservative debt, good dividends',
    icon: '',
    filters: [
      { id: 'vs-pe',  field: 'pe',          operator: 'lte',     value: 15,   enabled: true, label: 'P/E ≤ 15' },
      { id: 'vs-roe', field: 'roe',         operator: 'gte',     value: 15,   enabled: true, label: 'ROE ≥ 15%' },
      { id: 'vs-de',  field: 'debtToEquity', operator: 'lte',    value: 0.5,  enabled: true, label: 'D/E ≤ 0.5' },
      { id: 'vs-div', field: 'dividendYield', operator: 'gte',   value: 2,    enabled: true, label: 'Div Yield ≥ 2%' },
    ],
  },
  {
    id: 'growth-momentum',
    name: 'Growth Momentum',
    description: 'High revenue & profit growth, RSI in momentum zone',
    icon: '',
    filters: [
      { id: 'gm-rev', field: 'revenueGrowthYoY', operator: 'gte', value: 20, enabled: true, label: 'Rev Growth ≥ 20%' },
      { id: 'gm-prof', field: 'profitGrowthYoY', operator: 'gte', value: 20, enabled: true, label: 'Profit Growth ≥ 20%' },
      { id: 'gm-rsi', field: 'rsi14',            operator: 'between', value: [40, 70], enabled: true, label: 'RSI 40–70' },
    ],
  },
  {
    id: 'large-cap-quality',
    name: 'Large Cap Quality',
    description: 'Blue-chip stocks with strong fundamentals',
    icon: '',
    filters: [
      { id: 'lc-cap',  field: 'marketCap',       operator: 'gte',     value: 20000, enabled: true, label: 'Market Cap ≥ ₹20K Cr' },
      { id: 'lc-roce', field: 'roce',             operator: 'gte',     value: 15,    enabled: true, label: 'ROCE ≥ 15%' },
      { id: 'lc-promo',field: 'promoterHolding',  operator: 'gte',     value: 50,    enabled: true, label: 'Promoter ≥ 50%' },
    ],
  },
  {
    id: 'technical-breakout',
    name: 'Technical Breakout',
    description: 'Price breaking out above SMA200 with strong volume',
    icon: '',
    filters: [
      { id: 'tb-rsi',  field: 'rsi14',            operator: 'between', value: [50, 70], enabled: true, label: 'RSI 50–70' },
      { id: 'tb-vol',  field: 'volumeVsAvg',       operator: 'in',      value: ['2x', '3x'], enabled: true, label: 'Volume 2x+' },
      { id: 'tb-boll', field: 'bollingerPosition', operator: 'eq',      value: 'Within', enabled: true, label: 'Within Bollinger' },
    ],
  },
];
