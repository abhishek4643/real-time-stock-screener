# EquityPulse — Real-Time Stock Screener

A production-grade, high-frequency financial market screener and technical analysis dashboard delivering real-time streaming market data, interactive candlestick charting, and zero-latency multi-factor filtering.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Screener-0A66C2?style=for-the-badge&logo=vercel&logoColor=white)](https://real-time-stock-screener.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TradingView](https://img.shields.io/badge/Charts-Lightweight_Charts-2962FF?style=for-the-badge)](https://www.tradingview.com/lightweight-charts/)
[![TanStack](https://img.shields.io/badge/Tables-TanStack_Table_v8-FF4154?style=for-the-badge)](https://tanstack.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

---

## Project Overview

In volatile capital markets, milliseconds matter. Traditional financial portals suffer from bloated DOM structures and excessive re-renders during high-frequency price updates. EquityPulse delivers an institutional-grade screener engineered for performance. Utilizing WebSockets, TanStack Virtual table virtualization, and Zustand state slices, it processes 100+ price ticks per second with zero UI stutter.

**Vision:** Bring high-speed institutional screening tools and interactive technical analysis into an accessible, open-source web application.

---

## Live Application

Access the production screener:
- **Live URL:** [https://real-time-stock-screener.vercel.app](https://real-time-stock-screener.vercel.app)
- **Deployment Status:** Active and Continuously Deployed via Vercel
- **Coverage:** US Equities, Real-Time Tickers, Technical Indicators

---

## Key Features

- **High-Frequency WebSocket Engine:** Real-time bi-directional streaming of quotes, bid/ask spreads, and daily percentage shifts.
- **Virtualized High-Performance Grid:** Powered by TanStack Virtual and TanStack Table v8 to render thousands of tickers at a locked 60fps.
- **Interactive Technical Canvas:** TradingView Lightweight Charts integration for responsive candlestick, volume, and line series visual analysis.
- **Multi-Factor Screener Filters:** Instant client-side filtering across market cap, volume spikes, RSI (14), price ranges, and sector classifications.
- **Atomic State Architecture:** Zustand store with Immer middleware preventing unnecessary component re-renders during tick updates.
- **Comprehensive Test Suite:** Vitest and React Testing Library coverage testing indicator algorithms, store actions, and UI boundaries.

---

## Use Cases

### For Day Traders & Active Investors
- Screen for breakout stocks, gap-ups, and sudden volume anomalies in real time.
- Switch between multi-timeframe candlestick charts without losing screener filter context.

### For Financial Engineers & Quantitative Developers
- Test and visualize technical indicator calculations against streaming historical data.
- Benchmark frontend rendering efficiency under simulated market volatility conditions.

---

## System Architecture

```
+-----------------------+              +-----------------------+
| Real-Time Market Feed |              | Financial REST APIs   |
+-----------------------+              +-----------------------+
            | (WebSocket stream)                   | (TanStack Query)
            v                                      v
+--------------------------------------------------------------+
|                Zustand State Store (Atomic Slices)           |
|  - Live Ticker Registry        - Technical Indicator State   |
|  - Screener Filter Parameters  - Chart History Buffer        |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|               UI Layer (TanStack Virtual & Table)            |
|  - 60fps Virtualized Grid      - Interactive Candlestick Canvas|
|  - Real-Time Price Highlight   - Instant Filter & Sort Engine |
+--------------------------------------------------------------+
```

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Framework | Next.js 14.2 (App Router), React 18.3 |
| State Management | Zustand 4.5, Immer 10.1 |
| Data Tables & Virtualization | TanStack Table 8.20, TanStack Virtual 3.13 |
| Data Fetching | TanStack Query 5.62, WebSocket (ws 8.18) |
| Charting Engine | TradingView Lightweight Charts 4.2 |
| Styling & Theme | Tailwind CSS 3.4, Lucide React, Framer Motion, next-themes |
| Test Runner | Vitest 2.1, @testing-library/react 16.1, JSDOM |

---

## Project Structure

```
EquityPulse/
├── app/                  # Next.js App Router views and layout
├── components/           # UI components
│   ├── ChartModal.tsx    # TradingView Lightweight Charts candlestick canvas
│   ├── FilterBar.tsx     # Range sliders, sector toggles, and search inputs
│   ├── Header.tsx        # Market status, theme switcher, and connection state
│   └── ScreenerTable.tsx # Virtualized ticker grid with sorting
├── constants/            # Default ticker universe and indicator configurations
├── hooks/                # Custom hooks (useWebSocket, useDebounce, useIndicators)
├── stores/               # Zustand state stores and selectors
├── types/                # Financial data contracts and screener types
├── __tests__/            # Unit and component tests (Vitest)
├── next.config.mjs
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhishek4643/real-time-stock-screener.git
   cd real-time-stock-screener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests

Execute the comprehensive test suite with Vitest:
```bash
npm run test
npm run test:coverage
```

---

## Future Roadmap

- Options chain visualization with real-time Greeks calculation (Delta, Gamma, Theta).
- Browser audio and desktop push alerts for user-defined price breakout triggers.
- Multi-chart grid view allowing simultaneous observation of up to 6 symbols.
- Export screener results to CSV and JSON formats.

---

## License

This project is private and maintained for showcase and research purposes.
