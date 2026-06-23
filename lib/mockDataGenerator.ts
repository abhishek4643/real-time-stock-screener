import type { Sector, Stock, MarketCapCategory } from '@/types/stock';

// ============================================================
// SECTOR DEFINITIONS
// ============================================================
interface SectorConfig {
  companies: string[];
  avgPE: number;
  avgBeta: number;
  avgDividendYield: number;
  debtRange: [number, number];
  industries: string[];
}

const SECTOR_CONFIG: Record<Sector, SectorConfig> = {
  IT: {
    companies: ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM', 'LTIM', 'PERSISTENT', 'COFORGE', 'MPHASIS', 'HEXAWARE'],
    avgPE: 25,
    avgBeta: 0.82,
    avgDividendYield: 1.5,
    debtRange: [0, 0.3],
    industries: ['IT Services', 'IT Consulting', 'Software Products', 'BPO/KPO', 'Cloud Services'],
  },
  Banking: {
    companies: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK', 'BANDHANBNK', 'FEDERALBNK', 'IDFCFIRSTB', 'RBLBANK'],
    avgPE: 18,
    avgBeta: 1.1,
    avgDividendYield: 1.2,
    debtRange: [5, 15],
    industries: ['Private Banks', 'PSU Banks', 'NBFCs', 'Microfinance', 'Small Finance Banks'],
  },
  Pharma: {
    companies: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'AUROPHARMA', 'BIOCON', 'ALKEM', 'TORNTPHARM', 'LUPIN', 'GLENMARK'],
    avgPE: 30,
    avgBeta: 0.70,
    avgDividendYield: 0.8,
    debtRange: [0, 0.8],
    industries: ['Pharmaceuticals', 'Biotechnology', 'API Manufacturing', 'Hospital Chains', 'Diagnostics'],
  },
  Auto: {
    companies: ['MARUTI', 'TATAMOTORS', 'M&M', 'BAJAJ-AUTO', 'HEROMOTOCO', 'EICHERMOT', 'ASHOKLEY', 'TVSMOTOR', 'BOSCHLTD', 'MOTHERSON'],
    avgPE: 22,
    avgBeta: 1.05,
    avgDividendYield: 1.0,
    debtRange: [0.2, 1.0],
    industries: ['Passenger Vehicles', 'Commercial Vehicles', 'Two-Wheelers', 'Auto Ancillaries', 'EV Components'],
  },
  FMCG: {
    companies: ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR', 'GODREJCP', 'MARICO', 'COLPAL', 'EMAMILTD', 'VBLLTD'],
    avgPE: 35,
    avgBeta: 0.60,
    avgDividendYield: 1.8,
    debtRange: [0, 0.4],
    industries: ['Food & Beverages', 'Personal Care', 'Household Products', 'Tobacco', 'Packaged Foods'],
  },
  Metal: {
    companies: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'SAIL', 'NMDC', 'COALINDIA', 'NATIONALUM', 'APLAPOLLO', 'JINDALSAW'],
    avgPE: 12,
    avgBeta: 1.40,
    avgDividendYield: 2.5,
    debtRange: [0.5, 2.5],
    industries: ['Steel', 'Aluminium', 'Zinc & Lead', 'Copper', 'Coal Mining'],
  },
  Energy: {
    companies: ['RELIANCE', 'ONGC', 'IOC', 'BPCL', 'POWERGRID', 'NTPC', 'TATAPOWER', 'ADANIGREEN', 'TORNTPOWER', 'CESC'],
    avgPE: 14,
    avgBeta: 0.95,
    avgDividendYield: 3.0,
    debtRange: [0.5, 2.0],
    industries: ['Oil & Gas', 'Power Generation', 'Renewable Energy', 'Petroleum Refining', 'Power Distribution'],
  },
  Realty: {
    companies: ['DLF', 'GODREJPROP', 'OBEROIRLTY', 'BRIGADE', 'PRESTIGE', 'PHOENIXLTD', 'SOBHA', 'MAHINDLIFE', 'KOLTEPATIL', 'SUNTECK'],
    avgPE: 20,
    avgBeta: 1.30,
    avgDividendYield: 0.5,
    debtRange: [0.5, 3.0],
    industries: ['Real Estate Development', 'Construction', 'REITs', 'Commercial Properties', 'Hospitality'],
  },
  Telecom: {
    companies: ['BHARTIARTL', 'IDEA', 'TATACOMM', 'HFCL', 'STLTECH', 'RAILTEL', 'TEJAS', 'GTLINFRA', 'ITI', 'TANLA'],
    avgPE: 28,
    avgBeta: 0.90,
    avgDividendYield: 0.3,
    debtRange: [1.0, 5.0],
    industries: ['Telecom Services', 'Network Equipment', 'Cable & Broadband', 'Satellite Services', 'Telecom Infrastructure'],
  },
  Infrastructure: {
    companies: ['LT', 'ULTRACEMCO', 'GRASIM', 'AMBUJACEM', 'ACC', 'KPITTECH', 'NCC', 'KEC', 'PNC', 'IRB'],
    avgPE: 18,
    avgBeta: 1.15,
    avgDividendYield: 1.0,
    debtRange: [0.5, 2.5],
    industries: ['Engineering & Construction', 'Cement', 'Capital Goods', 'Roads & Highways', 'Ports & Logistics'],
  },
  Media: {
    companies: ['ZEEL', 'SUNTV', 'PVRINOX', 'NETWORK18', 'DBCORP', 'JAGRAN', 'TVTODAY', 'NAZARA', 'SAREGAMA', 'TIPS'],
    avgPE: 18,
    avgBeta: 1.10,
    avgDividendYield: 1.0,
    debtRange: [0.1, 1.0],
    industries: ['Broadcasting', 'Print Media', 'OTT Platforms', 'Film Production', 'Gaming'],
  },
  Chemicals: {
    companies: ['PIDILITIND', 'SRF', 'DEEPAKNTR', 'ALKYLAMINE', 'NAVINFLUOR', 'GALAXYSURF', 'AAVAS', 'CLEAN', 'PCBL', 'TATACHEM'],
    avgPE: 22,
    avgBeta: 0.80,
    avgDividendYield: 1.2,
    debtRange: [0, 0.8],
    industries: ['Specialty Chemicals', 'Agrochemicals', 'Fertilisers', 'Paints & Coatings', 'Adhesives'],
  },
  Others: {
    companies: ['MUTHOOTFIN', 'PAYTM', 'NYKAA', 'POLICYBZR', 'NAUKRI', 'INDIAMART', 'JUSTDIAL', 'BSOFT', 'EPIGRAL', 'GMRINFRA'],
    avgPE: 16,
    avgBeta: 1.00,
    avgDividendYield: 1.5,
    debtRange: [0, 1.5],
    industries: ['Diversified', 'Financial Services', 'E-commerce', 'Textiles', 'Paper & Packaging'],
  },
};

