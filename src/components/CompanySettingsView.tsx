import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { Building2, Save, Smartphone, RotateCcw, CheckCircle2 } from 'lucide-react';

interface CompanySettingsViewProps {
  company: CompanyProfile;
  onSaveCompany: (updated: CompanyProfile) => void;
  onResetAllData: () => void;
}

export const CompanySettingsView: React.FC<CompanySettingsViewProps> = ({
  company,
  onSaveCompany,
  onResetAllData,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>(company);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompany(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données de test par défaut ?')) {
      onResetAllData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Informations d'entreprise et coordonnées Mobile Money mises à jour avec succès.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité Fiscale & Légale */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Profil Entreprise & Mentions Légales
              </h2>
              <p className="text-xs text-slate-500">
                Ces mentions figurent automatiquement sur vos factures officielles et devis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nom ou Raison Sociale
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Numéro IFU (Identifiant Fiscal Unique)
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 3201910293847"
                value={formData.ifu}
                onChange={(e) => setFormData({ ...formData, ifu: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                RCCM (Registre de Commerce)
              </label>
              <input
                type="text"
                placeholder="Ex: RB/COT/19 B 24567"
                value={formData.rccm}
                onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Téléphone principal
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email professionnel
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Adresse & Quartier
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ville</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pays</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Coordonnées d'Encaissement Mobile Money & Banque */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Encaissement Mobile Money (Bénin & UEMOA)
              </h2>
              <p className="text-xs text-slate-500">
                Numéro et réseau affichés aux clients pour les règlements directs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Réseau Mobile Money par défaut
              </label>
              <select
                value={formData.momoNetwork}
                onChange={(e) =>
                  setFormData({ ...formData, momoNetwork: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="MTN">MTN Mobile Money (MoMo)</option>
                <option value="Moov">Moov Money (Moov Africa)</option>
                <option value="Wave">Wave</option>
                <option value="Orange">Orange Money</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Numéro de compte MoMo
              </label>
              <input
                type="text"
                required
                value={formData.momoNumber}
                onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nom du compte MoMo (Bénéficiaire)
              </label>
              <input
                type="text"
                required
                value={formData.momoAccountName}
                onChange={(e) => setFormData({ ...formData, momoAccountName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Banque partenaire (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex: BOA Bénin, Ecobank..."
                value={formData.bankName || ''}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                RIB / IBAN Bancaire (optionnel)
              </label>
              <input
                type="text"
                placeholder="BJ061 ..."
                value={formData.bankIbanRib || ''}
                onChange={(e) => setFormData({ ...formData, bankIbanRib: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les données de démo Factura</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les coordonnées</span>
          </button>
        </div>
      </form>
    </div>
  );
};
