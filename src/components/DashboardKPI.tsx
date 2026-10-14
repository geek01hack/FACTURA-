import React from 'react';
import { Invoice } from '../types';
import { formatFCFA, getDaysDifference } from '../utils/formatters';
import { ArrowUpRight, Clock, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { MonthlyRevenueChart } from './MonthlyRevenueChart';

interface DashboardKPIProps {
  invoices: Invoice[];
  onOpenReminders: () => void;
  onScanReceipt: () => void;
}

export const DashboardKPI: React.FC<DashboardKPIProps> = ({
  invoices,
  onOpenReminders,
  onScanReceipt,
}) => {
  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  const pendingInvoices = invoices.filter((inv) => {
    if (inv.status === 'paid') return false;
    const days = getDaysDifference(inv.dueDate);
    return days >= 0;
  });
  const totalPending = pendingInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  const overdueInvoices = invoices.filter((inv) => {
    if (inv.status === 'paid') return false;
    const days = getDaysDifference(inv.dueDate);
    return days < 0;
  });
  const totalOverdue = overdueInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const totalPaid = paidInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  // Invoices needing reminder today (J-2, J0, or overdue)
  const urgentRemindersCount = overdueInvoices.length + invoices.filter(inv => inv.status !== 'paid' && getDaysDifference(inv.dueDate) === 0).length;

  return (
    <div className="space-y-4">
      {/* Action banner if urgent follow-ups exist */}
      {urgentRemindersCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-amber-900">
                {urgentRemindersCount} facture{urgentRemindersCount > 1 ? 's' : ''} à relancer sur WhatsApp
              </h2>
              <p className="text-xs text-amber-700">
                {overdueInvoices.length} en retard de paiement et {urgentRemindersCount - overdueInvoices.length} à échéance aujourd'hui.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenReminders}
              className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              Lancer la tournée WhatsApp
            </button>
            <button
              onClick={onScanReceipt}
              className="hidden lg:inline-flex px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Scanner un reçu (IA)
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Facturé */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Total Facturé</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {formatFCFA(totalBilled)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{invoices.length} factures émises</span>
            <span aria-hidden="true">·</span>
            <span>FCFA (XOF)</span>
          </div>
        </div>

        {/* En attente */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>En attente (sain)</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums tracking-tight">
            {formatFCFA(totalPending)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{pendingInvoices.length} factures dans les délais</span>
            <span aria-hidden="true">·</span>
            <span>À venir</span>
          </div>
        </div>

        {/* En retard */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Retards de paiement</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums tracking-tight">
            {formatFCFA(totalOverdue)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-rose-600 font-medium">{overdueInvoices.length} facture{overdueInvoices.length > 1 ? 's' : ''} échue{overdueInvoices.length > 1 ? 's' : ''}</span>
            <span aria-hidden="true">·</span>
            <span>Relance requise</span>
          </div>
        </div>

        {/* Encaissé */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Total Encaissé</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums tracking-tight">
            {formatFCFA(totalPaid)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-medium">{paidInvoices.length} règlements reçus</span>
            <span aria-hidden="true">·</span>
            <span>Trésorerie nette</span>
          </div>
        </div>
      </div>

      {/* Monthly Revenue & Recovery Chart */}
      <MonthlyRevenueChart invoices={invoices} />
    </div>
  );
};