const INDICES = ['NIFTY 50', 'NIFTY Next 50', 'NIFTY Midcap 100', 'NIFTY Smallcap 250', 'BSE Sensex'];

// ============================================================
// MATH UTILITIES
// ============================================================
function normalRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ============================================================
// MARKET CAP GENERATORS
// ============================================================
function generateMarketCap(category: MarketCapCategory): number {
  switch (category) {
    case 'Large Cap': return Math.round((50000 + Math.random() * 1950000) * 100) / 100;
    case 'Mid Cap':   return Math.round((10000 + Math.random() * 39999) * 100) / 100;
    case 'Small Cap': return Math.round((1000  + Math.random() * 8999)  * 100) / 100;
    case 'Micro Cap': return Math.round((50    + Math.random() * 949)   * 100) / 100;
  }
}

function generatePrice(marketCap: number, category: MarketCapCategory): number {
  const base = category === 'Large Cap' ? 500 + Math.random() * 4500
             : category === 'Mid Cap'   ? 100 + Math.random() * 1400
             : category === 'Small Cap' ? 20  + Math.random() * 480
             :                            5   + Math.random() * 195;
  return round2(base);
}

function assignIndices(category: MarketCapCategory): string[] {
  if (category === 'Large Cap') {
    const n = Math.random();
    if (n < 0.5) return [INDICES[0], INDICES[4]];       // NIFTY50 + Sensex
    if (n < 0.8) return [INDICES[0], INDICES[1]];        // NIFTY50 + Next50
    return [INDICES[1]];
  }
  if (category === 'Mid Cap')   return Math.random() < 0.6 ? [INDICES[2]] : [];
  if (category === 'Small Cap') return Math.random() < 0.4 ? [INDICES[3]] : [];
  return [];
}

