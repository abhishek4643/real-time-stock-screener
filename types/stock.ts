// ============================================================
// STOCK TYPES
// ============================================================
export type Sector =
  | 'IT'
  | 'Banking'
  | 'Pharma'
  | 'Auto'
  | 'FMCG'
  | 'Metal'
  | 'Energy'
  | 'Realty'
  | 'Telecom'
  | 'Infrastructure'
  | 'Media'
  | 'Chemicals'
  | 'Others';

export type MarketCapCategory = 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap';
export type MACDSignal = 'Bullish' | 'Bearish' | 'Neutral';
export type BollingerPosition = 'Above' | 'Within' | 'Below';
export type VolumeVsAvg = 'Below' | 'Above' | '2x' | '3x';

export interface Stock {
  symbol: string;
  companyName: string;
  sector: Sector;
  industry: string;
  marketCapCategory: MarketCapCategory;
  indexMembership: string[];

  // Price data
  lastPrice: number;
  previousClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  changePercent: number;
  changeAbsolute: number;
  volume: number;
  avgVolume20D: number;
  week52High: number;
  week52Low: number;
  week52HighProximity: number; // % from 52w high
  week52LowProximity: number;  // % from 52w low

  // Fundamentals
  marketCap: number;
  pe: number | null;
  pb: number;
  dividendYield: number;
  eps: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  promoterHolding: number;
  revenueGrowthYoY: number;
  profitGrowthYoY: number;

  // Technical
  rsi14: number;
  sma50: number;
  sma200: number;
  beta: number;
  atr: number;
  macdSignal: MACDSignal;
  bollingerPosition: BollingerPosition;
  volumeVsAvg: VolumeVsAvg;

  // Meta
  isInWatchlist?: boolean;
  lastUpdated?: number;
}

// ============================================================
// FILTER TYPES
// ============================================================
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith';

export type FilterValue = number | string | boolean | number[] | string[] | null;

export interface FilterConfig {
  id: string;
  field: keyof Stock;
  operator: FilterOperator;
  value: FilterValue;
  enabled: boolean;
  label?: string;
}

export type FilterType = 'range' | 'multiselect' | 'select' | 'boolean';

export interface FilterDefinition {
  field: keyof Stock;
  label: string;
  type: FilterType;
  category: 'Fundamentals' | 'Market Data' | 'Classification' | 'Technical' | 'Custom';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
}

// ============================================================
// SORT / UI TYPES
// ============================================================
export interface SortConfig {
  column: keyof Stock;
  direction: 'asc' | 'desc';
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: FilterConfig[];
  icon: string;
}

// ============================================================
// OHLCV / CHART TYPES
// ============================================================
export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorConfig {
  type: 'SMA' | 'EMA' | 'Bollinger' | 'RSI' | 'VolumeProfile';
  period?: number;
  enabled: boolean;
  color?: string;
}

// ============================================================
// API TYPES
// ============================================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    timestamp: string;
    executionTimeMs: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============================================================
// WEBSOCKET TYPES
// ============================================================
export interface PriceUpdate {
  symbol: string;
  lastPrice: number;
  changePercent: number;
  changeAbsolute: number;
  volume: number;
  timestamp: number;
  direction: 'up' | 'down' | 'flat';
}

export type WSConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
