import { CompanyProfile, Client, Invoice, ReminderLog } from '../types';

export const INITIAL_COMPANY: CompanyProfile = {
  name: 'Kora Studio & Consulting SARL',
  ifu: '3201910293847',
  rccm: 'RB/COT/19 B 24567',
  address: 'Rue 342, Immeuble Horizon, Haie Vive',
  city: 'Cotonou',
  country: 'Bénin',
  phone: '+229 97 45 88 12',
  email: 'contact@korastudio.bj',
  currency: 'XOF',
  momoNetwork: 'MTN',
  momoNumber: '+229 97 45 88 12',
  momoAccountName: 'KORA STUDIO SARL',
  bankName: 'BOA Bénin (Bank Of Africa)',
  bankIbanRib: 'BJ061 01001 00234567890 42',
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Maître Eric Hounnou',
    companyName: 'Cabinet Juridique Hounnou & Associés',
    phone: '+229 96 14 25 36',
    email: 'e.hounnou@jurisbj.com',
    city: 'Cotonou',
    country: 'Bénin',
    notes: 'Client régulier. Exige les factures avec AIB 1% détaillée.',
    createdAt: '2026-08-10',
  },
  {
    id: 'cli-2',
    name: 'Mme Clarisse Dossou',
    companyName: 'Supermarché Le Phénix',
    phone: '+229 95 88 77 44',
    email: 'direction@phenix-market.bj',
    city: 'Abomey-Calavi',
    country: 'Bénin',
    notes: 'Paiement habituel par MTN Mobile Money.',
    createdAt: '2026-08-15',
  },
  {
    id: 'cli-3',
    name: 'M. Jean-Luc Kouamé',
    companyName: 'Aura Tech Solutions',
    phone: '+225 07 48 99 21 10',
    email: 'jlkouame@auratech.ci',
    city: 'Abidjan',
    country: 'Côte d’Ivoire',
    notes: 'Règlement par Wave ou virement bancaire.',
    createdAt: '2026-09-01',
  },
  {
    id: 'cli-4',
    name: 'M. Gatien Akpovi',
    companyName: 'Imprimerie & Graphisme Moderne',
    phone: '+229 97 11 22 33',
    email: 'akpovi@imprimeriemoderne.bj',
    city: 'Porto-Novo',
    country: 'Bénin',
    notes: 'Sous-traitant et partenaire d’impression.',
    createdAt: '2026-09-12',
  },
];

// Helper to get relative date string YYYY-MM-DD
function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    number: 'FACT-2026-042',
    clientId: 'cli-1',
    issueDate: getRelativeDate(-12),
    dueDate: getRelativeDate(2), // J-2: Due in 2 days
    items: [
      {
        id: 'item-101',
        description: 'Refonte complète du site web du cabinet & CMS sécurisé',
        quantity: 1,
        unitPrice: 450000,
        total: 450000,
      },
      {
        id: 'item-102',
        description: 'Hébergement haute disponibilité & nom de domaine .bj (1 an)',
        quantity: 1,
        unitPrice: 85000,
        total: 85000,
      },
    ],
    subtotal: 535000,
    taxRate: 18,
    aibRate: 1,
    totalAmount: 636650,
    status: 'pending',
    notes: 'Règlement à réception ou par MoMo MTN / virement.',
    createdAt: getRelativeDate(-12),
  },
  {
    id: 'inv-2',
    number: 'FACT-2026-043',
    clientId: 'cli-2',
    issueDate: getRelativeDate(-14),
    dueDate: getRelativeDate(0), // J0: Due TODAY
    items: [
      {
        id: 'item-201',
        description: 'Campagne publicitaire réseaux sociaux pour la rentrée commerciale',
        quantity: 1,
        unitPrice: 200000,
        total: 200000,
      },
      {
        id: 'item-202',
        description: 'Création de 8 affiches visuelles promotionnelles grand format',
        quantity: 8,
        unitPrice: 15000,
        total: 120000,
      },
    ],
    subtotal: 320000,
    taxRate: 18,
    aibRate: 1,
    totalAmount: 380800,
    status: 'pending',
    notes: 'Paiement à échéance par Mobile Money souhaité.',
    createdAt: getRelativeDate(-14),
  },
  {
    id: 'inv-3',
    number: 'FACT-2026-041',
    clientId: 'cli-3',
    issueDate: getRelativeDate(-18),
    dueDate: getRelativeDate(-4), // J+3: Overdue by 4 days
    items: [
      {
        id: 'item-301',
        description: 'Audit ergonomique et UX de la plateforme web SaaS',
        quantity: 1,
        unitPrice: 350000,
        total: 350000,
      },
    ],
    subtotal: 350000,
    taxRate: 0,
    aibRate: 0,
    totalAmount: 350000,
    status: 'overdue',
    notes: 'Exonération TVA prestation transfrontalière.',
    createdAt: getRelativeDate(-18),
  },
  {
    id: 'inv-4',
    number: 'FACT-2026-039',
    clientId: 'cli-4',
    issueDate: getRelativeDate(-25),
    dueDate: getRelativeDate(-9), // J+7: Overdue by 9 days (Critical)
    items: [
      {
        id: 'item-401',
        description: 'Conception de l’identité visuelle et charte de marque B2B',
        quantity: 1,
        unitPrice: 280000,
        total: 280000,
      },
    ],
    subtotal: 280000,
    taxRate: 18,
    aibRate: 1,
    totalAmount: 333200,
    status: 'overdue',
    notes: 'Deuxième relance déjà envoyée.',
    createdAt: getRelativeDate(-25),
  },
  {
    id: 'inv-5',
    number: 'FACT-2026-038',
    clientId: 'cli-1',
    issueDate: getRelativeDate(-35),
    dueDate: getRelativeDate(-20),
    items: [
      {
        id: 'item-501',
        description: 'Maintenance mensuelle et sauvegarde serveurs (Août)',
        quantity: 1,
        unitPrice: 120000,
        total: 120000,
      },
    ],
    subtotal: 120000,
    taxRate: 18,
    aibRate: 1,
    totalAmount: 142800,
    status: 'paid',
    paidAt: getRelativeDate(-19),
    paymentMethod: 'MTN Mobile Money',
    notes: 'Réglé sous 24h après relance WhatsApp.',
    createdAt: getRelativeDate(-35),
  },
];

export const INITIAL_REMINDER_LOGS: ReminderLog[] = [
  {
    id: 'log-1',
    invoiceId: 'inv-5',
    invoiceNumber: 'FACT-2026-038',
    clientId: 'cli-1',
    clientName: 'Maître Eric Hounnou',
    stage: 'J0',
    sentAt: `${getRelativeDate(-20)} 08:05`,
    channel: 'whatsapp',
    tone: 'courteous',
    messageText: 'Bonjour Maître Eric, petit rappel courtois concernant la facture FACT-2026-038 de 142 800 FCFA arrivant à échéance ce jour.',
    status: 'delivered',
  },
  {
    id: 'log-2',
    invoiceId: 'inv-4',
    invoiceNumber: 'FACT-2026-039',
    clientId: 'cli-4',
    clientName: 'M. Gatien Akpovi',
    stage: 'J+3',
    sentAt: `${getRelativeDate(-6)} 09:30`,
    channel: 'whatsapp',
    tone: 'firm',
    messageText: 'Bonjour M. Akpovi, sauf erreur de notre part, la facture FACT-2026-039 de 333 200 FCFA est échue depuis 3 jours.',
    status: 'opened',
  },
];
