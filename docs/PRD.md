# Product Requirements Document (PRD)
### EquityPulse — Production-Grade Real-Time Financial Market Screener

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

## 1. Executive Summary

Active day traders, momentum investors, and financial analysts require sub-second visibility into fluctuating asset prices across thousands of ticker symbols simultaneously. Traditional web screeners suffer from severe DOM thrashing, browser tab freezing, and lagging price updates when market volatility spikes.

**EquityPulse** is a production-grade, ultra-responsive financial market screener built with **Next.js 14**, **React 18**, **TypeScript 5.7**, **Zustand 4.5**, and **TanStack Table v8**. It combines WebSocket streaming pipelines with virtualized DOM windowing and hardware-accelerated **TradingView Lightweight Charts**, delivering silky 60 FPS performance under extreme high-frequency tick bursts without dropped frames or memory leaks.

---

## 2. Target Personas

| Persona | Primary Goal | Pain Points Addressed |
| :-- | :-- | :-- |
| **Momentum Day Traders** | Identify rapid percentage gainers and volume spikes in seconds | DOM lag in legacy web screeners causes delayed trade execution |
| **Quantitative Researchers** | Monitor technical indicators (EMA, MACD, Volume) in real-time | Disjointed state between tabular data and charting widgets |
| **Active Swing Investors** | Track custom watchlists with configurable sector filters | Complex software requiring heavy local desktop installations |

---

## 3. Core Functional Requirements

### 3.1 Real-Time Streaming Data Pipeline
- **WebSocket Price Ingestion**:
  - Resilient WebSocket connection handling live market ticks and synthetic order books.
  - Sub-16ms tick batching queue to prevent excessive React state re-render cascades.
  - Automated heartbeat monitoring with exponential backoff reconnect logic.
- **Microsecond Tick Visualizer**:
  - Green/Red cell highlight flashes that decay smoothly over 600ms to signal upticks and downticks.

### 3.2 High-Density Virtualized Screener Grid
- **TanStack Virtual Windowing (`@tanstack/react-virtual`)**:
  - Virtualized rendering of 10,000+ financial instruments, keeping only active viewport rows in the DOM.
  - Multi-column sorting (Symbol, Price, Change %, Volume, Market Cap, PE Ratio, 52W High/Low).
  - Dynamic filtering by sector, price brackets, and minimum 24h volume.
- **Custom Watchlist Engine**:
  - One-click pin/favorite symbols stored in local storage with instant synchronization.

### 3.3 Hardware-Accelerated Technical Charts
- **TradingView Lightweight Charts (`lightweight-charts`)**:
  - Canvas 2D candlestick and line chart rendering with sub-millisecond drawing speeds.
  - Overlay indicators: Exponential Moving Averages (EMA 9, EMA 21) and volume histogram bars.
  - Crosshair telemetry displaying exact OHLC data points on hover.

---

## 4. Non-Functional Requirements

- **Frame Rate & Latency**:
  - 60 FPS steady frame rate during active scrolling and tick processing.
  - Input latency: $< 50\text{ ms}$ for search filtering and column sorting.
- **Memory & Resource Efficiency**:
  - Stable memory usage under 200MB during continuous 8-hour trading sessions.
  - Complete garbage collection of stale chart canvas contexts upon route change.
- **Accessibility & Design**:
  - High-contrast color palette compliant with WCAG AA standards.
  - Keyboard navigation for rapid symbol switching and search command palettes.

---

## 5. Scope & Out-of-Scope (v1.0)

- **In Scope**:
  - Real-time WebSocket tick stream simulation and processing.
  - TanStack Table v8 virtualized screener with multi-criteria filtering.
  - TradingView Lightweight Charts integration with EMA indicators.
  - Zustand decoupled store architecture with Immer mutators.
  - Vitest test coverage for stores, formatters, and table components.
- **Out of Scope (Deferred to v2.0)**:
  - Live order placement and brokerage API broker bridges (Alpaca / Interactive Brokers).
  - Multi-monitor detached canvas popup windows.

