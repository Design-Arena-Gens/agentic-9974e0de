import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPhoneById } from '@/lib/analysis';
import { buildTrendSeries } from '@/lib/trends';
import { retailers } from '@/data/phones';
import { PriceTrendChart } from '@/components/PriceTrendChart';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' })
    .format(amount)
    .replace('ریال', 'تومان');

export default function DevicePage({ params }: { params: { id: string } }) {
  const device = getPhoneById(params.id);
  if (!device) {
    notFound();
  }
  const trend = buildTrendSeries(device.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-12">
        <Link href="/" className="text-xs text-primary-200">← Back to dashboard</Link>
        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-black/30">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Device Overview</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{device.name}</h1>
              <div className="mt-4 grid gap-4 text-sm text-slate-300">
                <div>Best price: <span className="text-primary-200">{formatCurrency(device.bestPrice.price)}</span> by {retailers[device.bestPrice.retailer].name}</div>
                <div>Average: {formatCurrency(device.averagePrice)}</div>
                <div>Spread: {formatCurrency(device.priceSpread)} ({device.spreadPercent}%)</div>
                <div className="text-xs text-slate-400">
                  Updated {new Date(device.bestPrice.lastUpdated).toLocaleString('fa-IR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  Display
                  <p className="mt-1 text-sm text-slate-200">{device.specs.display}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  Chip
                  <p className="mt-1 text-sm text-slate-200">{device.specs.chip}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  Battery
                  <p className="mt-1 text-sm text-slate-200">{device.specs.battery}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  Camera
                  <p className="mt-1 text-sm text-slate-200">{device.specs.camera}</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <PriceTrendChart deviceId={device.name} series={trend} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Retailer Breakdown</p>
          <div className="mt-4 space-y-3">
            {device.prices.map((price) => {
              const retailer = retailers[price.retailer];
              return (
                <div key={price.retailer} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{retailer.name}</p>
                    <p className="text-xs text-slate-400">{retailer.region}</p>
                  </div>
                  <div className="text-primary-200">{formatCurrency(price.price)}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(price.lastUpdated).toLocaleString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