// ============================================================
// SYMBOL GENERATOR
// ============================================================
let symbolCounter = 0;
function generateSymbol(sector: Sector, idx: number, config: SectorConfig, category: MarketCapCategory): string {
  if (category === 'Large Cap' && idx < config.companies.length) {
    return config.companies[idx];
  }
  symbolCounter++;
  const prefixes: Record<Sector, string> = {
    IT: 'TECH', Banking: 'FIN', Pharma: 'PHARM', Auto: 'AUTO',
    FMCG: 'CONS', Metal: 'MET', Energy: 'NRG', Realty: 'REAL',
    Telecom: 'TEL', Infrastructure: 'INF', Media: 'MED',
    Chemicals: 'CHEM', Others: 'OTH',
  };
  return `${prefixes[sector]}${String(symbolCounter).padStart(4, '0')}`;
}

function generateCompanyName(sector: Sector, symbol: string, idx: number, config: SectorConfig): string {
  const knownIdx = config.companies.indexOf(symbol);
  if (knownIdx >= 0) {
    const names: Record<string, string> = {
      TCS: 'Tata Consultancy Services Ltd', INFY: 'Infosys Ltd', WIPRO: 'Wipro Ltd',
      HDFCBANK: 'HDFC Bank Ltd', ICICIBANK: 'ICICI Bank Ltd', SBIN: 'State Bank of India',
      SUNPHARMA: 'Sun Pharmaceutical Industries Ltd', DRREDDY: "Dr. Reddy's Laboratories Ltd",
      RELIANCE: 'Reliance Industries Ltd', ONGC: 'Oil & Natural Gas Corporation Ltd',
      TATASTEEL: 'Tata Steel Ltd', DLF: 'DLF Ltd', BHARTIARTL: 'Bharti Airtel Ltd',
      LT: 'Larsen & Toubro Ltd', ZEEL: 'Zee Entertainment Enterprises Ltd',
      PIDILITIND: 'Pidilite Industries Ltd', MARUTI: 'Maruti Suzuki India Ltd',
      HINDUNILVR: 'Hindustan Unilever Ltd', ITC: 'ITC Ltd',
    };
    if (names[symbol]) return names[symbol];
  }
  const suffixes = ['Ltd', 'Industries Ltd', 'Technologies Ltd', 'Enterprises Ltd', 'Corp Ltd'];
  const suffix = suffixes[idx % suffixes.length];
  return `${sector} ${String(idx + 1).padStart(3, '0')} ${suffix}`;
}

