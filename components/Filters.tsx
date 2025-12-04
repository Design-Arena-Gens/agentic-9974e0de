'use client';

import { useMemo } from 'react';
import { getBrands, getReleaseYears, getRetailers } from '@/lib/analysis';

export interface UiFilters {
  brands: string[];
  retailers: string[];
  minPrice?: number;
  maxPrice?: number;
  years: number[];
}

interface FiltersProps {
  filters: UiFilters;
  onChange: (filters: UiFilters) => void;
}

const allBrands = getBrands();
const allYears = getReleaseYears();
const allRetailers = getRetailers();

export function Filters({ filters, onChange }: FiltersProps) {
  const priceRange = useMemo(() => {
    const minimum = 45000000;
    const maximum = 81000000;
    return { minimum, maximum };
  }, []);

  const toggle = <T,>(list: T[], value: T): T[] => {
    if (list.includes(value)) {
      return list.filter((item) => item !== value);
    }
    return [...list, value];
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Filters</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Brands</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {allBrands.map((brand) => {
                const active = filters.brands.includes(brand);
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => onChange({ ...filters, brands: toggle(filters.brands, brand) })}
                    className={`rounded-full border px-3 py-1 text-sm transition ${
                      active
                        ? 'border-primary-500 bg-primary-500/10 text-primary-200'
                        : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-primary-500/60 hover:text-primary-100'
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Retailers</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {allRetailers.map((retailer) => {
                const active = filters.retailers.includes(retailer);
                return (
                  <button
                    key={retailer}
                    type="button"
                    onClick={() => onChange({ ...filters, retailers: toggle(filters.retailers, retailer) })}
                    className={`rounded-full border px-3 py-1 text-sm transition ${
                      active
                        ? 'border-primary-500 bg-primary-500/10 text-primary-200'
                        : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-primary-500/60 hover:text-primary-100'
                    }`}
                  >
                    {retailer}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Price Ceiling</label>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="range"
                min={priceRange.minimum}
                max={priceRange.maximum}
                step={500000}
                value={filters.maxPrice ?? priceRange.maximum}
                onChange={(event) =>
                  onChange({ ...filters, maxPrice: Number(event.target.value) })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-primary-500"
              />
              <span className="w-32 text-right text-sm text-slate-300">
                {(filters.maxPrice ?? priceRange.maximum).toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Release Years</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {allYears.map((year) => {
                const active = filters.years.includes(year);
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => onChange({ ...filters, years: toggle(filters.years, year) })}
                    className={`rounded-full border px-3 py-1 text-sm transition ${
                      active
                        ? 'border-primary-500 bg-primary-500/10 text-primary-200'
                        : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-primary-500/60 hover:text-primary-100'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              brands: [],
              retailers: [],
              minPrice: priceRange.minimum,
              maxPrice: priceRange.maximum,
              years: []
            })
          }
          className="self-start rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-primary-500 hover:text-primary-100"
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
}
