# Engineering Rules & Standards
### EquityPulse — Code Conventions, High-Frequency Guardrails, and Financial Precision

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document specifies the non-negotiable coding conventions, TypeScript standards, and high-frequency performance guardrails governing the **EquityPulse** codebase.

---

## 1. TypeScript Strictness & Type Safety

### 1.1 Zero `any` Policy
- Strictly NO usage of `any`. Every payload, WebSocket message, and store action MUST reference explicit types from `types/`:
  ```typescript
  // CORRECT
  export interface MarketTicker {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high24h: number;
    low24h: number;
    timestamp: number;
  }
  ```
- Use discriminated unions for WebSocket event envelopes (`type: 'TICK' | 'ORDER_BOOK' | 'HEARTBEAT'`).

### 1.2 Immutable Financial Math
- Floating-point calculations must always be rounded safely using dedicated financial formatting helpers in `lib/formatters.ts`:
  ```typescript
  export const formatCurrency = (val: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  ```
- Never display raw unrounded JavaScript floating numbers (`145.000000002`) to the end user.

---

## 2. High-Frequency State & Rendering Rules

### 2.1 Selector Subscriptions in Zustand
- Never subscribe to the entire Zustand store within a component. Always use granular selector functions to avoid unnecessary component re-renders:
  ```typescript
  // CORRECT: Only re-renders when this specific ticker updates
  const ticker = useMarketStore((state) => state.tickers[symbol]);

  // INCORRECT: Re-renders on ANY ticker update across the whole market
  const { tickers } = useMarketStore();
  ```

### 2.2 Tick Throttling & Batching
- Raw WebSocket messages MUST pass through an animation frame or 16ms batching buffer before committing to Zustand store state.
- Do NOT trigger React state updates synchronously on every single raw network byte arriving via WebSockets.

---

## 3. TradingView Chart Lifecycle Guardrails

### 3.1 Strict Canvas Cleanup
- Every TradingView chart instance created with `createChart()` MUST be disposed of cleanly within the `useEffect` cleanup return:
  ```typescript
  useEffect(() => {
    const chart = createChart(containerRef.current, chartOptions);
    // ... setup series
    return () => {
      chart.remove(); // CRITICAL: Frees canvas context and prevents memory leaks
    };
  }, [symbol]);
  ```
- Never leave orphaned canvas contexts attached to detached DOM trees.

---

## 4. UI & Tailwind CSS Guidelines

### 4.1 Financial Directional Colors
- Standardize directional visual indicators across all views:
  - **Uptick / Bullish**: `text-emerald-500` / `bg-emerald-500/10` (`#10B981`)
  - **Downtick / Bearish**: `text-rose-500` / `bg-rose-500/10` (`#EF4444`)
  - **Neutral / Flat**: `text-slate-400` / `bg-slate-800`
- Always accompany color-coded percentages with directional icon glyphs (`▲`, `▼`) for accessibility compliance.

