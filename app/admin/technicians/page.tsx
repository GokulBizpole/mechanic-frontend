'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, X, UserCheck, UserX } from 'lucide-react';
import { getAdminTechnicians, createTechnician, updateTechnician } from '@/lib/api';
import type { User } from '@/types';
import clsx from 'clsx';

const BLANK = { name: '', phone: '', email: '', password: '', is_active: true };

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<typeof BLANK & { id?: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getAdminTechnicians().then((d: unknown) => setTechnicians(d as User[])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ ...BLANK });
  const openEdit = (t: User) => setModal({ id: t.id, name: t.name, phone: t.phone, email: t.email || '', password: '', is_active: t.is_active });

  const save = async () => {
    if (!modal) return;
    if (!modal.name || !modal.phone) { setError('Name and phone are required'); return; }
    if (!modal.id && !modal.password) { setError('Password is required for new technician'); return; }
    setSaving(true); setError('');
    try {
      if (modal.id) {
        const body: Record<string, unknown> = { name: modal.name, phone: modal.phone, email: modal.email, is_active: modal.is_active };
        await updateTechnician(modal.id, body);
      } else {
        await createTechnician({ name: modal.name, phone: modal.phone, email: modal.email, password: modal.password });
      }
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Technicians Management</h2>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Technician
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : technicians.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No technicians yet. Add your first technician.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {technicians.map(tech => (
                <tr key={tech.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {tech.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{tech.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono">{tech.phone}</td>
                  <td className="px-6 py-4 text-gray-500">{tech.email || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={clsx('status-badge', tech.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                      {tech.is_active ? <><UserCheck className="w-3 h-3 inline mr-1" />Active</> : <><UserX className="w-3 h-3 inline mr-1" />Inactive</>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {tech.created_at ? new Date(tech.created_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEdit(tech)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">{modal.id ? 'Edit Technician' : 'Add Technician'}</h3>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input value={modal.name} onChange={e => setModal(m => m ? { ...m, name: e.target.value } : null)} className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" value={modal.phone} onChange={e => setModal(m => m ? { ...m, phone: e.target.value } : null)} className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input type="email" value={modal.email} onChange={e => setModal(m => m ? { ...m, email: e.target.value } : null)} className="input-field text-sm" />
              </div>
              {!modal.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input type="password" value={modal.password} onChange={e => setModal(m => m ? { ...m, password: e.target.value } : null)} className="input-field text-sm" />
                </div>
              )}
              {modal.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={String(modal.is_active)} onChange={e => setModal(m => m ? { ...m, is_active: e.target.value === 'true' } : null)} className="input-field text-sm">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 btn-primary justify-center py-2">
                {saving ? 'Saving...' : modal.id ? 'Update' : 'Add Technician'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
