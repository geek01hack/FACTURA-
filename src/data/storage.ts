import { CompanyProfile, Client, Invoice, ReminderLog } from '../types';
import { INITIAL_COMPANY, INITIAL_CLIENTS, INITIAL_INVOICES, INITIAL_REMINDER_LOGS } from './mockData';

const STORAGE_KEYS = {
  COMPANY: 'factura_company_v1',
  CLIENTS: 'factura_clients_v1',
  INVOICES: 'factura_invoices_v1',
  REMINDERS: 'factura_reminders_v1',
};

export const storage = {
  getCompany(): CompanyProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANY);
      return data ? JSON.parse(data) : INITIAL_COMPANY;
    } catch {
      return INITIAL_COMPANY;
    }
  },

  saveCompany(company: CompanyProfile): void {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    window.dispatchEvent(new Event('factura_company_updated'));
  },

  getClients(): Client[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return data ? JSON.parse(data) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  },

  saveClients(clients: Client[]): void {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    window.dispatchEvent(new Event('factura_clients_updated'));
  },

  addClient(client: Omit<Client, 'id' | 'createdAt'>): Client {
    const clients = this.getClients();
    const newClient: Client = {
      ...client,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.saveClients([newClient, ...clients]);
    return newClient;
  },

  updateClient(id: string, updates: Partial<Client>): void {
    const clients = this.getClients().map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveClients(clients);
  },

  getInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return data ? JSON.parse(data) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  },

  saveInvoices(invoices: Invoice[]): void {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    window.dispatchEvent(new Event('factura_invoices_updated'));
  },

  addInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice {
    const invoices = this.getInvoices();
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.saveInvoices([newInvoice, ...invoices]);
    return newInvoice;
  },

  updateInvoice(id: string, updates: Partial<Invoice>): void {
    const invoices = this.getInvoices().map((inv) => (inv.id === id ? { ...inv, ...updates } : inv));
    this.saveInvoices(invoices);
  },

  deleteInvoice(id: string): void {
    const invoices = this.getInvoices().filter((inv) => inv.id !== id);
    this.saveInvoices(invoices);
  },

  markAsPaid(id: string, paymentMethod: string = 'Mobile Money (FedaPay)'): void {
    const invoices = this.getInvoices().map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'paid' as const,
          paidAt: new Date().toISOString().split('T')[0],
          paymentMethod,
        };
      }
      return inv;
    });
    this.saveInvoices(invoices);
  },

  getReminderLogs(): ReminderLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : INITIAL_REMINDER_LOGS;
    } catch {
      return INITIAL_REMINDER_LOGS;
    }
  },

  addReminderLog(log: Omit<ReminderLog, 'id' | 'sentAt'>): ReminderLog {
    const logs = this.getReminderLogs();
    const newLog: ReminderLog = {
      ...log,
      id: `log-${Date.now()}`,
      sentAt: new Date().toLocaleTimeString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify([newLog, ...logs]));
    window.dispatchEvent(new Event('factura_reminders_updated'));
    return newLog;
  },

  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(INITIAL_COMPANY));
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(INITIAL_REMINDER_LOGS));
    window.dispatchEvent(new Event('factura_invoices_updated'));
    window.dispatchEvent(new Event('factura_clients_updated'));
    window.dispatchEvent(new Event('factura_company_updated'));
    window.dispatchEvent(new Event('factura_reminders_updated'));
  },
};
