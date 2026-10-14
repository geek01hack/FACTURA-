import React, { useState } from 'react';
import { Invoice, Client, CompanyProfile, ReminderStage, ReminderTone, ReminderLog } from '../types';
import { formatFCFA, formatDate, getDaysDifference } from '../utils/formatters';
import {
  MessageCircle,
  Sparkles,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';

interface ReminderEngineProps {
  invoices: Invoice[];
  clients: Client[];
  company: CompanyProfile;
  reminderLogs: ReminderLog[];
  onAddLog: (log: Omit<ReminderLog, 'id' | 'sentAt'>) => void;
  onOpenPaymentPortal: (invoice: Invoice) => void;
  selectedInvoiceId?: string | null;
}

export const ReminderEngine: React.FC<ReminderEngineProps> = ({
  invoices,
  clients,
  company,
  reminderLogs,
  onAddLog,
  onOpenPaymentPortal,
  selectedInvoiceId,
}) => {
  // Only unpaid invoices need reminders
  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'paid');

  const [activeInvoiceId, setActiveInvoiceId] = useState<string>(
    selectedInvoiceId || unpaidInvoices[0]?.id || ''
  );
  const [selectedStage, setSelectedStage] = useState<ReminderStage>('J0');
  const [currentTone, setCurrentTone] = useState<ReminderTone>('courteous');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isGeneratingTone, setIsGeneratingTone] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  // Active invoice and client lookup
  const currentInvoice = unpaidInvoices.find((i) => i.id === activeInvoiceId) || unpaidInvoices[0];
  const currentClient = clients.find((c) => c.id === currentInvoice?.clientId);

  // Calculate target dates for the 4 stages for current invoice
  const getStageDate = (dueDateStr: string, stage: ReminderStage): string => {
    if (!dueDateStr) return '';
    const d = new Date(dueDateStr);
    if (stage === 'J-2') d.setDate(d.getDate() - 2);
    if (stage === 'J0') d.setDate(d.getDate() + 0);
    if (stage === 'J+3') d.setDate(d.getDate() + 3);
    if (stage === 'J+7') d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  // Default templates generator
  const getDefaultMessage = (
    inv: Invoice | undefined,
    cli: Client | undefined,
    stage: ReminderStage,
    tone: ReminderTone
  ): string => {
    if (!inv || !cli) return '';
    const clientName = cli.companyName || cli.name;
    const amountStr = formatFCFA(inv.totalAmount);
    const paymentLink = `https://factura.africa/pay/${inv.id}`;

    if (stage === 'J-2') {
      return `Bonjour ${clientName}, petit rappel courtois : votre facture ${inv.number} d'un montant de ${amountStr} arrivera à échéance le ${formatDate(inv.dueDate)}. Vous pouvez régler en 1 clic par Mobile Money (MTN, Moov, Wave) via ce lien sécurisé : ${paymentLink} . Merci de votre confiance ! — ${company.name}`;
    }

    if (stage === 'J0') {
      return `Bonjour ${clientName}, nous vous informons que votre facture ${inv.number} de ${amountStr} arrive à échéance aujourd'hui (${formatDate(inv.dueDate)}). Pour faciliter votre règlement, voici le lien de paiement direct : ${paymentLink} . Merci pour votre réactivité. — ${company.name}`;
    }

    if (stage === 'J+3') {
      return `Bonjour ${clientName}. Sauf erreur de notre part, nous n'avons pas encore reçu le règlement de la facture ${inv.number} de ${amountStr}, échue depuis 3 jours. Nous vous prions de bien vouloir régulariser la situation dès aujourd'hui via ce lien : ${paymentLink} . Restant à votre écoute, ${company.name}.`;
    }

    // J+7
    return `URGENT - ${company.name} : La facture ${inv.number} (${amountStr}) présente désormais un retard de paiement important. Merci de procéder immédiatement au règlement par Mobile Money via : ${paymentLink} afin d'éviter toute suspension de nos services. Contact : ${company.phone}.`;
  };

  // Update message when invoice or stage or tone changes
  React.useEffect(() => {
    if (currentInvoice && currentClient) {
      setCustomMessage(getDefaultMessage(currentInvoice, currentClient, selectedStage, currentTone));
    }
  }, [currentInvoice?.id, selectedStage, currentTone]);

  // Handle AI Tone Optimization
  const handleAITuneTone = async (newTone: ReminderTone) => {
    if (!currentInvoice || !currentClient) return;

    setCurrentTone(newTone);
    setIsGeneratingTone(true);

    try {
      const res = await fetch('/api/gemini/tune-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: currentClient.companyName || currentClient.name,
          companyName: company.name,
          invoiceNumber: currentInvoice.number,
          amount: currentInvoice.totalAmount,
          dueDate: formatDate(currentInvoice.dueDate),
          stage: selectedStage,
          desiredTone: newTone,
          paymentLink: `https://factura.africa/pay/${currentInvoice.id}`,
        }),
      });

      const json = await res.json();
      if (json.success && json.message) {
        setCustomMessage(json.message);
      }
    } catch (err) {
      console.error(err);
      setCustomMessage(getDefaultMessage(currentInvoice, currentClient, selectedStage, newTone));
    } finally {
      setIsGeneratingTone(false);
    }
  };

  // Clean phone number for WhatsApp URL
  const formatPhoneForWa = (rawPhone: string) => {
    return rawPhone.replace(/[^\d+]/g, '').replace('+', '');
  };

  // Direct WhatsApp dispatch
  const handleSendViaWhatsApp = () => {
    if (!currentInvoice || !currentClient) return;

    const cleanPhone = formatPhoneForWa(currentClient.phone);
    const encodedText = encodeURIComponent(customMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // Record in history log
    onAddLog({
      invoiceId: currentInvoice.id,
      invoiceNumber: currentInvoice.number,
      clientId: currentClient.id,
      clientName: currentClient.companyName || currentClient.name,
      stage: selectedStage,
      channel: 'whatsapp',
      tone: currentTone,
      messageText: customMessage,
      status: 'sent',
    });

    // Open WhatsApp Web or mobile app
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate morning cron tour (08:00 WAT)
  const handleRunDailyCron = () => {
    let dispatched = 0;
    unpaidInvoices.forEach((inv) => {
      const days = getDaysDifference(inv.dueDate);
      const cli = clients.find((c) => c.id === inv.clientId);
      if (!cli) return;

      let stageToTrigger: ReminderStage | null = null;
      if (days === 2) stageToTrigger = 'J-2';
      else if (days === 0) stageToTrigger = 'J0';
      else if (days === -3 || (days < 0 && days >= -5)) stageToTrigger = 'J+3';
      else if (days <= -7) stageToTrigger = 'J+7';

      if (stageToTrigger) {
        onAddLog({
          invoiceId: inv.id,
          invoiceNumber: inv.number,
          clientId: cli.id,
          clientName: cli.companyName || cli.name,
          stage: stageToTrigger,
          channel: 'whatsapp',
          tone: stageToTrigger === 'J+7' ? 'firm' : 'courteous',
          messageText: getDefaultMessage(inv, cli, stageToTrigger, 'courteous'),
          status: 'delivered',
        });
        dispatched++;
      }
    });

    setBatchNotice(
      `Tournée quotidienne exécutée avec succès à 08h00 WAT : ${dispatched} rappel(s) WhatsApp planifié(s) et inscrits dans le registre.`
    );
    setTimeout(() => setBatchNotice(null), 6000);
  };

  if (unpaidInvoices.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Toutes vos factures sont réglées !
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Aucune relance requise pour le moment. Votre trésorerie est à 100% à jour.
        </p>
      </div>
    );
  }

  const STAGES_CONFIG: Array<{ stage: ReminderStage; label: string; desc: string }> = [
    { stage: 'J-2', label: 'J-2 Préventif', desc: 'Rappel courtois avant la date fatidique' },
    { stage: 'J0', label: "J0 Jour J", desc: "Avis d'échéance à la date convenue" },
    { stage: 'J+3', label: 'J+3 Retard', desc: 'Relance formelle après 3 jours de dépassement' },
    { stage: 'J+7', label: 'J+7 Ferme', desc: 'Dernier avis avant recours contentieux' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with automated daily tour execution */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              Moteur de Relance Automatique WhatsApp & Mobile Money
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatisation planifiée chaque matin à 08h00 WAT (heure du Bénin / UEMOA)
          </p>
        </div>

        <button
          onClick={handleRunDailyCron}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exécuter la tournée du jour</span>
        </button>
      </div>

      {batchNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{batchNotice}</span>
        </div>
      )}

      {/* Main Workspace Split: Left Invoices Selector & Stages / Right WhatsApp Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Select invoice & Stage timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Invoice Picker */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Choisir la créance à suivre ({unpaidInvoices.length} en attente)
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {unpaidInvoices.map((inv) => {
                const cli = clients.find((c) => c.id === inv.clientId);
                const isSelected = inv.id === (currentInvoice?.id || '');
                const days = getDaysDifference(inv.dueDate);

                return (
                  <button
                    key={inv.id}
                    onClick={() => setActiveInvoiceId(inv.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {inv.number}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                        {formatFCFA(inv.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                      <span className="truncate max-w-[180px]">
                        {cli?.companyName || cli?.name}
                      </span>
                      <span
                        className={
                          days < 0
                            ? 'text-rose-600 font-semibold'
                            : days === 0
                            ? 'text-amber-600 font-semibold'
                            : 'text-slate-500'
                        }
                      >
                        {days < 0 ? `Retard ${Math.abs(days)}j` : days === 0 ? "Aujourd'hui" : `Dans ${days}j`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sequence Timeline Steps for this invoice */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900">
                Séquence de relance Factura
              </h3>
              <span className="text-[11px] text-slate-500">
                Échéance : {formatDate(currentInvoice?.dueDate || '')}
              </span>
            </div>

            <div className="space-y-2">
              {STAGES_CONFIG.map(({ stage, label, desc }) => {
                const isStageActive = selectedStage === stage;
                const targetDate = getStageDate(currentInvoice?.dueDate || '', stage);

                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isStageActive
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isStageActive ? 'text-emerald-800' : 'text-slate-800'
                          }`}
                        >
                          {label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDate(targetDate)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${
                        isStageActive ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive WhatsApp Dispatch Screen (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Tone selector bar with Gemini AI Trigger */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Optimiser le ton du message avec l'IA
                </span>
              </div>

              {/* Segmented tone pills */}
              <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                <button
                  type="button"
                  disabled={isGeneratingTone}
                  onClick={() => handleAITuneTone('courteous')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    currentTone === 'courteous'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Courtois
                </button>
                <button
                  type="button"
                  disabled={isGeneratingTone}
                  onClick={() => handleAITuneTone('warm')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    currentTone === 'warm'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chaleureux
                </button>
                <button
                  type="button"
                  disabled={isGeneratingTone}
                  onClick={() => handleAITuneTone('firm')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    currentTone === 'firm'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ferme
                </button>
                <button
                  type="button"
                  disabled={isGeneratingTone}
                  onClick={() => handleAITuneTone('direct_momo')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    currentTone === 'direct_momo'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Direct MoMo
                </button>
              </div>
            </div>

            {/* WhatsApp Chat Simulation Container */}
            <div className="p-6 bg-[#EFEAE2] min-h-[360px] flex flex-col justify-between">
              {/* WhatsApp Header bar */}
              <div className="bg-[#075E54] text-white px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {(currentClient?.name || 'C').charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">
                      {currentClient?.companyName || currentClient?.name}
                    </div>
                    <div className="text-[10px] text-emerald-100 font-mono">
                      {currentClient?.phone}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded text-white">
                  Étape {selectedStage}
                </div>
              </div>

              {/* Message Bubble */}
              <div className="flex justify-end mb-4">
                <div className="bg-[#DCF8C6] text-slate-800 p-4 rounded-xl rounded-tr-xs shadow-xs max-w-md w-full border border-emerald-100 text-xs leading-relaxed space-y-2">
                  <textarea
                    rows={6}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none resize-none text-slate-800 text-xs leading-relaxed"
                  />
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50 text-[10px] text-slate-500">
                    <span className="italic">Personnalisable avant envoi</span>
                    <span className="font-mono">
                      {new Date().toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for WhatsApp dispatch */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>

                  {/* Test Payment Portal */}
                  {currentInvoice && (
                    <button
                      onClick={() => onOpenPaymentPortal(currentInvoice)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Tester le lien de paiement</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleSendViaWhatsApp}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa51] rounded-lg shadow-sm transition-transform active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Envoyer sur WhatsApp (1 clic)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Journal d'audit & historique des relances
            </h3>
            <p className="text-[11px] text-slate-500">
              Traçabilité complète des messages et notifications envoyés aux clients
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {reminderLogs.length} relance{reminderLogs.length > 1 ? 's' : ''} consignée{reminderLogs.length > 1 ? 's' : ''}
          </span>
        </div>

        {reminderLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Aucune relance enregistrée pour l'instant.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-4 font-semibold">Date & Heure</th>
                  <th className="py-2.5 px-4 font-semibold">Client</th>
                  <th className="py-2.5 px-4 font-semibold">Facture</th>
                  <th className="py-2.5 px-4 font-semibold">Étape</th>
                  <th className="py-2.5 px-4 font-semibold">Canal</th>
                  <th className="py-2.5 px-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reminderLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {log.sentAt}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {log.clientName}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {log.invoiceNumber}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-slate-800">{log.stage}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-slate-600 font-medium">
                        {log.status === 'delivered' ? 'Livré' : log.status === 'opened' ? 'Lu' : 'Envoyé'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
