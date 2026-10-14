import React from 'react';
import { Invoice, Client, CompanyProfile } from '../types';
import { formatFCFA, formatDate } from '../utils/formatters';
import { X, Printer, Share2, MessageCircle, QrCode } from 'lucide-react';

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  client: Client | null;
  company: CompanyProfile;
  onClose: () => void;
  onRemindWhatsApp: (invoice: Invoice) => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  client,
  company,
  onClose,
  onRemindWhatsApp,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4 print:shadow-none print:border-none print:m-0">
        {/* Modal Controls (Hidden in print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="text-xs font-semibold text-slate-700">
            Aperçu officiel de la facture {invoice.number}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRemindWhatsApp(invoice)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Envoyer par WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-12 text-slate-800 bg-white min-h-[700px] flex flex-col justify-between" id="printable-invoice">
          <div>
            {/* Header: Company & Invoice title */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {company.name}
                </h1>
                <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                  <p>{company.address}, {company.city} ({company.country})</p>
                  <p>Tél : <span className="font-mono">{company.phone}</span> · Email : {company.email}</p>
                  <p className="font-mono text-[11px] text-slate-600">
                    IFU : {company.ifu} {company.rccm ? `· RCCM : ${company.rccm}` : ''}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-2xl font-bold tracking-tight text-blue-600 block">
                  FACTURE
                </span>
                <span className="font-mono text-sm font-semibold text-slate-900 block mt-0.5">
                  N° {invoice.number}
                </span>
                <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                  <p>Date : <span className="font-medium text-slate-700">{formatDate(invoice.issueDate)}</span></p>
                  <p>Échéance : <span className="font-semibold text-slate-900">{formatDate(invoice.dueDate)}</span></p>
                </div>
              </div>
            </div>

            {/* Bill To / Client Section */}
            <div className="py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Facturé à :
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {client?.companyName || client?.name || 'Client sans nom'}
                </h3>
                <div className="text-xs text-slate-600 mt-0.5 space-y-0.5">
                  {client?.companyName && client?.name && <p>Attn : {client.name}</p>}
                  <p>{client?.city}, {client?.country}</p>
                  <p className="font-mono">{client?.phone}</p>
                  {client?.email && <p>{client.email}</p>}
                </div>
              </div>

              {/* Status Watermark */}
              <div className="sm:text-right flex sm:flex-col justify-end">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Statut du règlement
                  </span>
                  {invoice.status === 'paid' ? (
                    <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded">
                      PAYÉE {invoice.paidAt ? `le ${formatDate(invoice.paidAt)}` : ''}
                    </div>
                  ) : (
                    <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded">
                      EN ATTENTE DE RÈGLEMENT
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900 font-bold">
                    <th className="py-3 px-2">Désignation</th>
                    <th className="py-3 px-2 text-center w-16">Qté</th>
                    <th className="py-3 px-2 text-right w-32">Prix Unitaire</th>
                    <th className="py-3 px-2 text-right w-36">Montant (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-2 font-medium text-slate-800">
                        {item.description}
                      </td>
                      <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600">
                        {formatFCFA(item.unitPrice)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-semibold tabular-nums text-slate-900">
                        {formatFCFA(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600 max-w-sm space-y-1">
                {invoice.notes && (
                  <div>
                    <span className="font-semibold text-slate-700 block">Mentions :</span>
                    <p className="text-[11px] text-slate-500 italic">{invoice.notes}</p>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Hors Taxes (HT)</span>
                  <span className="font-mono tabular-nums">{formatFCFA(invoice.subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>TVA ({invoice.taxRate}%)</span>
                    <span className="font-mono tabular-nums">
                      {formatFCFA((invoice.subtotal * invoice.taxRate) / 100)}
                    </span>
                  </div>
                )}
                {invoice.aibRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>AIB ({invoice.aibRate}%)</span>
                    <span className="font-mono tabular-nums">
                      {formatFCFA((invoice.subtotal * invoice.aibRate) / 100)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-bold text-slate-900">
                  <span>Net à Payer (TTC)</span>
                  <span className="font-mono text-blue-600 text-base tabular-nums">
                    {formatFCFA(invoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & MoMo instructions in bottom footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                Modalités de règlement Mobile Money :
              </span>
              <p className="text-slate-600">
                Réseau : <strong className="text-slate-900">{company.momoNetwork} Money</strong>
              </p>
              <p className="text-slate-600">
                Numéro MoMo : <strong className="font-mono text-slate-900">{company.momoNumber}</strong>
              </p>
              <p className="text-slate-600">
                Bénéficiaire : <strong>{company.momoAccountName}</strong>
              </p>
            </div>

            <div className="sm:text-right flex flex-col sm:items-end justify-center">
              <span className="font-bold text-slate-800 block mb-1">
                Lien de paiement sécurisé FedaPay :
              </span>
              <p className="font-mono text-[11px] text-blue-600">
                https://factura.africa/pay/{invoice.id}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Validez votre paiement instantané par MTN, Moov, Wave ou Carte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
