import React, { useState } from 'react';
import { X, Upload, Sparkles, Loader2, AlertCircle, FileCheck } from 'lucide-react';

interface ExtractedInvoiceData {
  clientName?: string;
  clientPhone?: string;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  taxRate?: number;
  aibRate?: number;
  notes?: string;
}

interface AIOcrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (data: ExtractedInvoiceData) => void;
}

// Preset samples for rapid testing if user doesn't have an image on hand
const SAMPLE_PRESETS = [
  {
    name: 'Devis Agence Marketing (Cotonou)',
    desc: 'Prestations SEO, Ads & Création de site web',
    data: {
      clientName: 'Compagnie Maritime Atlantique Bénin',
      clientPhone: '+229 97 22 44 66',
      invoiceNumber: `DEVIS-${new Date().getFullYear()}-088`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      items: [
        {
          description: 'Stratégie de communication digitale & Google Ads (3 mois)',
          quantity: 1,
          unitPrice: 350000,
          total: 350000,
        },
        {
          description: 'Création de capsule vidéo promotionnelle pour réseaux sociaux',
          quantity: 2,
          unitPrice: 85000,
          total: 170000,
        },
      ],
      taxRate: 18,
      aibRate: 1,
      notes: 'Acompte de 50% à la commande par MTN MoMo ou FedaPay.',
    },
  },
  {
    name: 'Reçu Fourniture Matériel IT (Abidjan)',
    desc: 'Facture proforma ordinateurs portables & switch réseau',
    data: {
      clientName: 'Groupe Scolaire International Les Élites',
      clientPhone: '+225 05 74 12 33 00',
      invoiceNumber: `FACT-${new Date().getFullYear()}-142`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: [
        {
          description: 'Ordinateur portable Dell Core i7 16Go RAM',
          quantity: 3,
          unitPrice: 480000,
          total: 1440000,
        },
        {
          description: 'Switch Gigabit manageable 24 ports PoE',
          quantity: 1,
          unitPrice: 165000,
          total: 165000,
        },
      ],
      taxRate: 18,
      aibRate: 0,
      notes: 'Garantie matériel 1 an pièce et main d’œuvre.',
    },
  },
];

export const AIOcrScannerModal: React.FC<AIOcrScannerModalProps> = ({
  isOpen,
  onClose,
  onExtracted,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/ocr-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onExtracted(json.data);
        onClose();
      } else {
        throw new Error(json.error || 'Erreur lors de l’analyse du document.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur s'est produite lors de la numérisation avec Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetData: ExtractedInvoiceData) => {
    onExtracted(presetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Scanner intelligent de facture & reçu (IA)
              </h3>
              <p className="text-xs text-slate-500">
                Extrait automatiquement les montants, clients et articles en FCFA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
            {selectedImage ? (
              <div className="space-y-3">
                <div className="max-h-48 overflow-hidden rounded-lg mx-auto flex items-center justify-center bg-black/5">
                  <img
                    src={selectedImage}
                    alt="Facture à scanner"
                    className="max-h-48 object-contain rounded"
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <label className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer underline">
                    Changer l'image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  Importez une photo de facture papier, devis ou reçu
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format JPG, PNG ou WebP (jusqu'à 15 Mo)
                </p>
                <label className="mt-3 inline-block px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors">
                  Sélectionner un fichier
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Action Button if image selected */}
          {selectedImage && (
            <button
              onClick={handleAnalyzeWithGemini}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyse du document avec Gemini en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyser et pré-remplir la facture</span>
                </>
              )}
            </button>
          )}

          {/* Rapid Test Presets */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Ou testez instantanément avec un exemple réel d'Afrique de l'Ouest :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.data)}
                  className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-blue-700">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{preset.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
