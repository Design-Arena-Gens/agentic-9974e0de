'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { MarketSnapshot, PhoneAnalysis } from '@/lib/analysis';
import { retailers } from '@/data/phones';

interface ComparisonTableProps {
  snapshot: MarketSnapshot;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' })
    .format(amount)
    .replace('ریال', 'تومان');

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  });
};

export function ComparisonTable({ snapshot }: ComparisonTableProps) {
  const rows = useMemo(() => snapshot.devices, [snapshot.devices]);

  return (
    <section id="dashboard" className="rounded-3xl border border-slate-800 bg-slate-900/50 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Market Overview</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Average price {formatCurrency(snapshot.overallAverage)}</h2>
        </div>
        <div className="rounded-full border border-primary-500/60 bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-200">
          {rows.length} devices
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Device</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Best Retailer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Best Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Worst Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Spread</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Updated</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((phone) => {
              const bestRetailer = retailers[phone.bestPrice.retailer];
              const worstRetailer = retailers[phone.worstPrice.retailer];
              return (
                <tr key={phone.id} className="transition hover:bg-slate-900/60">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{phone.name}</span>
                      <span className="text-xs text-slate-400">
                        {phone.brand} · {phone.storage} · {phone.releaseYear}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-200">
                    <div className="flex flex-col">
                      <span>{bestRetailer.name}</span>
                      <span className="text-xs text-slate-500">{bestRetailer.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-200">{formatCurrency(phone.bestPrice.price)}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{formatCurrency(phone.worstPrice.price)}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">
                    {formatCurrency(phone.priceSpread)}
                    <span className="ml-2 text-xs text-slate-500">({phone.spreadPercent}%)</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{formatDate(phone.bestPrice.lastUpdated)}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      href={`/device/${phone.id}`}
                      className="rounded-full border border-primary-500/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-100 transition hover:border-primary-400 hover:bg-primary-500/10"
                    >
                      Deep dive
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DeviceInsightCard({ phone }: { phone: PhoneAnalysis }) {
  const savings = phone.worstPrice.price - phone.bestPrice.price;
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Best deal</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{phone.name}</h3>
        </div>
        <span className="rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-200">
          save {formatCurrency(savings)}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-300">
        Spread of {phone.spreadPercent}% between {retailers[phone.bestPrice.retailer].name} and {retailers[phone.worstPrice.retailer].name}.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href={phone.bestPrice.url}
          target="_blank"
          className="flex-1 rounded-full border border-primary-500/60 bg-primary-500/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-primary-100 transition hover:border-primary-400"
        >
          View best offer ↗
        </Link>
        <Link
          href={phone.worstPrice.url}
          target="_blank"
          className="flex-1 rounded-full border border-slate-700 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-200 transition hover:border-primary-400 hover:text-primary-100"
        >
          Check other retailers
        </Link>
      </div>
    </div>
  );
}
