'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Star, Activity, Sun, Moon, PanelLeft } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useStockStore } from '@/stores/stockStore';

interface HeaderProps {
  filteredCount?: number;
  totalCount?: number;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Header({
  filteredCount = 0,
  totalCount = 0,
  searchQuery = '',
  onSearchChange = () => {},
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleFilterPanel = useStockStore(s => s.toggleFilterPanel);
  const filterPanelOpen = useStockStore(s => s.filterPanelOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-themed bg-themed-header backdrop-blur-md sticky top-0 z-50">
      {/* Left section: Logo & Screeners Toggle */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group focus-ring rounded-lg">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <Activity size={18} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-brand-500 dark:text-brand-400">EquityPulse</span>
            <span className="text-[9px] font-bold tracking-widest text-themed-muted uppercase">Terminal V1</span>
          </div>
        </Link>

        {/* Screeners Toggle */}
        <button
          onClick={toggleFilterPanel}
          className={clsx(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 focus-ring",
            filterPanelOpen 
              ? "bg-brand-500/10 text-brand-500 dark:text-brand-400" 
              : "text-themed-secondary hover:text-themed-primary hover:bg-themed-input"
          )}
          aria-label="Toggle Screeners Panel"
        >
          <PanelLeft size={16} />
          <span>Screeners</span>
        </button>
      </div>

      {/* Center section: Search */}
      <div className="flex-1 max-w-xl px-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-themed-muted group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1.5 border border-themed bg-themed-input text-themed-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all text-sm placeholder-themed-muted shadow-sm hover:border-themed-strong"
            placeholder="Search by symbol or company... (e.g. RELIANCE, TCS)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Right section: Actions & Status */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-themed-input rounded-md px-2 py-1 border border-themed shadow-sm">
            <span className="text-brand-500 dark:text-brand-400 font-bold text-xs tabular-nums">
              {filteredCount.toLocaleString()}
            </span>
            <span className="text-themed-muted text-xs mx-1">/</span>
            <span className="text-themed-muted text-xs tabular-nums">{totalCount.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-positive/10 border border-positive/20 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            <span className="text-[10px] font-bold text-positive uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-themed-secondary hover:text-themed-primary hover:bg-themed-input rounded-lg transition-colors focus-ring" aria-label="Watchlist">
            <Star size={18} />
          </button>
          <button className="p-2 text-themed-secondary hover:text-themed-primary hover:bg-themed-input rounded-lg transition-colors focus-ring" aria-label="Notifications">
            <Bell size={18} />
          </button>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-themed-secondary hover:text-themed-primary hover:bg-themed-input rounded-lg transition-colors focus-ring ml-1"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
