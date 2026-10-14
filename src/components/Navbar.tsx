import React, { useState } from 'react';
import { Plus, Menu, X, ReceiptText, Globe, LogOut, User } from 'lucide-react';
import { UserAccount } from './AuthModal';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNewInvoice: () => void;
  pendingRemindersCount: number;
  onGoLanding: () => void;
  user: UserAccount | null;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onNewInvoice,
  pendingRemindersCount,
  onGoLanding,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'invoices', label: 'Factures' },
    {
      id: 'reminders',
      label: pendingRemindersCount > 0 ? `Relances (${pendingRemindersCount})` : 'Relances WhatsApp',
    },
    { id: 'clients', label: 'Clients' },
    { id: 'company', label: 'Mon Entreprise' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark with link */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onTabChange('invoices')}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <ReceiptText className="w-4 h-4" />
              </span>
              <span>Factura</span>
            </button>

            {/* Quick link to Landing Page */}
            <button
              onClick={onGoLanding}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Voir la page de présentation publique"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Site vitrine</span>
            </button>
          </div>

          {/* Zone 2: 4 nav links with clean hover styling */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action + User Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNewInvoice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle Facture</span>
              <span className="sm:hidden">Créer</span>
            </button>

            {/* User status & dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200/80"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                    {user.name.charAt(0)}
                  </span>
                  <span className="hidden lg:inline truncate max-w-[120px]">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.companyName}</p>
                      <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono uppercase font-bold">
                        Forfait {user.plan}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onTabChange('company');
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      Paramètres d'entreprise
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onGoLanding();
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      Voir le site vitrine
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              >
                Connexion
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onGoLanding();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>Site public & Tarifs</span>
          </button>
        </div>
      )}
    </header>
  );
};
