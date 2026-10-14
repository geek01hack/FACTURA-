import React, { useState } from 'react';
import { Client, Invoice } from '../types';
import { formatFCFA } from '../utils/formatters';
import { Users, Plus, Phone, Mail, MapPin, MessageCircle, Edit2, Search } from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  invoices: Invoice[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  invoices,
  onAddClient,
  onUpdateClient,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [country, setCountry] = useState('Bénin');
  const [notes, setNotes] = useState('');

  const handleOpenAdd = () => {
    setEditingClient(null);
    setName('');
    setCompanyName('');
    setPhone('+229 ');
    setEmail('');
    setCity('Cotonou');
    setCountry('Bénin');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setCompanyName(client.companyName || '');
    setPhone(client.phone);
    setEmail(client.email);
    setCity(client.city);
    setCountry(client.country);
    setNotes(client.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingClient) {
      onUpdateClient(editingClient.id, {
        name,
        companyName,
        phone,
        email,
        city,
        country,
        notes,
      });
    } else {
      onAddClient({
        name,
        companyName,
        phone,
        email,
        city,
        country,
        notes,
      });
    }

    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Search & Add Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher client, entreprise, numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          // Calculate stats for this client
          const clientInvoices = invoices.filter((i) => i.clientId === client.id);
          const totalBilled = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
          const unpaid = clientInvoices
            .filter((i) => i.status !== 'paid')
            .reduce((sum, i) => sum + i.totalAmount, 0);

          const cleanPhone = client.phone.replace(/[^\d+]/g, '').replace('+', '');

          return (
            <div
              key={client.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {client.companyName || client.name}
                    </h3>
                    {client.companyName && (
                      <p className="text-xs text-slate-500 mt-0.5">Contact : {client.name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{client.city}, {client.country}</span>
                  </div>
                </div>

                {client.notes && (
                  <p className="mt-3 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{client.notes}"
                  </p>
                )}
              </div>

              {/* Financial stats and WhatsApp CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Encaissé
                    </span>
                    <span className="font-mono font-medium text-slate-700 tabular-nums">
                      {formatFCFA(totalBilled - unpaid)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Solde Dû
                    </span>
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        unpaid > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatFCFA(unpaid)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              {editingClient ? 'Modifier la fiche client' : 'Ajouter un nouveau client'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom du contact *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: M. Gatien Akpovi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Raison sociale / Entreprise</label>
                <input
                  type="text"
                  placeholder="Ex: SARL Moderne"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numéro WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="+229 97 00 12 34"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="client@entreprise.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pays</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Préférences</label>
                <textarea
                  rows={2}
                  placeholder="Habitudes de règlement, délai accordé..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  {editingClient ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
