import type { FilterConfig, FilterOperator, FilterValue, Stock } from '@/types/stock';

// ============================================================
// PREDICATE FACTORY
// ============================================================
type Predicate = (stock: Stock) => boolean;

function createPredicate(filter: FilterConfig): Predicate {
  const { field, operator, value } = filter;

  return (stock: Stock): boolean => {
    const stockVal = stock[field];

    // Handle null/undefined for numeric fields like pe
    if (stockVal === null || stockVal === undefined) {
      if (operator === 'eq' && value === null) return true;
      return false;
    }

    switch (operator as FilterOperator) {
      case 'eq':        return stockVal === value;
      case 'neq':       return stockVal !== value;
      case 'gt':        return (stockVal as number) > (value as number);
      case 'gte':       return (stockVal as number) >= (value as number);
      case 'lt':        return (stockVal as number) < (value as number);
      case 'lte':       return (stockVal as number) <= (value as number);
      case 'between': {
        const [min, max] = value as [number, number];
        return (stockVal as number) >= min && (stockVal as number) <= max;
      }
      case 'in': {
        if (Array.isArray(stockVal)) {
          return (value as string[]).some(v => (stockVal as string[]).includes(v));
        }
        return (value as string[]).includes(stockVal as string);
      }
      case 'notIn': {
        if (Array.isArray(stockVal)) {
          return !(value as string[]).some(v => (stockVal as string[]).includes(v));
        }
        return !(value as string[]).includes(stockVal as string);
      }
      case 'contains':   return String(stockVal).toLowerCase().includes(String(value).toLowerCase());
      case 'startsWith': return String(stockVal).toLowerCase().startsWith(String(value).toLowerCase());
      default:           return true;
    }
  };
}

// ============================================================
// SELECTIVITY ESTIMATOR (lower = more restrictive = run first)
// ============================================================
function getSelectivity(filter: FilterConfig): number {
  switch (filter.operator) {
    case 'between': return 1;
    case 'gte':
    case 'lte':
    case 'gt':
    case 'lt':   return 2;
    case 'eq':
    case 'neq':  return 3;
    case 'in':
    case 'notIn': return 4;
    default:      return 5;
  }
}

// ============================================================
// MAIN FILTER ENGINE
// ============================================================
export interface FilterResult {
  stocks: Stock[];
  executionTimeMs: number;
  filteredCount: number;
  totalCount: number;
}

export function filterStocks(
  stocks: Stock[],
  filters: FilterConfig[],
  searchQuery?: string,
): Stock[] {
  const activeFilters = filters.filter(f => f.enabled);
  if (activeFilters.length === 0 && !searchQuery) return stocks;

  // Sort predicates by selectivity (most restrictive first)
  const sortedFilters = [...activeFilters].sort((a, b) => getSelectivity(a) - getSelectivity(b));
  const predicates = sortedFilters.map(createPredicate);

  return stocks.filter(stock => {
    // Text search
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = stock.symbol.toLowerCase().includes(q) ||
                      stock.companyName.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Short-circuit AND evaluation
    for (const pred of predicates) {
      if (!pred(stock)) return false;
    }
    return true;
  });
}

export function filterStocksWithTiming(
  stocks: Stock[],
  filters: FilterConfig[],
  searchQuery?: string,
): FilterResult {
  const start = performance.now();
  const result = filterStocks(stocks, filters, searchQuery);
  const elapsed = performance.now() - start;

  return {
    stocks: result,
    executionTimeMs: elapsed,
    filteredCount: result.length,
    totalCount: stocks.length,
  };
}
