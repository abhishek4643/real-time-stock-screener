# Design System
### EquityPulse — Clean. Simple. Productive.

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document defines the visual design system, UI components, design tokens, and user experience standards for the **EquityPulse** financial market screener. The goal is to establish an ultra-modern, high-density, low-latency interface with consistent styling across the virtualized screener grid, watchlist docks, and TradingView charts.

---

### 1. Design Principles

<p align="center" style="margin: 20px 0;">
  <img src="./principles.svg" alt="EquityPulse Design Principles" width="100%" />
</p>

---

### 2. Color Palette
*Primary colors used across the screener, candlestick charts, and telemetry interfaces:*

<p align="center" style="margin: 20px 0;">
  <img src="./palette.svg" alt="EquityPulse Design System Color Palette" width="100%" />
</p>

---

### 3. Typography
*We use Inter as the primary interface font and JetBrains Mono for prices, percentages, and trade executions:*

<div style="background-color: #0D1117; border: 1px solid #30363D; border-radius: 8px; padding: 18px 20px; margin: 14px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="90" align="center" style="font-size: 40px; font-weight: 800; background-color: #161B22; color: #818CF8; border: 1px solid #30363D; border-radius: 8px; padding: 8px 12px;">Aa</td>
      <td style="padding-left: 20px;">
        <div style="font-size: 18px; font-weight: 700; color: #F0F6FC;">Inter &amp; JetBrains Mono</div>
        <div style="color: #818CF8; font-size: 12px; font-weight: 600; margin-top: 2px;">Primary font family</div>
        <div style="color: #8B949E; font-size: 12px; margin-top: 4px;">Clean, modern, and highly legible across financial data tables, tick charts, and order tickets.</div>
      </td>
    </tr>
  </table>
</div>

| Role | Font Family | Size / Weight | Usage |
| :-- | :-- | :-- | :-- |
| **Header 1** | Inter | 22px / 700 Bold | App header, primary market summary stats |
| **Header 2** | Inter | 16px / 600 Semi-Bold | Section titles, chart symbol headers |
| **Table Header** | Inter | 12px / 600 Semi-Bold | Screener column labels (Symbol, Price, Change) |
| **Financial Monospace** | JetBrains Mono | 13px / 600 Semi-Bold | Ticker prices, percentages, market cap figures |

---

### 4. UI Components & Visual Tokens

#### 4.1 Price Movement Badges

| State | Background | Text Color | Border | Meaning |
| :-- | :-- | :-- | :-- | :-- |
| **BULLISH / UPTICK** | `#ECFDF5` | `#059669` | `1px solid #A7F3D0` | Positive price change / green flash |
| **BEARISH / DOWNTICK** | `#FEF2F2` | `#DC2626` | `1px solid #FECACA` | Negative price change / red flash |
| **NEUTRAL** | `#F1F5F9` | `#475569` | `1px solid #CBD5E1` | Unchanged price state |

#### 4.2 Real-Time Tick Flash Card

<div style="background-color: #0D1117; border: 1px solid #30363D; border-radius: 8px; padding: 18px 20px; margin: 14px 0;">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <span style="font-size: 11px; font-weight: 600; color: #8B949E; text-transform: uppercase; letter-spacing: 0.05em;">Active Instrument</span>
      <div style="font-size: 24px; font-weight: 800; color: #F0F6FC; margin-top: 4px;">NVDA &bull; NVIDIA Corporation</div>
    </div>
    <div style="text-align: right;">
      <span style="background-color: #064E3B; color: #34D399; border: 1px solid #059669; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700;">$138.25 (+3.42%) ▲</span>
      <div style="font-size: 11px; color: #8B949E; margin-top: 6px;">Volume: <code style="color: #818CF8;">42.8M</code> &bull; 60 FPS Stream</div>
    </div>
  </div>
</div>

