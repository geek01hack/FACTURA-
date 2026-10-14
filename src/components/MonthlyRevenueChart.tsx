import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Invoice } from '../types';
import { formatFCFA } from '../utils/formatters';
import { TrendingUp, BarChart3, Layers, LineChart as LineChartIcon } from 'lucide-react';

interface MonthlyRevenueChartProps {
  invoices: Invoice[];
}

interface MonthlyDataPoint {
  monthKey: string; // "2026-05"
  monthLabel: string; // "Mai 2026"
  paid: number;
  pending: number;
  total: number;
  paidCount: number;
  pendingCount: number;
  rate: number;
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ invoices }) => {
  // Default to 'line' as requested by user
  const [chartType, setChartType] = useState<'line' | 'grouped' | 'stacked'>('line');

  // Compute 6-month continuous window ending at current month
  const monthlyData = useMemo(() => {
    const monthsMap = new Map<string, MonthlyDataPoint>();

    // Generate last 6 months list
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      // Capitalize first letter (e.g., "Oct. 2026")
      const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

      monthsMap.set(key, {
        monthKey: key,
        monthLabel: formattedLabel,
        paid: 0,
        pending: 0,
        total: 0,
        paidCount: 0,
        pendingCount: 0,
        rate: 0,
      });
    }

    // Aggregate invoices
    invoices.forEach((inv) => {
      const dateToUse = inv.status === 'paid' && inv.paidAt ? inv.paidAt : inv.issueDate;
      const key = dateToUse.substring(0, 7);

      let point = monthsMap.get(key);
      if (!point) {
        const d = new Date(dateToUse);
        const label = d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        point = {
          monthKey: key,
          monthLabel: formattedLabel,
          paid: 0,
          pending: 0,
          total: 0,
          paidCount: 0,
          pendingCount: 0,
          rate: 0,
        };
        monthsMap.set(key, point);
      }

      if (inv.status === 'paid') {
        point.paid += inv.totalAmount;
        point.paidCount += 1;
      } else {
        point.pending += inv.totalAmount;
        point.pendingCount += 1;
      }

      point.total = point.paid + point.pending;
      point.rate = point.total > 0 ? Math.round((point.paid / point.total) * 100) : 0;
    });

    // Convert map to sorted array by monthKey
    return Array.from(monthsMap.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [invoices]);

  // Overall recovery rate across all periods
  const totalPaid = monthlyData.reduce((acc, m) => acc + m.paid, 0);
  const totalBilled = monthlyData.reduce((acc, m) => acc + m.total, 0);
  const globalRecoveryRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyDataPoint = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 p-3.5 rounded-xl shadow-lg text-xs min-w-[210px]">
          <div className="font-bold text-slate-900 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span>{data.monthLabel}</span>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              {data.rate}% recouvré
            </span>
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-emerald-700">
              <div className="flex items-center gap-1.5 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
                <span>Factures Payées :</span>
              </div>
              <span className="font-bold tabular-nums">{formatFCFA(data.paid)}</span>
            </div>

            <div className="flex items-center justify-between text-blue-700">
              <div className="flex items-center gap-1.5 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-2 ring-blue-200" />
                <span>Factures en Attente :</span>
              </div>
              <span className="font-bold tabular-nums">{formatFCFA(data.pending)}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-slate-900">
              <span className="font-sans">Total Émis :</span>
              <span className="tabular-nums">{formatFCFA(data.total)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Évolution des Revenus Mensuels (Linéaire & Comparatif)
            </h3>
            <span className="text-xs text-slate-500 hidden sm:inline">· FCFA (XOF)</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Courbe d'encaissement des factures payées versus créances en attente de règlement
          </p>
        </div>

        {/* Right side stats and style toggle */}
        <div className="flex items-center gap-3">
          {/* Global recovery rate indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-600">Taux de recouvrement :</span>
            <span className="font-bold font-mono text-emerald-600 tabular-nums">
              {globalRecoveryRate}%
            </span>
          </div>

          {/* Chart Type Selector: Line (courbe) / Grouped / Stacked */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setChartType('line')}
              title="Graphique Linéaire (Courbes)"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                chartType === 'line'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Linéaire</span>
            </button>
            <button
              onClick={() => setChartType('grouped')}
              title="Barres groupées"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                chartType === 'grouped'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Barres</span>
            </button>
            <button
              onClick={() => setChartType('stacked')}
              title="Barres empilées"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                chartType === 'stacked'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend strip */}
      <div className="flex items-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-100" />
          <span className="font-semibold text-slate-800">Factures Payées (Encaissé)</span>
          <span className="text-slate-400 font-mono">({formatFCFA(totalPaid)})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block ring-2 ring-blue-100" />
          <span className="font-semibold text-slate-800">Factures en Attente</span>
          <span className="text-slate-400 font-mono">({formatFCFA(totalBilled - totalPaid)})</span>
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            /* Linear Graph with Smooth Monotone Curves */
            <LineChart
              data={monthlyData}
              margin={{ top: 12, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${Math.round(val / 1000)}k`;
                  return `${val}`;
                }}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="paid"
                name="Factures Payées"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF', stroke: '#10B981' }}
                activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name="Factures en Attente"
                stroke="#3B82F6"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF', stroke: '#3B82F6' }}
                activeDot={{ r: 6, fill: '#3B82F6', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            /* Bar Chart Alternative (Grouped or Stacked) */
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${Math.round(val / 1000)}k`;
                  return `${val}`;
                }}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="paid"
                name="Encaissé"
                fill="#10B981"
                stackId={chartType === 'stacked' ? 'a' : undefined}
                radius={chartType === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey="pending"
                name="En attente"
                fill="#3B82F6"
                stackId={chartType === 'stacked' ? 'a' : undefined}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
