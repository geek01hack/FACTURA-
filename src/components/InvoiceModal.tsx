import React, { useState, useEffect } from 'react';
import { Invoice, Client, InvoiceItem } from '../types';
import { calculateTotals, formatFCFA } from '../utils/formatters';
import { X, Plus, Trash2, Sparkles, UserPlus, Save } from 'lucide-react';
import { AIOcrScannerModal } from './AIOcrScannerModal';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => void;
  clients: Client[];
  onAddClient: (clientData: Omit<Client, 'id' | 'createdAt'>) => Client;
  editingInvoice?: Invoice | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  onAddClient,
  editingInvoice,
}) => {
  const [clientId, setClientId] = useState('');
  const [number, setNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [aibRate, setAibRate] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Invoice['status']>('pending');

  // Quick client modal
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // OCR Scanner modal
  const [isOcrOpen, setIsOcrOpen] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (editingInvoice) {
      setClientId(editingInvoice.clientId);
      setNumber(editingInvoice.number);
      setIssueDate(editingInvoice.issueDate);
      setDueDate(editingInvoice.dueDate);
      setItems(editingInvoice.items || []);
      setTaxRate(editingInvoice.taxRate ?? 18);
      setAibRate(editingInvoice.aibRate ?? 1);
      setNotes(editingInvoice.notes || '');
      setStatus(editingInvoice.status);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const due = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      setClientId(clients[0]?.id || '');
      setNumber(`FACT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setIssueDate(today);
      setDueDate(due);
      setItems([
        {
          id: `item-${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ]);
      setTaxRate(18);
      setAibRate(1);
      setNotes('Règlement exigible à échéance par Mobile Money (MTN, Moov) ou virement bancaire.');
      setStatus('pending');
    }
  }, [editingInvoice, clients, isOpen]);

  if (!isOpen) return null;

  // Item row operations
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      item.total = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Quick client submission
  const handleSaveQuickClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    const created = onAddClient({
      name: newClientName,
      companyName: newClientCompany,
      phone: newClientPhone,
      email: newClientEmail,
      city: 'Cotonou',
      country: 'Bénin',
      notes: '',
    });

    setClientId(created.id);
    setIsQuickClientOpen(false);
    setNewClientName('');
    setNewClientCompany('');
    setNewClientPhone('');
    setNewClientEmail('');
  };

  // Apply OCR Extracted data
  const handleApplyOcrData = (data: any) => {
    if (data.invoiceNumber) setNumber(data.invoiceNumber);
    if (data.issueDate) setIssueDate(data.issueDate);
    if (data.dueDate) setDueDate(data.dueDate);
    if (data.taxRate !== undefined) setTaxRate(data.taxRate);
    if (data.aibRate !== undefined) setAibRate(data.aibRate);
    if (data.notes) setNotes(data.notes);

    if (data.items && data.items.length > 0) {
      setItems(
        data.items.map((it: any, idx: number) => ({
          id: `item-ocr-${idx}-${Date.now()}`,
          description: it.description || '',
          quantity: Number(it.quantity || 1),
          unitPrice: Number(it.unitPrice || 0),
          total: Number(it.quantity || 1) * Number(it.unitPrice || 0),
        }))
      );
    }

    // Auto match or create client
    if (data.clientName) {
      const match = clients.find(
        (c) =>
          c.name.toLowerCase().includes(data.clientName.toLowerCase()) ||
          c.companyName?.toLowerCase().includes(data.clientName.toLowerCase())
      );
      if (match) {
        setClientId(match.id);
      } else {
        const created = onAddClient({
          name: data.clientName,
          companyName: data.clientName,
          phone: data.clientPhone || '+229 97 00 00 00',
          email: '',
          city: 'Cotonou',
          country: 'Bénin',
        });
        setClientId(created.id);
      }
    }
  };

  // Compute live totals
  const totals = calculateTotals(items, taxRate, aibRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert('Veuillez sélectionner ou créer un client.');
      return;
    }

    onSave({
      number,
      clientId,
      issueDate,
      dueDate,
      items,
      subtotal: totals.subtotal,
      taxRate,
      aibRate,
      totalAmount: totals.totalAmount,
      status,
      notes,
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingInvoice ? 'Modifier la Facture' : 'Nouvelle Facture'}
              </h2>
              <p className="text-xs text-slate-500">
                Établissement aux normes UEMOA en FCFA (XOF)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOcrOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scanner un reçu (IA)</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Top Grid: Number, Client, Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de Facture
                </label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Client</label>
                  <button
                    type="button"
                    onClick={() => setIsQuickClientOpen(true)}
                    className="text-[11px] font-medium text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Nouveau</span>
                  </button>
                </div>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date d'émission
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Line items table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Prestations & Articles facturés
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une ligne</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">Description</th>
                      <th className="py-2.5 px-3 font-semibold w-20 text-center">Qté</th>
                      <th className="py-2.5 px-3 font-semibold w-36 text-right">Prix Unit. (FCFA)</th>
                      <th className="py-2.5 px-3 font-semibold w-36 text-right">Total (FCFA)</th>
                      <th className="py-2.5 px-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            placeholder="Description du service ou produit..."
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-transparent border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            min="1"
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                            className="w-16 px-2 py-1.5 text-xs text-center bg-transparent border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono tabular-nums"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="500"
                            required
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                            className="w-32 px-2 py-1.5 text-xs text-right bg-transparent border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono tabular-nums"
                          />
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-slate-800 tabular-nums">
                          {formatFCFA(item.total)}
                        </td>
                        <td className="p-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Taxes and Totals Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Conditions & Mentions de règlement
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mentions légales, comptes MoMo ou coordonnées bancaires..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      TVA (UEMOA)
                    </label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value={0}>0% (Exonération)</option>
                      <option value={18}>18% (Taux normal)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      AIB (Bénin)
                    </label>
                    <select
                      value={aibRate}
                      onChange={(e) => setAibRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value={0}>0% (Non applicable)</option>
                      <option value={1}>1% (Prestataire régulier)</option>
                      <option value={5}>5% (Sans IFU standard)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total HT</span>
                  <span className="font-mono font-medium tabular-nums">{formatFCFA(totals.subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>TVA ({taxRate}%)</span>
                    <span className="font-mono font-medium tabular-nums">{formatFCFA(totals.taxAmount)}</span>
                  </div>
                )}
                {aibRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>AIB ({aibRate}%)</span>
                    <span className="font-mono font-medium tabular-nums">{formatFCFA(totals.aibAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Net à payer TTC</span>
                  <span className="font-mono text-blue-600 tabular-nums">{formatFCFA(totals.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingInvoice ? 'Enregistrer les modifications' : 'Créer et planifier la facture'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick New Client Modal */}
      {isQuickClientOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Ajouter un Client</h3>
              <button
                type="button"
                onClick={() => setIsQuickClientOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom du contact</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: M. Gatien Akpovi"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Entreprise (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: SARL Moderne"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone WhatsApp (avec indicatif)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: +229 97 00 12 34"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="client@domaine.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsQuickClientOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Ajouter le client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI OCR Scanner Dialog */}
      <AIOcrScannerModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onExtracted={handleApplyOcrData}
      />
    </>
  );
};
