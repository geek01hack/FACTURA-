import React, { useState, useMemo } from 'react';
import { Invoice, Client } from '../types';
import { formatFCFA, formatDate, getDaysDifference, getInvoiceStatusBadge } from '../utils/formatters';
import { Search, Plus, Printer, MessageCircle, CreditCard, Trash2, Edit2, FileText } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  clients: Client[];
  onNewInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRemindWhatsApp: (invoice: Invoice) => void;
  onPayInvoice: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  clients,
  onNewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onViewInvoice,
  onRemindWhatsApp,
  onPayInvoice,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Client lookup map
  const clientMap = useMemo(() => {
    const map = new Map<string, Client>();
    clients.forEach((c) => map.set(c.id, c));
    return map;
  }, [clients]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const client = clientMap.get(inv.clientId);
      const clientName = client?.name || client?.companyName || '';
      const matchesSearch =
        inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      if (filter === 'paid') return inv.status === 'paid';

      const daysLeft = getDaysDifference(inv.dueDate);
      if (filter === 'overdue') return inv.status !== 'paid' && daysLeft < 0;
      if (filter === 'pending') return inv.status !== 'paid' && daysLeft >= 0;

      return true;
    });
  }, [invoices, clientMap, filter, searchQuery]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En attente ({invoices.filter((i) => i.status !== 'paid' && getDaysDifference(i.dueDate) >= 0).length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'overdue'
                ? 'bg-white text-rose-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            En retard ({invoices.filter((i) => i.status !== 'paid' && getDaysDifference(i.dueDate) < 0).length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'paid'
                ? 'bg-white text-emerald-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Payées ({invoices.filter((i) => i.status === 'paid').length})
          </button>
        </div>

        {/* Search Bar & Action */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher facture ou client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={onNewInvoice}
            className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Créer</span>
          </button>
        </div>
      </div>

      {/* Invoices List / Table */}
      {filteredInvoices.length === 0 ? (
        <div className="py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Aucune facture trouvée</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Aucun résultat ne correspond à votre recherche.'
              : 'Commencez par créer votre première facture en FCFA ou scannez un reçu.'}
          </p>
          <button
            onClick={onNewInvoice}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une facture</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Numéro & Date</th>
                <th className="py-3 px-4 font-semibold">Client</th>
                <th className="py-3 px-4 font-semibold">Échéance</th>
                <th className="py-3 px-4 font-semibold text-right">Montant TTC</th>
                <th className="py-3 px-4 font-semibold text-center">Statut</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const client = clientMap.get(inv.clientId);
                const badge = getInvoiceStatusBadge(inv.status, inv.dueDate);

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Numéro & Date */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 font-mono">
                        {inv.number}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Émise le {formatDate(inv.issueDate)}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {client?.companyName || client?.name || 'Client inconnu'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>{client?.name}</span>
                        {client?.phone && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{client.phone}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Échéance */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {formatDate(inv.dueDate)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {inv.status === 'paid' ? (
                          <span className="text-emerald-600">Réglée le {formatDate(inv.paidAt || '')}</span>
                        ) : (
                          <span>{badge.label}</span>
                        )}
                      </div>
                    </td>

                    {/* Montant TTC (tabular) */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                        {formatFCFA(inv.totalAmount)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        HT: {formatFCFA(inv.subtotal)}
                      </div>
                    </td>

                    {/* Statut (Clean text label with subtle dot or border, no bulky candy pill) */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* WhatsApp reminder button if not paid */}
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => onRemindWhatsApp(inv)}
                            title="Relancer via WhatsApp"
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* View / Print Invoice */}
                        <button
                          onClick={() => onViewInvoice(inv)}
                          title="Aperçu & Imprimer PDF"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Pay with Mobile Money Simulator */}
                        {inv.status !== 'paid' ? (
                          <button
                            onClick={() => onPayInvoice(inv)}
                            title="Simuler règlement client FedaPay / MoMo"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="p-1.5 text-slate-300">
                            <CreditCard className="w-4 h-4" />
                          </span>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => onEditInvoice(inv)}
                          title="Modifier"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          title="Supprimer"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
