'use client';

import type { MarketSnapshot } from '@/lib/analysis';
import { retailers } from '@/data/phones';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' })
    .format(amount)
    .replace('ریال', 'تومان');

export function InsightsGrid({ snapshot }: { snapshot: MarketSnapshot }) {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      <article className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">Most Competitive</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Tightest spreads across retailers</h3>
        <ul className="mt-4 space-y-3 text-sm text-emerald-100">
          {snapshot.mostCompetitive.map((phone) => (
            <li key={phone.id} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{phone.name}</span>
                <span>{phone.spreadPercent}%</span>
              </div>
              <p className="mt-1 text-xs text-emerald-200/80">
                {retailers[phone.bestPrice.retailer].name} vs {retailers[phone.worstPrice.retailer].name}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-200">Highest Spread</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Opportunities for margin monitoring</h3>
        <ul className="mt-4 space-y-3 text-sm text-amber-100">
          {snapshot.highestSpread.map((phone) => (
            <li key={phone.id} className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{phone.name}</span>
                <span>{formatCurrency(phone.priceSpread)}</span>
              </div>
              <p className="mt-1 text-xs text-amber-200/80">
                Best {retailers[phone.bestPrice.retailer].name} · Worst {retailers[phone.worstPrice.retailer].name}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-primary-500/40 bg-primary-500/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">Automation KPIs</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Triggers configured for Telegram alerts</h3>
        <ul className="mt-4 space-y-3 text-sm text-primary-100">
          <li className="rounded-xl border border-primary-500/30 bg-primary-500/5 px-4 py-3">
            Spread alert when difference exceeds 8%
          </li>
          <li className="rounded-xl border border-primary-500/30 bg-primary-500/5 px-4 py-3">
            Price drop push when best offer decreases by 500٬000 تومان
          </li>
          <li className="rounded-xl border border-primary-500/30 bg-primary-500/5 px-4 py-3">
            Daily summary digest at 09:00 Asia/Tehran
          </li>
        </ul>
      </article>
    </section>
  );
}
