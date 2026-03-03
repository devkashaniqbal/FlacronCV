'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/ui/Card';
import { CRMRevenueDataPoint } from '@flacroncv/shared-types';

interface RevenueChartProps {
  data: CRMRevenueDataPoint[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-lg dark:border-stone-700 dark:bg-stone-800">
      <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">{label}</p>
      <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
        Revenue: <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
      </p>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Transactions: <span className="font-medium">{payload[1]?.value}</span>
      </p>
    </div>
  );
};

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-white">
            Monthly Revenue
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Last 12 months
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-700" />
      ) : (
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ea580c"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#ea580c' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
