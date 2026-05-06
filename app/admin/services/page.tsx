'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getAdminServices, createService, updateService, deleteService } from '@/lib/api';
import type { Service } from '@/types';
import clsx from 'clsx';

const BLANK = { name_en: '', name_ta: '', description_en: '', description_ta: '', price_from: '', price_to: '', icon: 'wind', is_active: true };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<typeof BLANK & { id?: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getAdminServices().then((d: unknown) => setServices(d as Service[])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ ...BLANK });
  const openEdit = (s: Service) => setModal({ id: s.id, name_en: s.name_en, name_ta: s.name_ta, description_en: s.description_en || '', description_ta: s.description_ta || '', price_from: String(s.price_from), price_to: String(s.price_to), icon: s.icon, is_active: s.is_active });

  const save = async () => {
    if (!modal) return;
    if (!modal.name_en || !modal.name_ta) { setError('English and Tamil names are required'); return; }
    setSaving(true); setError('');
    try {
      const body = { ...modal, price_from: parseFloat(modal.price_from as string), price_to: parseFloat(modal.price_to as string) };
      if (modal.id) await updateService(modal.id, body);
      else await createService(body);
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Deactivate this service?')) return;
    await deleteService(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Services Management</h2>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Service Name (EN)</th>
                <th className="px-6 py-3 text-left">Name (Tamil)</th>
                <th className="px-6 py-3 text-left">Price Range</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{s.name_en}</td>
                  <td className="px-6 py-4 text-gray-600">{s.name_ta}</td>
                  <td className="px-6 py-4 text-gray-600">₹{s.price_from} – ₹{s.price_to}</td>
                  <td className="px-6 py-4">
                    <span className={clsx('status-badge', s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => remove(s.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">{modal.id ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'name_en', label: 'Service Name (English) *' },
                { key: 'name_ta', label: 'Service Name (Tamil) *' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={(modal as Record<string, unknown>)[key] as string} onChange={e => setModal(m => m ? { ...m, [key]: e.target.value } : null)} className="input-field text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea rows={2} value={modal.description_en} onChange={e => setModal(m => m ? { ...m, description_en: e.target.value } : null)} className="input-field resize-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil)</label>
                <textarea rows={2} value={modal.description_ta} onChange={e => setModal(m => m ? { ...m, description_ta: e.target.value } : null)} className="input-field resize-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price From (₹)</label>
                  <input type="number" value={modal.price_from} onChange={e => setModal(m => m ? { ...m, price_from: e.target.value } : null)} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price To (₹)</label>
                  <input type="number" value={modal.price_to} onChange={e => setModal(m => m ? { ...m, price_to: e.target.value } : null)} className="input-field text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select value={modal.icon} onChange={e => setModal(m => m ? { ...m, icon: e.target.value } : null)} className="input-field text-sm">
                    <option value="wind">AC (wind)</option>
                    <option value="box">Fridge (box)</option>
                    <option value="waves">Washer (waves)</option>
                    <option value="tv">TV (tv)</option>
                  </select>
                </div>
                {modal.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={String(modal.is_active)} onChange={e => setModal(m => m ? { ...m, is_active: e.target.value === 'true' } : null)} className="input-field text-sm">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 btn-primary justify-center py-2">
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
