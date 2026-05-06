'use client';
import { useEffect, useState } from 'react';
import { MapPin, Phone, CalendarDays, Clock, CheckCircle, X } from 'lucide-react';
import { getTechnicianBookings, completeBooking } from '@/lib/api';
import type { Booking } from '@/types';
import clsx from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
};

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [completeModal, setCompleteModal] = useState<{ booking: Booking; note: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getTechnicianBookings().then((d: unknown) => setBookings(d as Booking[])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const markComplete = async () => {
    if (!completeModal) return;
    setSaving(true);
    try {
      await completeBooking(completeModal.booking.id, completeModal.note);
      setCompleteModal(null);
      load();
    } finally { setSaving(false); }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.preferred_date.startsWith(today));
  const upcoming = bookings.filter(b => !b.preferred_date.startsWith(today));

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-primary-700 font-bold text-sm">{booking.booking_number}</p>
          <h3 className="font-bold text-gray-800 text-lg mt-1">{booking.customer_name}</h3>
          <p className="text-primary-600 font-medium text-sm">{booking.service_name}</p>
          {booking.appliance_brand && <p className="text-gray-400 text-xs">{booking.appliance_brand}</p>}
        </div>
        <span className={clsx('status-badge', STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700')}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-primary-500 shrink-0" />
          <a href={`tel:${booking.customer_phone}`} className="hover:text-primary-700 font-medium">
            {booking.customer_phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="w-4 h-4 text-primary-500 shrink-0" />
          <span>{new Date(booking.preferred_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
          <Clock className="w-4 h-4 text-primary-500 shrink-0" />
          <span>{booking.preferred_time_slot}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600 sm:col-span-2">
          <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
          <span>{booking.customer_address}</span>
        </div>
      </div>

      {booking.issue_description && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
          <span className="font-medium">Issue: </span>{booking.issue_description}
        </div>
      )}

      <div className="flex gap-3">
        <a
          href={`tel:${booking.customer_phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 rounded-lg text-sm transition-colors"
        >
          <Phone className="w-4 h-4" /> Call Customer
        </a>
        <button
          onClick={() => setCompleteModal({ booking, note: '' })}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          <CheckCircle className="w-4 h-4" /> Mark Complete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-48" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assigned Bookings</h3>
          <p className="text-gray-400">You have no assigned bookings at the moment.</p>
        </div>
      ) : (
        <>
          {todayBookings.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-500 rounded-full inline-block" />
                Today's Bookings ({todayBookings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todayBookings.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full inline-block" />
                Upcoming Bookings ({upcoming.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </div>
          )}
        </>
      )}

      {completeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Mark as Completed</h3>
              <button onClick={() => setCompleteModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Confirm completion of booking <span className="font-semibold text-gray-700">{completeModal.booking.booking_number}</span> for {completeModal.booking.customer_name}?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Note (Optional)</label>
              <textarea
                rows={3}
                value={completeModal.note}
                onChange={e => setCompleteModal(m => m ? { ...m, note: e.target.value } : null)}
                className="input-field resize-none text-sm"
                placeholder="e.g. Replaced compressor, tested OK"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setCompleteModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={markComplete} disabled={saving} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Saving...' : 'Confirm Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
