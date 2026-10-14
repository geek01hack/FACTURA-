# Factura — Logiciel SaaS de Facturation & Relance Automatique (UEMOA / Bénin)

Factura transforme la gestion des créances pour les indépendants et PME d'Afrique francophone en automatisant l'émission de factures conformes en FCFA (XOF), la planification rigoureuse de séquences de relance par WhatsApp, et l'encaissement direct via Mobile Money et FedaPay.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Les trois orientations majeures validées lors de la phase de cadrage régissent l'architecture et les parcours clés de l'application :

- **Paiements locaux intégrés** : Expérience d'encaissement centrée sur **FedaPay et Mobile Money** (MTN Mobile Money Bénin/Côte d'Ivoire, Moov Money, Orange Money, Wave) avec génération d'un lien de paiement sécurisé, simulateur de checkout et confirmation automatique par webhook.
- **Moteur de relance interactif** : Chronologie interactive des relances (J-2 préventif, J0 échéance, J+3 relance ferme, J+7 mise en demeure/dernier avis), avec **prévisualisation instantanée des messages WhatsApp**, déclenchement en 1 clic (via `https://wa.me/` direct et API simulée/réelle), journal d'audit et configuration des fréquences.
- **Intelligence Artificielle d'assistance** : Module d'**OCR intelligent de factures et reçus** (extraction instantanée du client, montant, date, articles) et **optimiseur de ton IA pour les relances** (ajustement du message selon la relation : courtois, chaleureux, formel ou ferme) propulsé par Gemini (`gemini-3.8-flash`).

---

## 1. Overview & Core Concept

### Problème résolu
En Afrique francophone (Bénin, Sénégal, Côte d'Ivoire, Togo, etc.), les prestataires de services et PME perdent des heures précieuses à composer manuellement des messages WhatsApp, téléphoner aux mauvais moments et négocier le recouvrement de leurs honoraires en FCFA. Les factures impayées asphyxient la trésorerie et détériorent la relation client.

### Proposition de valeur
**« Envoyez votre facture. On s’occupe du reste. »**
- Création express de devis et factures professionnelles en FCFA (XOF) avec calculs automatiques d'acomptes et TVA/AIB.
- Séquence de relance automatisée sans effort mental pour le chef d'entreprise.
- Encaissement sans friction via les portefeuilles Mobile Money du client final.
- Visibilité en temps réel de la trésorerie engagée, échue et recouvrée.

---

## 2. User Experience & Visual Design

Conformément aux directives de design `frontend-design` (SaaS Dashboard & Mobile Touch App), l'interface respecte une rigueur stricte anti-slop, sans badges gélules décoratifs inutiles, avec une lisibilité maximale et une disposition responsive complète (375px mobile jusqu'à 1440px desktop).

### A. Identité Visuelle & Thème
- **Aesthetic Direction** : B2B SaaS professionnel moderne, sobre et digne des meilleures fintechs africaines (style Wave / Stripe / Qonto adapté au contexte UEMOA).
- **Palette chromatique (Règle 60-30-10)** :
  - **60% Canvas Neutre** : Fond principal blanc pur et ardoise claire (`bg-slate-50` / `bg-white`), texte contrasté (`text-slate-900`, `text-slate-600`).
  - **30% Surfaces & Bordures** : Cartes plates à élévation unique, bordures ultra-fines (`border border-slate-200/80`), fonds d'en-tête structurés.
  - **10% Accents Fonctionnels** :
    - Vert Émeraude / Succès (`#059669` / `#10B981`) : Factures payées, boutons d'action WhatsApp.
    - Indigo / Bleu Cobalt (`#2563EB`) : Actions principales Factura (Créer facture, Encaisser).
    - Ambre (`#D97706`) : Échéances proches (J-2, J0).
    - Crimson (`#DC2626`) : Retards de paiement (J+3, J+7).
- **Typographie** :
  - En-têtes & Titres : `Plus Jakarta Sans` (moderne, géométrique, affirmé).
  - Corps de texte : `Plus Jakarta Sans` / `DM Sans` (mesure de lecture optimale).
  - Chiffres & Montants FCFA : Chiffres tabulaires stricts (`tabular-nums font-mono`) pour un alignement vertical irréprochable des montants en XOF.
