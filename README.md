<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,26&height=220&section=header&text=EquityPulse%20Platform&fontSize=52&fontColor=FFFFFF&fontAlignY=36&desc=Production-Grade%20Real-Time%20Financial%20Market%20Screener&descSize=16&descColor=A5B4FC&descAlignY=58&animation=fadeIn" width="100%" />

<br/>

<a href="#system-architecture">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
</a>
&nbsp;
<a href="#system-architecture">
  <img src="https://img.shields.io/badge/Library-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
</a>
&nbsp;
<a href="#system-architecture">
  <img src="https://img.shields.io/badge/State-Zustand%20%2B%20Immer-8B5CF6?style=for-the-badge&labelColor=1e1b4b" alt="Zustand" />
</a>
&nbsp;
<a href="#system-architecture">
  <img src="https://img.shields.io/badge/Grid-TanStack%20Table%20v8-FF4154?style=for-the-badge&labelColor=1e1b4b" alt="TanStack Table" />
</a>
&nbsp;
<a href="#system-architecture">
  <img src="https://img.shields.io/badge/Charts-TradingView%20Canvas-2962FF?style=for-the-badge&logo=tradingview&logoColor=white" alt="TradingView" />
</a>

</div>

<br/>

# EquityPulse — Production-Grade Real-Time Stock Screener

A low-latency, high-density financial market screener and technical charting engine built with Next.js 14, React 18, Zustand, and TanStack Table v8.

EquityPulse is designed for active traders who need **60 FPS real-time price updates** across thousands of instruments without DOM thrashing, browser lag, or memory leaks.

---

## System Architecture

<p align="center" style="margin: 20px 0;">
  <img src="./docs/architecture.svg" alt="EquityPulse Architecture Flow" width="100%" />
</p>

---

## Key Performance Highlights

- **60 FPS Virtualized Grid**: Handles 10,000+ financial instruments using `@tanstack/react-virtual`, rendering only active viewport rows.
- **Hardware-Accelerated Charts**: Built on TradingView's `lightweight-charts` Canvas 2D engine for sub-millisecond candlestick re-paints.
- **Microsecond Tick Flashes**: 600ms decaying green/red price flash animations that inform traders of tick direction at a glance.
- **Decoupled Zustand State**: Atomic selector subscriptions prevent application-wide re-render cascades during market volatility.
- **Custom Watchlists**: Persistent, drag-and-drop favorited symbols stored with instant local synchronization.

---

## Engineering Documentation

The project includes a complete production-grade architecture and development documentation suite:

| Document | Purpose |
| :-- | :-- |
| [**`docs/PRD.md`**](./docs/PRD.md) | Product Requirements Document: MVP specifications, target personas & success metrics |
| [**`docs/ARCHITECTURE.md`**](./docs/ARCHITECTURE.md) | System topology, streaming tick pipeline, directory tree & ADRs |
| [**`docs/RULES.md`**](./docs/RULES.md) | Engineering standards, TypeScript conventions, and high-frequency guardrails |
| [**`docs/DESIGN.md`**](./docs/DESIGN.md) | Design system, UI tokens, Inter & JetBrains Mono typography, and telemetry cards |
| [**`docs/TASKS.md`**](./docs/TASKS.md) | Phased roadmap tracking 24 engineering deliverables with priority & status badges |
| [**`docs/MEMORY.md`**](./docs/MEMORY.md) | Active session memory, completed milestone log, and operational boundaries |

---

## Setup Instructions

### Prerequisites
- Node.js (`v18.17+` or `v20+`)
- npm / pnpm / yarn

### 1. Clone the repository
```bash
git clone https://github.com/abhishek4643/real-time-stock-screener.git
cd real-time-stock-screener
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the screener.

### 4. Run Test Suite
```bash
npm run test
```
To run tests with coverage:
```bash
npm run test:coverage
```

---

## License

This project is open-source and available under the MIT License.
