// ============================================================
// INDIAN NUMBER FORMATTING
// ============================================================

/**
 * Format number with Indian comma system (e.g. 12,34,567)
 */
export function formatIndianNumber(value: number): string {
  const [intPart, decPart] = value.toFixed(2).split('.');
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const formatted = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return formatted + (decPart ? '.' + decPart : '');
}

/**
 * Format price with ₹ symbol
 */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `₹${formatIndianNumber(value)}`;
}

/**
 * Abbreviate large volume/market cap numbers
 */
export function formatVolume(value: number): string {
  if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)}Cr`;
  if (value >= 1_00_000)    return `${(value / 1_00_000).toFixed(2)}L`;
  if (value >= 1_000)       return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

/**
 * Format market cap in Crores
 */
export function formatMarketCap(value: number): string {
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L Cr`;
  if (value >= 1_000)    return `₹${(value / 1_000).toFixed(2)}K Cr`;
  return `₹${value.toFixed(2)} Cr`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '—';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format change (absolute)
 */
export function formatChange(value: number): string {
  return `${value >= 0 ? '+' : ''}₹${Math.abs(value).toFixed(2)}`;
}

/**
 * Format P/E ratio (handle null)
 */
export function formatPE(value: number | null): string {
  if (value === null) return 'N/A';
  return value.toFixed(1);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Shorten large numbers for display
 */
export function abbreviateNumber(value: number): string {
  if (value >= 1e9)  return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6)  return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3)  return `${(value / 1e3).toFixed(1)}K`;
  return String(value);
}
