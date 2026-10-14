import React, { useState } from 'react';
import { Invoice, Client, CompanyProfile } from '../types';
import { formatFCFA, formatDate } from '../utils/formatters';
import { X, Smartphone, CreditCard, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface PaymentSimulatorModalProps {
  invoice: Invoice | null;
  client: Client | null;
  company: CompanyProfile;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string, method: string) => void;
}

type PaymentNetwork = 'mtn' | 'moov' | 'orange' | 'wave' | 'card';

export const PaymentSimulatorModal: React.FC<PaymentSimulatorModalProps> = ({
  invoice,
  client,
  company,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<PaymentNetwork>('mtn');
  const [payerPhone, setPayerPhone] = useState(client?.phone || '+229 97 00 00 00');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [txRef, setTxRef] = useState('');

  if (!isOpen || !invoice) return null;

  const networks = [
    { id: 'mtn' as const, name: 'MTN Mobile Money', color: 'border-yellow-400 bg-yellow-50/50 text-yellow-900', desc: 'Débit instantané par notification Push' },
    { id: 'moov' as const, name: 'Moov Money', color: 'border-blue-400 bg-blue-50/50 text-blue-900', desc: 'Moov Africa Bénin / Côte d’Ivoire' },
    { id: 'wave' as const, name: 'Wave', color: 'border-sky-400 bg-sky-50/50 text-sky-900', desc: 'Paiement sans frais supplémentaires' },
    { id: 'orange' as const, name: 'Orange Money', color: 'border-orange-400 bg-orange-50/50 text-orange-900', desc: 'Orange Money UEMOA' },
    { id: 'card' as const, name: 'Carte Bancaire (FedaPay)', color: 'border-slate-300 bg-slate-50 text-slate-800', desc: 'Visa, Mastercard & Cartes locales' },
  ];

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    // Simulate 2.5s network push and confirmation
    setTimeout(() => {
      const generatedTx = `FP-TX-${Math.floor(100000 + Math.random() * 900000)}`;
      setTxRef(generatedTx);
      setStep('success');

      const methodName = networks.find((n) => n.id === selectedNetwork)?.name || 'Mobile Money';
      onPaymentSuccess(invoice.id, methodName);
    }, 2400);
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        {/* Portal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Portail de Paiement Sécurisé</h3>
              <p className="text-[11px] text-slate-400">
                Propulsé par FedaPay & Mobile Money UEMOA
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-mono">
              Facture {invoice.number}
            </span>
            <div className="text-xs font-semibold text-slate-800">
              {company.name}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Montant total</span>
            <div className="text-lg font-bold text-blue-600 font-mono tabular-nums">
              {formatFCFA(invoice.totalAmount)}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Choisissez votre moyen de paiement :
                </label>
                <div className="space-y-2">
                  {networks.map((net) => (
                    <label
                      key={net.id}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedNetwork === net.id
                          ? `${net.color} border-current ring-1 ring-current`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="network"
                          value={net.id}
                          checked={selectedNetwork === net.id}
                          onChange={() => setSelectedNetwork(net.id)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {net.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {net.desc}
                          </div>
                        </div>
                      </div>
                      <Smartphone className="w-4 h-4 text-slate-400" />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Numéro de téléphone débité (Mobile Money) :
                </label>
                <input
                  type="text"
                  required
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="+229 97 00 12 34"
                  className="w-full px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Une invite USSD sera envoyée sur ce numéro pour validation du débit.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>Payer {formatFCFA(invoice.totalAmount)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Notification Push USSD envoyée
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Veuillez saisir votre code PIN secret sur votre téléphone <strong className="font-mono">{payerPhone}</strong> pour valider le débit de <strong className="font-mono">{formatFCFA(invoice.totalAmount)}</strong>.
                </p>
              </div>
              <div className="inline-block p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-mono">
                Attente de la confirmation réseau (MTN/Moov)...
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Paiement Confirmé avec Succès !
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Le règlement de la facture <strong className="font-mono">{invoice.number}</strong> a été validé.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Réf. Transaction :</span>
                  <span className="font-bold text-slate-900">{txRef}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Montant encaissé :</span>
                  <span className="font-bold text-emerald-600">{formatFCFA(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Moyen :</span>
                  <span>{networks.find((n) => n.id === selectedNetwork)?.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bénéficiaire :</span>
                  <span>{company.name}</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                La facture a été passée au statut <strong>Payée</strong> dans Factura. Toutes les relances futures sont automatiquement désactivées.
              </p>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
