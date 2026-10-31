# System Architecture
### EquityPulse — Architectural Topology, Data Flow, and System Specifications

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document describes the overall system architecture, technology stack, directory structure, streaming tick pipeline, and key design decisions for the **EquityPulse** real-time financial screener.

---

### 1. High-Level Architecture

EquityPulse follows an event-driven, decoupled frontend architecture connecting high-throughput WebSocket streams with a Zustand state core, a TanStack virtualized grid, and hardware-accelerated TradingView charts:

<p align="center" style="margin: 20px 0;">
  <img src="./architecture.svg" alt="EquityPulse Architecture Flow" width="100%" />
</p>

---

### 2. Technology Stack

Technologies used across EquityPulse and their architectural purpose:

| Domain | Technology | Implementation Detail |
| :-- | :-- | :-- |
| **Framework & Runtime** | Next.js 14 (v14.2.29) | React App Router framework delivering fast client hydration and modular layouts |
| **Core UI Library** | React 18 (v18.3.1) | Concurrent rendering features with selective sub-tree re-rendering boundaries |
| **Language & Types** | TypeScript (v5.7.2) | End-to-end static type safety across financial models, tick payloads, and store actions |
| **State Management** | Zustand (v4.5.5) + Immer | Decoupled atomic stores managing tick buffers, watchlists, and active symbols |
| **Virtualized Grid** | TanStack Table v8 + Virtual | Virtualized windowing rendering 10,000+ instruments with zero DOM thrashing |
| **Query & Caching** | TanStack React Query v5 | Cache invalidation, query states, and background stale data re-fetching |
| **Chart Visualization** | Lightweight Charts (v4.2.0) | TradingView hardware-accelerated Canvas 2D engine rendering real-time candlesticks |
| **Styling & Design** | Tailwind CSS + Framer Motion | Utility styling with dynamic color flash classes and smooth UI transitions |
| **Real-Time Stream** | WebSockets (`ws` v8.18) | Low-overhead streaming protocol handling high-frequency market order feeds |
| **Testing Suite** | Vitest (v2.1.8) + Testing Library | High-speed unit and component test runner with v8 coverage analysis |

---

### 3. Directory Structure

```text
Front1/
├── app/                            # Next.js 14 App Router
│   ├── layout.tsx                  # Root HTML & Theme Provider Wrappers
│   ├── page.tsx                    # Main Financial Screener Application Page
│   └── globals.css                 # Base Tailwind Directives & Custom Animations
├── components/                     # Modular React Components
│   ├── Chart/                      # TradingView Lightweight Charts Candlestick Component
│   ├── Screener/                   # Virtualized Screener Table & Header Filters
│   ├── Watchlist/                  # Pinned Favorites Management Panel
│   └── UI/                         # Badges, Tooltips, Buttons, and Stat Cards
├── constants/                      # Market Symbols, Sector Enums & Mock Tickers
├── hooks/                          # Custom Hooks (`useWebSocket`, `useDebounce`)
├── lib/                            # Financial Formatting Utilities & Math Routines
├── stores/                         # Zustand Global Stores (`useMarketStore`, `useFilterStore`)
├── types/                          # TypeScript Interfaces (`Ticker`, `Candle`, `FilterState`)
├── __tests__/                      # Vitest Unit and Integration Tests
├── docs/                           # Complete Architecture & Engineering Docs
│   ├── ARCHITECTURE.md             # System Topology & Algorithm Specifications
│   ├── DESIGN.md                   # Design System & UI Specifications
│   ├── MEMORY.md                   # Operational State & Milestone Log
│   ├── PRD.md                      # Product Requirements & User Scenarios
│   ├── RULES.md                    # Engineering Conventions & Coding Rules
│   ├── TASKS.md                    # Phased Roadmap with 24 Deliverables
│   ├── architecture.svg            # Custom 4-Card Vector Topology
│   ├── palette.svg                 # 8-Swatch Design System Vector Palette
│   └── principles.svg              # 4-Card Design Principles Vector
├── package.json                    # Scripts & Dependencies
├── tailwind.config.ts              # Tailwind Color Tokens & Keyframes
├── tsconfig.json                   # TypeScript Strict Configuration
├── vitest.config.ts                # Vitest Test Harness Configuration
└── README.md                       # Repository Entry & Developer Guide
```

---

### 4. Real-Time Streaming Data Pipeline

```text
Market WebSocket Stream (60 Ticks / Second)
       │
       ▼
[ useWebSocket Hook ] ────────► Heartbeat check & exponential reconnect
       │
       ▼
[ Tick Normalizer ] ──────────► Parses binary/JSON payload into normalized Ticker type
       │
       ▼
[ Zustand Buffer Store ] ─────► Batches updates into a 16ms animation frame throttle
       │
       ├────────────────────────┬────────────────────────┐
       ▼                        ▼                        ▼
[ TanStack Virtual Grid ] [ Active Chart Sync ] [ Watchlist Stats ]
  Only visible rows         Canvas 2D candlestick   Aggregates net
  update; flash green/red   draws new candle point  portfolio PnL
```

---

### 5. Architectural Decision Records (ADRs)

#### ADR-001: TanStack Table v8 with React Virtual Windowing
- **Context**: Ingesting real-time updates for thousands of instruments causes heavy DOM node churn if all rows remain rendered, dropping frame rates to $< 15\text{ FPS}$.
- **Decision**: Adopt `@tanstack/react-virtual` to window the table DOM. Only the ~25 rows currently visible in the user's viewport exist in the DOM.
- **Consequence**: Keeps memory usage low, eliminates DOM thrashing, and guarantees a solid 60 FPS scrolling experience.

#### ADR-002: TradingView Canvas Charts over SVG-based Visualizers
- **Context**: SVG charting libraries (e.g., standard Recharts) create dozens of DOM elements per candle. Re-rendering SVG paths at 60 FPS under market volatility causes severe frame drops.
- **Decision**: Integrate TradingView's `lightweight-charts`, which uses an HTML5 Canvas 2D hardware-accelerated pipeline.
- **Consequence**: Candlestick updates render in $< 1\text{ ms}$ without generating any virtual DOM overhead.

#### ADR-003: Zustand with Immer for Decoupled High-Frequency State
- **Context**: React Context triggers re-renders across all child components consuming the context whenever any ticker updates.
- **Decision**: Use Zustand with selector subscriptions (`useMarketStore(state => state.tickers[symbol])`).
- **Consequence**: Only the specific cell consuming that symbol re-renders, isolating updates and preventing application-wide re-render cascades.
