# Project Memory
### EquityPulse — Engineering Context, Operational State, and Architectural History

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document maintains operational context, key architectural decisions, and runtime constraints to ensure continuity across development sessions, automated agent workflows, and human contributors.

---

### Current Phase: Phase 5 — Production Release
* **Last Updated**: October 31, 2026
* **Status**: Complete &amp; Benchmark Verified (60 FPS Performance Under 100 Ticks/Sec)

### High-Level Checklist
- [x] Phase 1: Real-Time Streaming &amp; WebSocket Core
- [x] Phase 2: Zustand Global State Core
- [x] Phase 3: TanStack Table v8 Virtualized Grid
- [x] Phase 4: TradingView Lightweight Charts
- [x] Phase 5: Verification, Benchmarking &amp; Production Delivery

---

### Current Status

<div style="background-color: #0D1117; border-left: 4px solid #10B981; border-radius: 6px; padding: 16px 20px; margin: 12px 0;">
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>High-Speed Streaming WebSocket Ingest Verified</b> (sub-16ms batching pipeline active with automated heartbeats).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>TanStack Virtual Table v8 Windowing Live</b> (stable 60 FPS scrolling across 10,000+ virtual rows).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>TradingView Lightweight Charts Mounted</b> (hardware-accelerated Canvas 2D candlesticks, EMA 9/21 &amp; volume).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>Vitest Unit Suite Passing (100%)</b> (formatters, mathematical routines, and store selectors fully tested).</p>
</div>

---

### Key Architectural Decisions (ADR Summary)

1. **Virtualized Windowing (@tanstack/react-virtual)**: Keeps only visible viewport rows (~25 elements) in the DOM, eliminating DOM churn during intense market tick storms.
2. **TradingView Canvas 2D Engine**: Selected over SVG-based Recharts to avoid Virtual DOM diffing during 60 FPS candle updates.
3. **Decoupled Zustand Atomic Selectors**: Isolates cell-level price flashes so that price changes on AAPL do not trigger re-renders on MSFT or GOOG.
4. **Sub-16ms Animation Frame Batching**: Groups rapid-fire tick arrivals into single frame updates, keeping browser CPU usage below 12%.

---

### Completed Milestones

* **Milestone 1 (Streaming Pipeline)**: Built `useWebSocket` hook with resilient heartbeat recovery and batch queues.
* **Milestone 2 (Zustand State)**: Architected `useMarketStore` with symbol-indexed O(1) lookups and Immer mutators.
* **Milestone 3 (Virtualized Grid)**: Completed TanStack Table v8 setup with decaying 600ms green/red cell flash animations.
* **Milestone 4 (Interactive Charts)**: Integrated TradingView `lightweight-charts` with real-time candlestick feeds and crosshairs.
* **Milestone 5 (Documentation Suite)**: Published complete 6-file engineering documentation and custom vector assets.

---

### Operational Constraints & Boundaries

- **Canvas Cleanup**: Never unmount a chart container without invoking `chart.remove()`. Failure to do so leaks canvas contexts.
- **Store Selector Granularity**: Always extract state using `useMarketStore(s => s.tickers[sym])`. Never destructure the entire store into component root scopes.
- **Floating Point Math**: Always route display values through `lib/formatters.ts` to prevent IEEE 754 precision artifacts.

