import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EquityPulse — Real-Time Stock Screener',
  description: 'Production-grade real-time stock screener for Indian equity markets. 5,000+ stocks, 30+ filters, live price updates, and interactive candlestick charts.',
  keywords: ['stock screener', 'NSE', 'BSE', 'equity', 'NIFTY', 'stock analysis', 'technical indicators'],
  openGraph: {
    title: 'EquityPulse — Real-Time Stock Screener',
    description: 'Screen 5,000+ Indian stocks with real-time price updates and advanced technical analysis.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
