'use client';
import { useEffect, useState, useCallback } from 'react';
import { Filter, Search, X, UserCheck } from 'lucide-react';
import { getAdminBookings, updateBookingStatus, assignTechnician, getAdminTechnicians } from '@/lib/api';
import type { Booking, BookingStatus, User } from '@/types';
import clsx from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
const ALL_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'assigned', 'completed', 'cancelled'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', date: '' });
  const [statusModal, setStatusModal] = useState<{ booking: Booking; status: string; notes: string } | null>(null);
  const [assignModal, setAssignModal] = useState<{ booking: Booking; techId: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      const res = await getAdminBookings(params) as { bookings: Booking[]; total: number };
      setBookings(res.bookings);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getAdminTechnicians().then((d: unknown) => setTechnicians((d as User[]).filter(t => t.is_active)));
  }, []);

  const saveStatus = async () => {
    if (!statusModal) return;
    setSaving(true);
    try {
      await updateBookingStatus(statusModal.booking.id, statusModal.status, statusModal.notes);
      setStatusModal(null);
      load();
    } finally { setSaving(false); }
  };

  const saveAssign = async () => {
    if (!assignModal || !assignModal.techId) return;
    setSaving(true);
    try {
      await assignTechnician(assignModal.booking.id, parseInt(assignModal.techId));
      setAssignModal(null);
      load();
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {(filters.status || filters.date) && (
          <button onClick={() => setFilters({ status: '', date: '' })} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400">{total} bookings</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Booking #</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Date / Time</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Technician</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-primary-700 font-semibold">{b.booking_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{b.customer_name}</div>
                      <div className="text-gray-400 text-xs">{b.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px]">
                      <div className="truncate">{b.service_name}</div>
                      {b.appliance_brand && <div className="text-gray-400 text-xs">{b.appliance_brand}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      <div>{new Date(b.preferred_date).toLocaleDateString('en-IN')}</div>
                      <div>{b.preferred_time_slot}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('status-badge', STATUS_COLORS[b.status])}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {b.technician_name || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStatusModal({ booking: b, status: b.status, notes: b.admin_notes || '' })}
                          className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Status
                        </button>
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            onClick={() => setAssignModal({ booking: b, techId: String(b.assigned_technician_id || '') })}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" /> Assign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Update Status</h3>
            <p className="text-sm text-gray-400 mb-5">{statusModal.booking.booking_number} • {statusModal.booking.customer_name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusModal(m => m ? { ...m, status: s } : null)}
                      className={clsx(
                        'py-2 px-3 rounded-lg text-xs font-semibold border-2 transition-all capitalize',
                        statusModal.status === s ? `${STATUS_COLORS[s]} border-current` : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={statusModal.notes}
                  onChange={e => setStatusModal(m => m ? { ...m, notes: e.target.value } : null)}
                  className="input-field resize-none text-sm"
                  placeholder="Add a note for this status change..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStatusModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveStatus} disabled={saving} className="flex-1 btn-primary justify-center py-2">
                {saving ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Assign Technician</h3>
            <p className="text-sm text-gray-400 mb-5">{assignModal.booking.booking_number} • {assignModal.booking.customer_name}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Technician</label>
              <select
                value={assignModal.techId}
                onChange={e => setAssignModal(m => m ? { ...m, techId: e.target.value } : null)}
                className="input-field"
              >
                <option value="">-- Select --</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.phone})</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAssignModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveAssign} disabled={saving || !assignModal.techId} className="flex-1 btn-primary justify-center py-2">
                {saving ? 'Saving...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
