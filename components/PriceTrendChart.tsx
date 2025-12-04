'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface PriceTrendChartProps {
  deviceId: string;
  series: { date: string; price: number }[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0
  })
    .format(value)
    .replace('ریال', 'تومان');

export function PriceTrendChart({ deviceId, series }: PriceTrendChartProps) {
  return (
    <div className="h-64 w-full rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Price Trend</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Last 14 days · {deviceId}</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 24, right: 16, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '1rem',
              border: '1px solid #1e293b',
              color: '#e2e8f0'
            }}
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `تاریخ: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
