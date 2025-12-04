'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Filters, type UiFilters } from '@/components/Filters';
import { ComparisonTable, DeviceInsightCard } from '@/components/ComparisonTable';
import { InsightsGrid } from '@/components/InsightsGrid';
import { TelegramSetup } from '@/components/TelegramSetup';
import { PriceTrendChart } from '@/components/PriceTrendChart';
import { StoreLegend } from '@/components/StoreLegend';
import {
  getMarketSnapshot,
  type MarketSnapshot,
  type PhoneAnalysis
} from '@/lib/analysis';
import { buildTrendSeries } from '@/lib/trends';

const defaultFilters: UiFilters = {
  brands: [],
  retailers: [],
  minPrice: 45000000,
  maxPrice: 81000000,
  years: []
};

export default function Page() {
  const [filters, setFilters] = useState<UiFilters>(defaultFilters);

  const marketSnapshot: MarketSnapshot = useMemo(() => {
    const snapshot = getMarketSnapshot({
      brand: filters.brands,
      retailers: filters.retailers,
      maxPrice: filters.maxPrice,
      minPrice: filters.minPrice,
      releaseYears: filters.years
    });
    return snapshot;
  }, [filters]);

  const featuredDevice: PhoneAnalysis | null = marketSnapshot.devices[0] ?? null;
  const trendSeries = featuredDevice ? buildTrendSeries(featuredDevice.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-12">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900 p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-300">
                Tehran market intelligence
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Benchmark smartphone prices and trigger Telegram alerts automatically
              </h2>
              <p className="mt-4 text-sm text-slate-300">
                The Phone Analyst Bot consolidates premium retailers across Iran, normalizes price updates, and publishes actionable alerts directly to Telegram. Use the dashboard to explore price spreads and configure automation rules to get notified before competitors react.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
                  <p className="font-semibold text-emerald-200">97%</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-emerald-100/80">
                    API uptime last 30 days
                  </p>
                </div>
                <div className="rounded-2xl border border-primary-500/40 bg-primary-500/10 px-4 py-3">
                  <p className="font-semibold text-primary-200"><span className="text-base">{marketSnapshot.devices.length}</span> devices</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-primary-100/80">
                    Active across network
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
                  <p className="font-semibold text-amber-200">Daily 09:00 IRST</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-amber-100/80">
                    Summary broadcast window
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              {featuredDevice && trendSeries.length > 0 ? (
                <PriceTrendChart deviceId={featuredDevice.name} series={trendSeries} />
              ) : (
                <div className="flex h-full min-h-[16rem] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 text-sm text-slate-400">
                  Select filters to view trend data
                </div>
              )}
            </div>
          </div>
        </section>

        <Filters filters={filters} onChange={setFilters} />

        <ComparisonTable snapshot={marketSnapshot} />

        {marketSnapshot.highestSpread.length > 0 && (
          <section className="grid gap-6 lg:grid-cols-2">
            <InsightsGrid snapshot={marketSnapshot} />
            <div className="flex flex-col gap-6">
              {marketSnapshot.highestSpread.slice(0, 2).map((phone) => (
                <DeviceInsightCard key={phone.id} phone={phone} />
              ))}
            </div>
          </section>
        )}

        <StoreLegend />

        <section id="automation" className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Automation Blueprint</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Monitoring policies</h3>
            <ul className="mt-4 space-y-4">
              <li className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="font-semibold text-white">Spread alert</p>
                <p className="mt-1 text-xs text-slate-400">
                  Trigger Telegram alert when price spread exceeds 9% for any premium flagship.
                </p>
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="font-semibold text-white">Price drop</p>
                <p className="mt-1 text-xs text-slate-400">
                  Notify distribution partners when MegaMobile publishes an aggressive discount below market median.
                </p>
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="font-semibold text-white">Weekly digest</p>
                <p className="mt-1 text-xs text-slate-400">
                  Summarize best offers and send to Telegram channel every Saturday at 10:00.
                </p>
              </li>
            </ul>
          </div>
          <TelegramSetup />
        </section>
      </main>
    </div>
  );
}
