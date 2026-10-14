import React, { useState, useEffect } from 'react';
import { CompanyProfile, Client, Invoice, ReminderLog } from './types';
import { storage } from './data/storage';
import { Navbar } from './components/Navbar';
import { DashboardKPI } from './components/DashboardKPI';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceModal } from './components/InvoiceModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { ReminderEngine } from './components/ReminderEngine';
import { PaymentSimulatorModal } from './components/PaymentSimulatorModal';
import { ClientsView } from './components/ClientsView';
import { CompanySettingsView } from './components/CompanySettingsView';
import { AIOcrScannerModal } from './components/AIOcrScannerModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal, UserAccount } from './components/AuthModal';
import { getDaysDifference } from './utils/formatters';
import { Globe, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation mode: 'landing' (page d'accueil publique) ou 'app' (espace SaaS connecté)
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('invoices');

  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('factura_user_session');
      return saved
        ? JSON.parse(saved)
        : {
            name: 'Christian Aaron',
            email: 'c.aaron@factura.africa',
            companyName: 'Kora Studio & Consulting SARL',
            phone: '+229 97 45 88 12',
            country: 'Bénin',
            plan: 'pro' as const,
          };
    } catch {
      return null;
    }
  });

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Application Data State from localStorage
  const [company, setCompany] = useState<CompanyProfile>(storage.getCompany());
  const [clients, setClients] = useState<Client[]>(storage.getClients());
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(storage.getReminderLogs());

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const [isStandaloneOcrOpen, setIsStandaloneOcrOpen] = useState(false);
  const [selectedReminderInvoiceId, setSelectedReminderInvoiceId] = useState<string | null>(null);

  // Sync state with storage events
  useEffect(() => {
    const handleInvoicesUpdated = () => setInvoices(storage.getInvoices());
    const handleClientsUpdated = () => setClients(storage.getClients());
    const handleCompanyUpdated = () => setCompany(storage.getCompany());
    const handleRemindersUpdated = () => setReminderLogs(storage.getReminderLogs());

    window.addEventListener('factura_invoices_updated', handleInvoicesUpdated);
    window.addEventListener('factura_clients_updated', handleClientsUpdated);
    window.addEventListener('factura_company_updated', handleCompanyUpdated);
    window.addEventListener('factura_reminders_updated', handleRemindersUpdated);

    return () => {
      window.removeEventListener('factura_invoices_updated', handleInvoicesUpdated);
      window.removeEventListener('factura_clients_updated', handleClientsUpdated);
      window.removeEventListener('factura_company_updated', handleCompanyUpdated);
      window.removeEventListener('factura_reminders_updated', handleRemindersUpdated);
    };
  }, []);

  // Save user session
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('factura_user_session', JSON.stringify(user));
    setViewMode('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('factura_user_session');
    setViewMode('landing');
  };

  // Calculate pending follow-ups needing attention
  const pendingRemindersCount = invoices.filter(
    (inv) => inv.status !== 'paid' && getDaysDifference(inv.dueDate) <= 2
  ).length;

  // Invoice Handlers
  const handleOpenNewInvoice = () => {
    setEditingInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    if (editingInvoice) {
      storage.updateInvoice(editingInvoice.id, invoiceData);
    } else {
      storage.addInvoice(invoiceData);
    }
    setIsInvoiceModalOpen(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      storage.deleteInvoice(id);
    }
  };

  // WhatsApp Follow-up Trigger
  const handleRemindWhatsApp = (invoice: Invoice) => {
    setSelectedReminderInvoiceId(invoice.id);
    setCurrentTab('reminders');
  };

  // Payment Settlement Simulator
  const handleOpenPaymentSimulator = (invoice: Invoice) => {
    setPaymentInvoice(invoice);
  };

  const handlePaymentConfirmed = (invoiceId: string, method: string) => {
    storage.markAsPaid(invoiceId, method);
  };

  // OCR Extracted handler when opened standalone
  const handleStandaloneOcrExtracted = () => {
    setIsStandaloneOcrOpen(false);
    setIsInvoiceModalOpen(true);
  };

  // If in Landing Page mode, render LandingPage
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onOpenApp={() => setViewMode('app')}
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // App Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner allowing return to public landing page */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Factura Workspace · Connecté en tant que <strong>{currentUser?.name || 'Christian Aaron'}</strong> ({currentUser?.companyName || company.name})</span>
          </div>
          <button
            onClick={() => setViewMode('landing')}
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-white font-medium transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Voir la page d'accueil & tarifs</span>
          </button>
        </div>
      </div>

      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onNewInvoice={handleOpenNewInvoice}
        pendingRemindersCount={pendingRemindersCount}
        onGoLanding={() => setViewMode('landing')}
        user={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'invoices' && (
          <div className="space-y-6">
            <DashboardKPI
              invoices={invoices}
              onOpenReminders={() => setCurrentTab('reminders')}
              onScanReceipt={() => setIsStandaloneOcrOpen(true)}
            />

            <InvoiceList
              invoices={invoices}
              clients={clients}
              onNewInvoice={handleOpenNewInvoice}
              onEditInvoice={handleOpenEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onViewInvoice={(inv) => setPrintInvoice(inv)}
              onRemindWhatsApp={handleRemindWhatsApp}
              onPayInvoice={handleOpenPaymentSimulator}
            />
          </div>
        )}

        {currentTab === 'reminders' && (
          <ReminderEngine
            invoices={invoices}
            clients={clients}
            company={company}
            reminderLogs={reminderLogs}
            onAddLog={(log) => storage.addReminderLog(log)}
            onOpenPaymentPortal={handleOpenPaymentSimulator}
            selectedInvoiceId={selectedReminderInvoiceId}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            clients={clients}
            invoices={invoices}
            onAddClient={(cli) => storage.addClient(cli)}
            onUpdateClient={(id, updates) => storage.updateClient(id, updates)}
          />
        )}

        {currentTab === 'company' && (
          <CompanySettingsView
            company={company}
            onSaveCompany={(updated) => storage.saveCompany(updated)}
            onResetAllData={() => storage.resetAll()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p>
              Factura — « Envoyez votre facture. On s’occupe du reste. »
            </p>
            <button
              onClick={() => setViewMode('landing')}
              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Site d'accueil</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Zone UEMOA (FCFA)</span>
            <span aria-hidden="true">·</span>
            <span>Mobile Money & FedaPay</span>
            <span aria-hidden="true">·</span>
            <span>Relances WhatsApp</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setEditingInvoice(null);
        }}
        onSave={handleSaveInvoice}
        clients={clients}
        onAddClient={(c) => storage.addClient(c)}
        editingInvoice={editingInvoice}
      />

      <InvoicePrintModal
        invoice={printInvoice}
        client={clients.find((c) => c.id === printInvoice?.clientId) || null}
        company={company}
        onClose={() => setPrintInvoice(null)}
        onRemindWhatsApp={handleRemindWhatsApp}
      />

      <PaymentSimulatorModal
        invoice={paymentInvoice}
        client={clients.find((c) => c.id === paymentInvoice?.clientId) || null}
        company={company}
        isOpen={Boolean(paymentInvoice)}
        onClose={() => setPaymentInvoice(null)}
        onPaymentSuccess={handlePaymentConfirmed}
      />

      <AIOcrScannerModal
        isOpen={isStandaloneOcrOpen}
        onClose={() => setIsStandaloneOcrOpen(false)}
        onExtracted={handleStandaloneOcrExtracted}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
