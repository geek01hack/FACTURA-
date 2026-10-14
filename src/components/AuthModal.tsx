import React, { useState } from 'react';
import { X, Lock, Mail, Building, Phone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface UserAccount {
  name: string;
  email: string;
  companyName: string;
  phone: string;
  country: string;
  plan: 'free' | 'pro' | 'business';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('+229 ');
  const [country, setCountry] = useState('Bénin');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: fullName || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Entrepreneur'),
        email: email || 'contact@korastudio.bj',
        companyName: companyName || 'Kora Studio & Consulting SARL',
        phone: phone || '+229 97 45 88 12',
        country,
        plan: 'pro',
      });
      onClose();
    }, 600);
  };

  const handleDemoAccess = () => {
    onLoginSuccess({
      name: 'Christian Aaron',
      email: 'c.aaron@factura.africa',
      companyName: 'Kora Studio & Consulting SARL',
      phone: '+229 97 45 88 12',
      country: 'Bénin',
      plan: 'pro',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'login' ? 'Connexion à Factura' : 'Créer votre compte Factura'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? 'Accédez à votre cockpit de facturation et relances'
                : '14 jours d’essai gratuit · Sans engagement · Aucun moyen de paiement requis'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tester en 1 clic (Compte Démo Entreprise Bénin)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
              ou
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nom et Prénom
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Eric Hounnou"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nom de votre entreprise ou marque
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Agence Digitale Kora"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Téléphone WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+229 97 00 12 34"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pays (Zone UEMOA)
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                    >
                      <option value="Bénin">Bénin (+229)</option>
                      <option value="Côte d’Ivoire">Côte d’Ivoire (+225)</option>
                      <option value="Sénégal">Sénégal (+221)</option>
                      <option value="Togo">Togo (+228)</option>
                      <option value="Cameroun">Cameroun (+237)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="contact@votre-entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Mot de passe</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Lien de réinitialisation envoyé à votre adresse email.')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer mt-2"
            >
              <span>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Vous n'avez pas encore de compte ?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  S'inscrire gratuitement
                </button>
              </p>
            ) : (
              <p>
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
