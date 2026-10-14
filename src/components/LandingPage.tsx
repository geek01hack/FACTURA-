import React, { useState } from 'react';
import {
  ReceiptText,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Clock,
  TrendingUp,
  FileCheck,
  ChevronDown,
  Building,
  Users,
  Zap,
} from 'lucide-react';
import { formatFCFA } from '../utils/formatters';

interface LandingPageProps {
  onOpenApp: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenApp, onOpenAuth }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  // Pricing definitions in FCFA
  const plans = [
    {
      name: 'Découverte',
      audience: 'Pour indépendants débutants',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Testez la gestion simplifiée de vos factures et découvrez la puissance du suivi automatisé.',
      features: [
        'Jusqu’à 3 factures par mois',
        'Génération de factures PDF en FCFA',
        'Calculs TVA (18%) et AIB (1% / 5%)',
        'Lien de paiement FedaPay & Mobile Money',
        'Relances manuelles en 1 clic sur WhatsApp',
      ],
      cta: 'Commencer gratuitement',
      popular: false,
    },
    {
      name: 'Pro',
      audience: 'Pour freelances actifs & consultants',
      priceMonthly: 9900,
      priceAnnual: 7900, // per month billed annually
      description: 'Automatisez 100% de vos relances WhatsApp et récupérez votre argent 3 fois plus vite.',
      features: [
        'Factures & clients illimités',
        'Séquence de relance automatique J-2, J0, J+3, J+7',
        'Optimiseur de ton de relance par IA Gemini',
        'Scanner intelligent OCR de reçus par IA',
        'Notifications automatiques quotidiennes à 08h00 WAT',
        'Historique complet & accusés de réception',
      ],
      cta: 'Démarrer l’essai 14 jours',
      popular: true,
    },
    {
      name: 'Business',
      audience: 'Pour PME, agences & cabinets',
      priceMonthly: 24900,
      priceAnnual: 19900,
      description: 'Pour les entreprises établies avec gros volumes de créances et équipes de gestion.',
      features: [
        'Tout le forfait Pro inclus',
        'Multi-comptes Mobile Money & RIB bancaires',
        'Tableau de bord de recouvrement Recharts avancé',
        'Exports comptables certifiés UEMOA',
        'Support WhatsApp dédié 7j/7',
        'Accompagnement configuration personnalisé',
      ],
      cta: 'Passer à l’échelle',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Comment fonctionne la relance automatique sur WhatsApp ?',
      a: 'Factura calcule automatiquement les dates clés dès l’émission de votre facture : J-2 (rappel courtois avant l’échéance), J0 (le jour J), J+3 (premier retard) et J+7 (mise en demeure ferme). Chaque message contient le montant exact en FCFA et le lien de paiement direct. Vous pouvez les envoyer d’un clic ou laisser l’automatisation quotidienne de 08h00 s’en charger.',
    },
    {
      q: 'Quels sont les opérateurs Mobile Money acceptés ?',
      a: 'Factura intègre les principaux réseaux de la zone UEMOA : MTN Mobile Money (Bénin, Côte d’Ivoire), Moov Money (Moov Africa), Orange Money, Wave et les cartes bancaires via notre passerelle FedaPay.',
    },
    {
      q: 'Que se passe-t-il lorsque le client paie sa facture ?',
      a: 'Dès que le client valide son débit Mobile Money sur son smartphone, la transaction est instantanément confirmée. Factura passe le statut de la facture à "Payée" et coupe immédiatement toutes les relances programmées.',
    },
    {
      q: 'Factura est-il conforme aux obligations fiscales du Bénin et de l’UEMOA ?',
      a: 'Oui ! Factura applique scrupuleusement la réglementation en vigueur : intégration du Numéro IFU, du RCCM, du taux de TVA standard de 18% et des retenues AIB (1% pour les prestataires immatriculés ou 5%).',
    },
    {
      q: 'Puis-je tester Factura sans carte bancaire ?',
      a: 'Absolument. Vous bénéficiez d’un essai gratuit complet de 14 jours, et le forfait Découverte est 100% gratuit à vie pour tester jusqu’à 3 factures par mois.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Landing Top Navigation (Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text brand wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <ReceiptText className="w-4 h-4" />
            </span>
            <span>Factura</span>
          </button>

          {/* Zone 2: 4 nav links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#solution" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Solution
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Fonctionnement
            </a>
            <a href="#target" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Pour qui ?
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Connexion
            </button>
            <button
              onClick={onOpenApp}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Accéder à l'App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Pitch (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Quiet kicker without pill */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Le SaaS de facturation n°1 pour l'Afrique francophone (UEMOA)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                « Envoyez votre facture. <br />
                <span className="text-blue-600">On s’occupe du reste. »</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Ne passez plus vos journées à réclamer votre argent. Factura automatise les relances de paiement sur WhatsApp et simplifie le règlement par Mobile Money (MTN, Moov, Wave) pour les PME et indépendants.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onOpenApp}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Tester la démo en direct</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Créer un compte gratuit
                </button>
              </div>

              {/* Regional trust markers */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Conforme IFU / TVA UEMOA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Paiements en FCFA (XOF)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mobile Money & FedaPay</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Simulated Floating Mobile UI / Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                        F
                      </div>
                      <div>
                        <div className="text-xs font-bold">Factura Relance Auto</div>
                        <div className="text-[10px] text-emerald-100">WhatsApp Business · Automatique 08h00</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-mono">
                      J+3 Retard
                    </span>
                  </div>

                  <div className="p-4 bg-[#EFEAE2] space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">Cabinet Juridique Hounnou</span>
                        <span className="font-mono text-blue-600 font-bold tabular-nums">380 800 FCFA</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Bonjour Maître, sauf erreur de notre part, la facture <strong className="font-mono">FACT-2026-042</strong> est échue depuis 3 jours. Réglez en 1 clic par Mobile Money ci-dessous :
                      </p>
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-blue-600" />
                          <span className="text-[11px] font-semibold text-blue-900">Lien direct MTN / Moov / Wave</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 underline">Payer</span>
                      </div>
                    </div>

                    {/* Simulation badge */}
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center text-xs text-emerald-800 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Règlement validé · Relances suivantes annulées</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences: Pour qui ? (From user brief) */}
      <section id="target" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Marché cible
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Conçu sur-mesure pour les réalités d'Afrique francophone
            </h3>
            <p className="text-sm text-slate-600">
              Des indépendants aux PME de services, Factura s'adapte à vos habitudes de travail locales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Audience 1: Freelances */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Freelances & Consultants
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Développeurs, graphistes, consultants, community managers et prestataires qui facturent des clients régulièrement et n'ont pas le temps de relancer chaque impayé un par un.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                <span>Paiements rapides par Wave & MTN MoMo</span>
              </div>
            </div>

            {/* Audience 2: PME */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Building className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  PME & Agences de services
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Agences digitales, cabinets juridiques, entreprises de maintenance et sociétés de conseil B2B qui gèrent des dizaines de factures avec acomptes et TVA/AIB.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span>Rapports de trésorerie et conformité IFU</span>
              </div>
            </div>

            {/* Audience 3: Entrepreneurs & Commerçants */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Entrepreneurs & Fournisseurs B2B
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Entreprises travaillant avec des clients récurrents, ayant besoin de visibilité exacte sur les encaissements à venir pour sécuriser leur trésorerie.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <span>Délai de paiement réduit de 70%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works: The Automatic Reminder Sequence */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Fonctionnement
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Le moteur de relance automatique en 4 étapes
            </h3>
            <p className="text-sm text-slate-600">
              Dès qu’une facture est émise, Factura gère le calendrier pour vous. Aucune facture ne passe entre les mailles du filet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-black text-blue-600 font-mono block mb-2">J-2</span>
              <h4 className="text-sm font-bold text-slate-900">Rappel préventif</h4>
              <p className="text-xs text-slate-500 mt-1">Avant l'échéance</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Un message amical et préventif envoyé sur WhatsApp pour rappeler l'échéance prochaine et transmettre le lien de paiement.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-black text-amber-600 font-mono block mb-2">J0</span>
              <h4 className="text-sm font-bold text-slate-900">Jour de l'échéance</h4>
              <p className="text-xs text-slate-500 mt-1">À la date convenue</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Avis d'échéance formel pour inviter le client à valider son règlement par Mobile Money le jour même.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-black text-rose-600 font-mono block mb-2">J+3</span>
              <h4 className="text-sm font-bold text-slate-900">Relance de retard</h4>
              <p className="text-xs text-slate-500 mt-1">3 jours de retard</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Relance professionnelle explicite pour éviter que la créance ne traîne et s'enlise dans les oublis comptables.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-2xl font-black text-purple-600 font-mono block mb-2">J+7</span>
              <h4 className="text-sm font-bold text-slate-900">Dernier avis ferme</h4>
              <p className="text-xs text-slate-500 mt-1">7 jours de retard</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Mise en demeure cordiale mais ferme rappelant les conséquences sur la continuité des prestations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (From user brief) */}
      <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Tarifs simples & transparents
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Un investissement rentabilisé dès votre première facture recouvrée
            </h3>
            <p className="text-sm text-slate-600">
              Tarification accessible en FCFA, adaptée aux petites structures et PME d'Afrique.
            </p>

            {/* Billing cadence toggle */}
            <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-xl mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Facturation Mensuelle
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annuel</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p) => {
              const currentPrice = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;

              return (
                <div
                  key={p.name}
                  className={`p-8 rounded-2xl flex flex-col justify-between border transition-all ${
                    p.popular
                      ? 'border-blue-600 bg-white shadow-xl ring-2 ring-blue-600 relative'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Recommandé pour PME
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-lg font-bold text-slate-900">{p.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{p.audience}</p>

                    <div className="my-6">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                        {currentPrice === 0 ? 'Gratuit' : formatFCFA(currentPrice)}
                      </span>
                      {currentPrice > 0 && (
                        <span className="text-xs text-slate-500 ml-1">/ mois</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                      {p.description}
                    </p>

                    <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={onOpenApp}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        p.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {p.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-slate-900">
              Validé par les entrepreneurs de Cotonou, Abidjan et Dakar
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                « Avant Factura, je passais mes samedis après-midi à envoyer des messages gênants à mes clients pour réclamer mes honoraires de développement web. Aujourd'hui, les relances automatiques WhatsApp font le travail à ma place. »
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900 block">Sidoine Agbodjogbé</span>
                <span className="text-slate-500 text-[11px]">Développeur Full-Stack freelance · Cotonou</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                « L'intégration directe du lien MTN Mobile Money et Wave dans le message WhatsApp a tout changé. Nos clients cliquent et paient immédiatement depuis leur smartphone. Notre trésorerie respire enfin. »
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900 block">Amina Touré</span>
                <span className="text-slate-500 text-[11px]">Directrice d'Agence de Communication · Abidjan</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                « Le calcul automatique de l'AIB 1% et de la TVA 18% aux normes du Bénin nous évite toutes les erreurs de facturation. Le scan de reçu par IA est un vrai gain de temps au quotidien. »
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900 block">Hubert Dossou</span>
                <span className="text-slate-500 text-[11px]">Gérant de Société d'Infogérance · Calavi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Questions Fréquentes
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              Tout ce que vous devez savoir sur Factura
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Prêt à vous faire payer à temps sans stress ?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Rejoignez les entrepreneurs d'Afrique francophone qui ont transformé leur recouvrement avec Factura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenApp}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              Accéder à l'application maintenant
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer border border-blue-500"
            >
              Créer mon compte gratuit
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
                <ReceiptText className="w-3.5 h-3.5 text-white" />
              </span>
              <span>Factura</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Logiciel SaaS de facturation et relances automatisées de créances pour les entreprises d'Afrique de l'Ouest et zone UEMOA.
            </p>
          </div>

          <div>
            <span className="font-bold text-white block mb-3">Produit</span>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#how-it-works" className="hover:text-white">Relances WhatsApp</a></li>
              <li><a href="#solution" className="hover:text-white">Factures en FCFA (XOF)</a></li>
              <li><a href="#pricing" className="hover:text-white">Paiements Mobile Money</a></li>
              <li><button onClick={onOpenApp} className="hover:text-white text-left">Démonstration en direct</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white block mb-3">Zone de couverture</span>
            <ul className="space-y-2 text-[11px]">
              <li>Bénin (Cotonou, Calavi, Porto-Novo)</li>
              <li>Côte d’Ivoire (Abidjan, San Pedro)</li>
              <li>Sénégal (Dakar, Thiès)</li>
              <li>Togo & Cameroun</li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white block mb-3">Légal & Contact</span>
            <ul className="space-y-2 text-[11px]">
              <li>Conformité IFU & Réglementation UEMOA</li>
              <li>Confidentialité & Sécurité des données</li>
              <li>contact@factura.africa</li>
              <li>Support WhatsApp : +229 97 45 88 12</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Factura SaaS. Tous droits réservés. « Envoyez votre facture. On s’occupe du reste. »
        </div>
      </footer>
    </div>
  );
};