// ============================================================
// MAIN GENERATOR
// ============================================================
export function generateMockStocks(count: number = 5000): Stock[] {
  symbolCounter = 0;
  const stocks: Stock[] = [];

  // Distribution: Large 100, Mid 400, Small 1500, Micro 3000
  const distribution: Array<{ category: MarketCapCategory; count: number }> = [
    { category: 'Large Cap', count: Math.min(100, count) },
    { category: 'Mid Cap',   count: Math.min(400, Math.max(0, count - 100)) },
    { category: 'Small Cap', count: Math.min(1500, Math.max(0, count - 500)) },
    { category: 'Micro Cap', count: Math.max(0, count - 2000) },
  ];

  const sectors = Object.keys(SECTOR_CONFIG) as Sector[];
  let globalIdx = 0;

  for (const { category, count: catCount } of distribution) {
    for (let i = 0; i < catCount; i++) {
      const sector = sectors[globalIdx % sectors.length];
      const config = SECTOR_CONFIG[sector];
      const industry = config.industries[i % config.industries.length];
      const marketCap = generateMarketCap(category);
      const lastPrice = generatePrice(marketCap, category);
      const prevClose = round2(lastPrice * (1 + normalRandom() * 0.015));
      const changeAbsolute = round2(lastPrice - prevClose);
      const changePercent = round2((changeAbsolute / prevClose) * 100);
      const symbol = generateSymbol(sector, i, config, category);
      const companyName = generateCompanyName(sector, symbol, i, config);

      // Beta: correlated with cap (large = lower beta)
      const baseBeta = category === 'Large Cap' ? 0.7 : category === 'Mid Cap' ? 1.0 : category === 'Small Cap' ? 1.2 : 1.5;
      const beta = round2(clamp(baseBeta + normalRandom() * 0.3, 0.3, 2.5));

      // Volatility based on beta
      const volatility = 0.01 + beta * 0.01;

      // PE: correlated with growth rate
      const revenueGrowthYoY = round2(clamp(config.avgPE * 0.5 + normalRandom() * 20, -30, 200));
      const pe = revenueGrowthYoY < -10 ? null : round2(clamp(
        config.avgPE * (1 + revenueGrowthYoY / 100) + normalRandom() * 8,
        -50, 500
      ));

      // D/E: sector-correlated
      const [debtMin, debtMax] = config.debtRange;
      const debtToEquity = round2(clamp(
        (debtMin + debtMax) / 2 + normalRandom() * (debtMax - debtMin) * 0.5,
        debtMin, debtMax
      ));

      // Promoter holding: large cap narrower range
      const promBase = category === 'Large Cap' ? 55 : category === 'Mid Cap' ? 50 : 45;
      const promoterHolding = round2(clamp(promBase + normalRandom() * 20, 20, 90));

      // RSI: correlated with recent price movement
      const rsiBase = changePercent > 0 ? 55 : changePercent < 0 ? 45 : 50;
      const rsi14 = round2(clamp(rsiBase + normalRandom() * 15, 5, 95));

      // Technical signals
      const macdSignal: Stock['macdSignal'] = rsi14 > 55 ? 'Bullish' : rsi14 < 45 ? 'Bearish' : 'Neutral';
      const priceVsSma50 = normalRandom() > 0 ? 1.02 : 0.98;
      const sma50 = round2(lastPrice / priceVsSma50);
      const sma200 = round2(lastPrice * (normalRandom() > 0 ? 0.9 : 1.1));
      const bollingerPosition: Stock['bollingerPosition'] =
        rsi14 > 70 ? 'Above' : rsi14 < 30 ? 'Below' : 'Within';

      // Volume
      const baseVolume = Math.max(10000, marketCap * 100 / lastPrice);
      const volumeMultiplier = 1 + Math.abs(changePercent) * 0.15;
      const volume = Math.round(baseVolume * volumeMultiplier * (0.7 + Math.random() * 0.6));
      const avgVolume20D = Math.round(baseVolume * (0.8 + Math.random() * 0.4));
      const volRatio = volume / avgVolume20D;
      const volumeVsAvg: Stock['volumeVsAvg'] =
        volRatio >= 3 ? '3x' : volRatio >= 2 ? '2x' : volRatio >= 1.2 ? 'Above' : 'Below';

      // 52-week high/low
      const week52High = round2(lastPrice * (1.1 + Math.random() * 0.4));
      const week52Low = round2(lastPrice * (0.6 + Math.random() * 0.3));
      const week52HighProximity = round2(((week52High - lastPrice) / week52High) * 100);
      const week52LowProximity = round2(((lastPrice - week52Low) / lastPrice) * 100);

      stocks.push({
        symbol,
        companyName,
        sector,
        industry,
        marketCapCategory: category,
        indexMembership: assignIndices(category),
        lastPrice,
        previousClose: prevClose,
        dayOpen: round2(prevClose * (1 + normalRandom() * 0.008)),
        dayHigh: round2(Math.max(lastPrice, prevClose) * (1 + Math.abs(normalRandom()) * 0.01)),
        dayLow: round2(Math.min(lastPrice, prevClose) * (1 - Math.abs(normalRandom()) * 0.01)),
        changePercent,
        changeAbsolute,
        volume,
        avgVolume20D,
        week52High,
        week52Low,
        week52HighProximity,
        week52LowProximity,
        marketCap,
        pe,
        pb: round2(clamp(1 + Math.random() * 8, 0.2, 50)),
        dividendYield: round2(clamp(config.avgDividendYield + normalRandom() * 1.5, 0, 15)),
        eps: pe !== null ? round2(lastPrice / pe) : round2(normalRandom() * 20),
        roe: round2(clamp(12 + normalRandom() * 15, -50, 100)),
        roce: round2(clamp(15 + normalRandom() * 12, -30, 80)),
        debtToEquity,
        currentRatio: round2(clamp(1.5 + normalRandom() * 0.8, 0.3, 10)),
        promoterHolding,
        revenueGrowthYoY,
        profitGrowthYoY: round2(clamp(revenueGrowthYoY + normalRandom() * 15, -80, 500)),
        rsi14,
        sma50,
        sma200,
        beta,
        atr: round2(lastPrice * volatility * 2),
        macdSignal,
        bollingerPosition,
        volumeVsAvg,
        lastUpdated: Date.now(),
      });

      globalIdx++;
    }
  }

  return stocks;
}
