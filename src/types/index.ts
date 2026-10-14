export interface CompanyProfile {
  name: string;
  ifu: string; // Numéro d'Identifiant Fiscal Unique
  rccm: string; // Registre du Commerce et du Crédit Mobilier
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  logoUrl?: string;
  currency: 'XOF';
  momoNetwork: 'MTN' | 'Moov' | 'Orange' | 'Wave';
  momoNumber: string;
  momoAccountName: string;
  bankName?: string;
  bankIbanRib?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  phone: string; // Numéro WhatsApp international (ex: +229 97 00 12 34)
  email: string;
  city: string;
  country: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'overdue' | 'paid';

export interface Invoice {
  id: string;
  number: string; // Ex: FACT-2026-001
  clientId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // TVA en % (ex: 18)
  aibRate: number; // AIB en % (ex: 1 ou 5)
  totalAmount: number;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export type ReminderStage = 'J-2' | 'J0' | 'J+3' | 'J+7';
export type ReminderTone = 'courteous' | 'warm' | 'firm' | 'direct_momo';

export interface ReminderStepConfig {
  stage: ReminderStage;
  label: string;
  daysOffset: number; // -2, 0, +3, +7
  defaultTone: ReminderTone;
  description: string;
}

export interface ReminderLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  stage: ReminderStage;
  sentAt: string;
  channel: 'whatsapp' | 'sms' | 'email';
  tone: ReminderTone;
  messageText: string;
  status: 'sent' | 'opened' | 'delivered';
}
