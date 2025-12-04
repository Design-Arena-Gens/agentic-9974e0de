import { retailers } from '@/data/phones';

export function StoreLegend() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Retail Network</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Object.entries(retailers).map(([id, retailer]) => (
          <div
            key={id}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
          >
            <div className="text-xs uppercase tracking-widest text-slate-500">{retailer.region}</div>
            <div className="mt-2 text-base font-semibold text-white">{retailer.name}</div>
            <div className="mt-2 text-xs text-slate-400">Webhook tag: {id}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