- **Zéro-Pill Discipline** : Les métadonnées (dates d'échéance, numéros de facture, types de clients) sont présentées en texte clair avec séparateurs discrets (`·` ou `/`), et non sous forme de pilules colorées superflues.

### B. Parcours Utilisateur Clés
1. **Dashboard & Cockpit Trésorerie** :
   - Indicateurs financiers clés : Total facturé, En attente (créances saines), En retard (créances à risque), Encaissé ce mois.
   - Filtres interactifs par statut (`Toutes`, `En attente`, `En retard`, `Payées`).
   - Accès rapide : Créer une facture, Scanner un reçu/devis par IA, Déclencher les relances du jour.
2. **Création & Gestion des Factures** :
   - Émetteur (profil entreprise de l'utilisateur, IFU/RCCM Bénin, logo, coordonnées).
   - Client (sélection ou création rapide avec numéro WhatsApp international +229, +225, etc.).
   - Lignes de prestation détaillées (description, quantité, prix unitaire en FCFA, remise éventuelle).
   - Mode IA OCR : Déposer une photo ou capture d'un devis/facture papier pour pré-remplir le formulaire en 2 secondes.
   - Génération et aperçu PDF imprimable / partageable.
3. **Moteur & Timeline de Relances WhatsApp** :
   - Visualisation de la séquence pour chaque facture :
     - **J-2** (Rappel de courtoisie)
     - **J0** (Jour J – Avis d'échéance)
     - **J+3** (Relance de retard – Appel au règlement)
     - **J+7** (Mise en demeure cordiale mais ferme)
   - Prévisualisation du message formaté pour WhatsApp avec lien direct de paiement.
   - Bouton d'action directe « Ouvrir dans WhatsApp » (`https://wa.me/{tel}?text={message}`).
   - Bouton « Optimiser le ton avec l'IA » pour adapter la politesse selon le profil du client (client VIP, partenaire historique, mauvais payeur récurrent).
   - Journal d'historique des relances (horodatage, canal, statut).
4. **Passerelle de Paiement FedaPay & Mobile Money** :
   - Lien de paiement unique par facture (`/pay/:invoiceId`).
   - Page de règlement publique sécurisée : Choix de l'opérateur (MTN Mobile Money, Moov Money, Wave, Carte bancaire).
   - Simulation réaliste du débit push USSD et de la validation webhook instantanée.
   - Arrêt automatique immédiat de toutes les relances dès encaissement confirmé.
5. **Gestion du Fichier Clients & Carnet d'Adresses** :
   - Fiche client avec historique des règlements, délai moyen de paiement, solde débiteur et canal préféré.

---

## 3. Key Product Decisions & Trade-Offs

### Décision 1 : Stockage et Persistance des Données
- **Approche retenue** : Stockage persistant structuré avec `localStorage` synchronisé et initialisation avec des données de démonstration réalistes pour les PME d'Afrique de l'Ouest (Cotonou, Abidjan, Dakar).
- **Raison** : Permet une utilisation immédiate sans barrière d'authentification bloquante tout en assurant la persistance locale de toutes les factures, clients, paramètres d'entreprise et historiques de relance créés par l'utilisateur.

### Décision 2 : Intégration WhatsApp et API de Messagerie
- **Approche retenue** : Double mécanisme :
  1. Génération de liens universels d'envoi WhatsApp (`https://wa.me/PHONE?text=MESSAGE`) permettant un envoi direct instantané depuis le smartphone ou WhatsApp Web sans surcoût d'API.
  2. Simulateur de tâche planifiée (automatisation quotidienne 08h00 WAT) consignant les envois automatiques dans un journal d'activité d'entreprise.
- **Raison** : Les PME locales préfèrent souvent vérifier ou envoyer personnellement depuis leur propre compte WhatsApp pour préserver la confiance humaine, tout en bénéficiant de l'automatisation des calculs et dates.

### Décision 3 : Architecture IA Multimodale Serveur-Side
- **Approche retenue** : Route API backend Express `/api/gemini/extract-invoice` et `/api/gemini/tune-tone` utilisant le SDK `@google/genai` et le modèle standard `gemini-3.8-flash`.
- **Raison** : Sécurité maximale des clés API (aucune fuite côté navigateur) et extraction multimodale robuste d'images de reçus.

---

## 4. Technical Architecture & Data Strategy

### Diagramme d'Architecture Système

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FACTURA FRONTEND (React 19)                     │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │   Navigation & Tabs   │  │        KPI & Cockpit Trésorerie      │  │
│  │  (Factures, Clients,  │  │  - Encaissé / En cours / En retard   │  │
│  │   Relances, Réglages) │  │  - Filtres & Recherche temps réel    │  │
│  └───────────┬───────────┘  └──────────────────┬───────────────────┘  │
│              │                                 │                      │
│  ┌───────────▼─────────────────────────────────▼───────────────────┐  │
│  │                        Core Workspaces                          │  │
│  │  ┌───────────────────────┐     ┌─────────────────────────────┐  │  │
│  │  │ Facture Builder & PDF │     │  WhatsApp Reminder Engine   │  │  │
│  │  │ - Articles, TVA, AIB  │     │  - Timeline J-2, J0, J3, J7 │  │  │
│  │  │ - Client Auto-suggest │     │  - WhatsApp link generator  │  │  │
│  │  └───────────┬───────────┘     └─────────────┬───────────────┘  │  │
│  │              │                               │                  │  │
│  │  ┌───────────▼───────────┐     ┌─────────────▼───────────────┐  │  │
│  │  │ AI Invoice OCR Dialog │     │ Public Payment Portal Modal │  │  │
│  │  │ - Scan photo / reçu   │     │ - FedaPay / MoMo simulation │  │  │
│  │  └───────────┬───────────┘     └─────────────┬───────────────┘  │  │
│  └──────────────┼───────────────────────────────┼──────────────────┘  │
│                 │                               │                     │
│  ┌──────────────▼───────────────────────────────▼──────────────────┐  │
│  │      State Management & Local Storage Store (factura-db-v1)     │  │
│  └──────────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │
                                  ▼ API Requests (/api/*)
┌────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND PROXY (Node.js)                   │
│                                                                        │
│   POST /api/gemini/ocr-invoice  ───► GoogleGenAI (gemini-3.8-flash)    │
│   POST /api/gemini/tone-tune    ───► GoogleGenAI (gemini-3.8-flash)    │
│   POST /api/webhooks/fedapay    ───► Payment settlement status trigger │
└────────────────────────────────────────────────────────────────────────┘
```

### Modèle de Données Principal

```typescript
export interface CompanyProfile {
  name: string;
  ifu: string; // Numéro d'Identifiant Fiscal Unique (Bénin)
  rccm: string; // Registre de Commerce
  address: string;
  phone: string;
  email: string;
  currency: 'XOF';
  paymentDetails: {
    momoNumber: string;
    momoNetwork: 'MTN' | 'Moov' | 'Orange' | 'Wave';
    bankRib?: string;
  };
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  phone: string; // Numéro WhatsApp avec indicatif (+229...)
  email: string;
  address: string;
  notes?: string;
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
  number: string; // ex: FACT-2026-004
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // TVA (ex: 18% UEMOA) ou 0%
  aibRate: number; // AIB Bénin (1% ou 5%)
  totalAmount: number;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface ReminderStep {
  stage: 'J-2' | 'J0' | 'J+3' | 'J+7';
  targetDate: string;
  status: 'scheduled' | 'sent' | 'skipped' | 'cancelled';
  sentAt?: string;
  channel: 'whatsapp' | 'sms' | 'email';
  tone: 'courteous' | 'standard' | 'firm' | 'urgent';
  messageText: string;
}
```

---

## 5. Plan d'Exécution & Étapes Pratiques

1. **Backend Express & Services IA** : Configuration d'Express pour servir les routes API `/api/gemini/ocr-invoice` et `/api/gemini/tone-tune` avec validation des schémas JSON et gestion d'erreurs robuste.
2. **Design System & En-tête / Navigation Top Bar** : Implémentation du Top Bar Contract conforme à la constitution (Marque unifiée `Factura`, 4 liens de navigation clairs, bouton d'action primaire « Nouvelle Facture »).
3. **Tableau de Bord & Cockpit Financier** : Cartes métriques financières en FCFA avec chiffres tabulaires, indicateurs de santé du recouvrement et filtres de recherche.
4. **Générateur & Éditeur de Factures** : Formulaire fluide avec calculs automatiques (HT, TVA 18%, AIB, Total TTC en FCFA), prévisualisation document, impression et partage PDF.
5. **Scanner Intelligent OCR Reçu/Facture** : Modal d'import de photo avec traitement par Gemini pour pré-remplir la facture en un clic.
6. **Moteur de Relance WhatsApp Automatique** : Timeline visuelle étape par étape (J-2, J0, J+3, J+7), générateur de lien WhatsApp direct, simulateur d'envoi et réglage de ton IA.
7. **Simulateur de Paiement Public FedaPay / Mobile Money** : Interface de règlement pour le client débiteur avec confirmation instantanée et clôture de relance.
8. **Carnet de Clients & Paramètres d'Entreprise** : Gestion des coordonnées, préférences de paiement et identifiants fiscaux régionaux.
9. **Validation & Compilation** : Audit avec `compile_applet` pour garantir 100% de fiabilité technique.
