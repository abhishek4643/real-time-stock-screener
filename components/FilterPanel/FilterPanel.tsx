'use client';
import { useState, useCallback, useMemo, useId } from 'react';
import { useStockStore } from '@/stores/stockStore';
import { FILTER_DEFINITIONS } from '@/constants/FILTER_DEFINITIONS';
import { FILTER_PRESETS } from '@/constants/FILTER_PRESETS';
import type { FilterConfig, FilterDefinition } from '@/types/stock';
import { ChevronDown, ChevronRight, X, SlidersHorizontal, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

// Range Filter (dual-handle slider style inputs)
function RangeFilter({ def, activeFilter, onAdd, onRemove }: {
  def: FilterDefinition;
  activeFilter: FilterConfig | undefined;
  onAdd: (f: FilterConfig) => void;
  onRemove: (id: string) => void;
}) {
  const id = useId();
  const min = def.min ?? 0;
  const max = def.max ?? 100;
  const step = def.step ?? 1;

  const currentMin = (activeFilter?.value as number[] | undefined)?.[0] ?? min;
  const currentMax = (activeFilter?.value as number[] | undefined)?.[1] ?? max;

  const handleChange = useCallback((newMin: number, newMax: number) => {
    const filterId = activeFilter?.id ?? `${def.field}-range`;
    onAdd({
      id: filterId,
      field: def.field,
      operator: 'between',
      value: [newMin, newMax],
      enabled: true,
      label: `${def.label}: ${newMin}–${newMax}${def.unit ?? ''}`,
    });
  }, [activeFilter, def, onAdd]);

  const isActive = !!activeFilter;

  return (
    <div className="space-y-3 p-3 rounded-xl bg-themed-surface-2 border border-themed shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-themed-primary">{def.label}</label>
        {isActive && (
          <button
            onClick={() => onRemove(activeFilter.id)}
            className="text-themed-muted hover:text-negative transition-colors"
            aria-label={`Remove ${def.label} filter`}
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          id={`${id}-min`}
          type="number"
          min={min}
          max={currentMax}
          step={step}
          value={currentMin}
          onChange={e => handleChange(Number(e.target.value), currentMax)}
          className="themed-input w-full"
          aria-label={`${def.label} minimum value`}
        />
        <span className="text-themed-muted text-xs">—</span>
        <input
          id={`${id}-max`}
          type="number"
          min={currentMin}
          max={max}
          step={step}
          value={currentMax}
          onChange={e => handleChange(currentMin, Number(e.target.value))}
          className="themed-input w-full"
          aria-label={`${def.label} maximum value`}
        />
      </div>
      {isActive && (
        <div className="h-1 bg-themed-input rounded-full overflow-hidden mt-1 relative">
          <div className="absolute h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" style={{
            left: `${((currentMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((currentMax - min) / (max - min)) * 100}%`
          }} />
        </div>
      )}
    </div>
  );
}

// Multi-Select Filter (checkbox list)
function MultiSelectFilter({ def, activeFilter, onAdd, onRemove }: {
  def: FilterDefinition;
  activeFilter: FilterConfig | undefined;
  onAdd: (f: FilterConfig) => void;
  onRemove: (id: string) => void;
}) {
  const selected = (activeFilter?.value as string[] | undefined) ?? [];

  const toggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(s => s !== option)
      : [...selected, option];

    if (newSelected.length === 0) {
      if (activeFilter) onRemove(activeFilter.id);
      return;
    }

    onAdd({
      id: activeFilter?.id ?? `${def.field}-in`,
      field: def.field,
      operator: 'in',
      value: newSelected,
      enabled: true,
      label: `${def.label}: ${newSelected.length} selected`,
    });
  };

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-themed-surface-2 border border-themed shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-themed-primary">{def.label}</label>
        {activeFilter && (
          <button onClick={() => onRemove(activeFilter.id)} className="text-themed-muted hover:text-negative transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(def.options ?? []).map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={clsx(
              'px-2.5 py-1 rounded-lg text-xs font-medium',
              selected.includes(opt) ? 'tag-active' : 'tag-inactive'
            )}
            aria-pressed={selected.includes(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// Single-Select Filter (radio-style)
function SingleSelectFilter({ def, activeFilter, onAdd, onRemove }: {
  def: FilterDefinition;
  activeFilter: FilterConfig | undefined;
  onAdd: (f: FilterConfig) => void;
  onRemove: (id: string) => void;
}) {
  const selected = activeFilter?.value as string | undefined;

  const choose = (opt: string) => {
    if (selected === opt) {
      if (activeFilter) onRemove(activeFilter.id);
      return;
    }
    onAdd({
      id: activeFilter?.id ?? `${def.field}-eq`,
      field: def.field,
      operator: 'eq',
      value: opt,
      enabled: true,
      label: `${def.label}: ${opt}`,
    });
  };

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-themed-surface-2 border border-themed shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-themed-primary">{def.label}</label>
        {activeFilter && <button onClick={() => onRemove(activeFilter.id)} className="text-themed-muted hover:text-negative"><X size={14} /></button>}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {(def.options ?? []).map(opt => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            className={clsx(
              'px-2.5 py-1 rounded-lg text-xs font-medium',
              selected === opt ? 'tag-active' : 'tag-inactive'
            )}
            aria-pressed={selected === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// Boolean Filter
function BooleanFilter({ def, activeFilter, onAdd, onRemove }: {
  def: FilterDefinition;
  activeFilter: FilterConfig | undefined;
  onAdd: (f: FilterConfig) => void;
  onRemove: (id: string) => void;
}) {
  const isActive = activeFilter?.value === true;
  const toggle = () => {
    if (isActive) { onRemove(activeFilter!.id); return; }
    onAdd({ id: `${def.field}-bool`, field: def.field, operator: 'eq', value: true, enabled: true, label: def.label });
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-themed-surface-2 border border-themed shadow-sm cursor-pointer hover:border-themed-strong transition-colors" onClick={toggle}>
      <label className="text-[13px] font-semibold text-themed-primary cursor-pointer">{def.label}</label>
      <div
        role="switch"
        aria-checked={isActive}
        className={clsx(
          'relative inline-flex h-5 w-9 rounded-full transition-colors duration-300',
          isActive ? 'bg-brand-500' : 'bg-themed-input border border-themed'
        )}
      >
        <span className={clsx(
          'inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300',
          isActive ? 'translate-x-4' : 'translate-x-0'
        )} style={{ marginTop: isActive ? '2px' : '1px', marginLeft: isActive ? '0' : '2px' }} />
      </div>
    </div>
  );
}

// Accordion Section
function FilterSection({ title, children, defaultOpen = false, activeCount }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-themed">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-themed-row-hover transition-colors text-left focus-ring"
        aria-expanded={open}
      >
        <span className="section-header">{title}</span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500 text-white font-bold leading-none shadow-sm shadow-brand-500/20">{activeCount}</span>
          )}
          {open ? <ChevronDown size={16} className="text-themed-muted" /> : <ChevronRight size={16} className="text-themed-muted" />}
        </div>
      </button>
      <div className={clsx("px-4 pb-4 space-y-3 transition-all duration-300 overflow-hidden", open ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 pb-0")}>
        {children}
      </div>
    </div>
  );
}

// Main FilterPanel
export function FilterPanel({ filteredCount, totalCount }: { filteredCount: number; totalCount: number }) {
  const activeFilters = useStockStore((s) => s.activeFilters);
  const addFilter = useStockStore((s) => s.addFilter);
  const removeFilter = useStockStore((s) => s.removeFilter);
  const clearAllFilters = useStockStore((s) => s.clearAllFilters);
  const filterPanelOpen = useStockStore((s) => s.filterPanelOpen);

  const getActiveFilter = useCallback((field: string) => {
    return activeFilters.find(f => f.field === field);
  }, [activeFilters]);

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of activeFilters) {
      const def = FILTER_DEFINITIONS.find(d => d.field === f.field);
      if (def) counts[def.category] = (counts[def.category] ?? 0) + 1;
    }
    return counts;
  }, [activeFilters]);

  const categories = ['Fundamentals', 'Market Data', 'Classification', 'Technical', 'Custom'] as const;

  const applyPreset = (preset: typeof FILTER_PRESETS[0]) => {
    clearAllFilters();
    preset.filters.forEach(f => addFilter(f));
  };

  return (
    <aside
      className={clsx(
        "flex-shrink-0 bg-themed-surface/95 backdrop-blur-xl flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-all duration-300 overflow-hidden",
        filterPanelOpen ? "w-[320px] border-r border-themed opacity-100" : "w-0 border-none opacity-0"
      )}
      aria-label="Filter panel"
    >
      <div className="w-[320px] flex-1 flex flex-col h-full overflow-hidden">
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-themed bg-themed-header flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-themed-primary uppercase tracking-wider">Active Screeners</span>
          </div>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold text-themed-muted hover:text-negative hover:bg-negative/10 transition-colors focus-ring"
              aria-label="Clear all filters"
            >
              <span>CLEAR ALL</span>
            </button>
          )}
        </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
        {/* Preset screeners */}
        <div className="p-4 border-b border-themed bg-themed-surface-2/30">
          <p className="section-header mb-3">Quick Strategies</p>
          <div className="grid grid-cols-2 gap-2">
            {FILTER_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="group flex flex-col items-start text-left p-3 rounded-xl bg-themed-surface border border-themed shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all duration-300 focus-ring"
                title={preset.description}
              >
                <span className="text-[12px] font-bold text-themed-primary leading-tight">{preset.name}</span>
                <span className="text-[10px] text-themed-muted mt-1 leading-tight line-clamp-2">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="p-4 border-b border-themed bg-themed-surface/50 space-y-2">
            <p className="section-header">Active Filters</p>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(f => (
                <div key={f.id} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[11px] font-medium text-brand-600 dark:text-brand-300 shadow-sm">
                  <span className="max-w-[180px] truncate">{f.label ?? f.field}</span>
                  <button onClick={() => removeFilter(f.id)} aria-label={`Remove ${f.label} filter`} className="p-0.5 rounded-md hover:bg-brand-500/20 transition-colors">
                    <X size={12} className="text-brand-500 dark:text-brand-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter sections */}
        <div className="pb-10">
          {categories.map(cat => {
            const defs = FILTER_DEFINITIONS.filter(d => d.category === cat);
            if (defs.length === 0) return null;
            return (
              <FilterSection key={cat} title={cat} defaultOpen={cat === 'Fundamentals'} activeCount={countByCategory[cat] ?? 0}>
                {defs.map(def => (
                  <div key={def.field}>
                    {def.type === 'range' && (
                      <RangeFilter def={def} activeFilter={getActiveFilter(def.field)} onAdd={addFilter} onRemove={removeFilter} />
                    )}
                    {def.type === 'multiselect' && (
                      <MultiSelectFilter def={def} activeFilter={getActiveFilter(def.field)} onAdd={addFilter} onRemove={removeFilter} />
                    )}
                    {def.type === 'select' && (
                      <SingleSelectFilter def={def} activeFilter={getActiveFilter(def.field)} onAdd={addFilter} onRemove={removeFilter} />
                    )}
                    {def.type === 'boolean' && (
                      <BooleanFilter def={def} activeFilter={getActiveFilter(def.field)} onAdd={addFilter} onRemove={removeFilter} />
                    )}
                  </div>
                ))}
              </FilterSection>
            );
          })}
        </div>
      </div>
      </div>
    </aside>
  );
}
