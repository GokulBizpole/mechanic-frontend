'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, CalendarDays, Clock, User, MapPin, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getBookingStatus } from '@/lib/api';
import BookingTimeline from '@/components/BookingTimeline';
import type { Booking, BookingStatusLog } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function StatusTracker() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [logs, setLogs] = useState<BookingStatusLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (query) search(query);
  }, []);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setNotFound(false); setBooking(null);
    try {
      const res = await getBookingStatus(q.trim()) as { booking: Booking; statusLog: BookingStatusLog[] };
      setBooking(res.booking);
      setLogs(res.statusLog);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel: Record<string, string> = {
    pending: t.status.pending, confirmed: t.status.confirmed,
    assigned: t.status.assigned, completed: t.status.completed, cancelled: t.status.cancelled,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && search(input)}
            placeholder={t.status.placeholder}
            className="input-field flex-1 uppercase"
          />
          <button
            onClick={() => search(input)}
            disabled={loading}
            className="btn-primary px-6 whitespace-nowrap"
          >
            <Search className="w-5 h-5" />
            {t.status.search}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-400">{t.common.loading}</div>
      )}

      {notFound && (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500">{t.status.notFound}</p>
        </div>
      )}

      {booking && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{t.status.bookingDetails}</h3>
                <p className="text-primary-600 font-mono font-bold text-xl mt-1">{booking.booking_number}</p>
              </div>
              <span className={`status-badge text-sm ${STATUS_COLORS[booking.status]}`}>
                {statusLabel[booking.status]}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">{t.status.customer}</p>
                  <p className="font-semibold text-gray-800">{booking.customer_name}</p>
                  <p className="text-gray-500">{booking.customer_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Wrench className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">{t.status.service}</p>
                  <p className="font-semibold text-gray-800">
                    {lang === 'ta' ? booking.service_name_ta : booking.service_name_en}
                  </p>
                  {booking.appliance_brand && <p className="text-gray-500">{booking.appliance_brand}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CalendarDays className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">{t.status.date}</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(booking.preferred_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">{t.status.time}</p>
                  <p className="font-semibold text-gray-800">{booking.preferred_time_slot}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">{lang === 'ta' ? 'முகவரி' : 'Address'}</p>
                  <p className="font-semibold text-gray-800">{booking.customer_address}</p>
                </div>
              </div>
              {booking.technician_name && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg sm:col-span-2">
                  <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 text-xs">{t.status.technician}</p>
                    <p className="font-semibold text-gray-800">{booking.technician_name}</p>
                    <p className="text-gray-500">{booking.technician_phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">{t.status.statusTimeline}</h3>
            <BookingTimeline currentStatus={booking.status} logs={logs} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary-800">{t.status.title}</h1>
          <p className="text-gray-500 mt-2">{t.status.subtitle}</p>
        </div>
        <Suspense fallback={<div className="text-center py-8">{t.common.loading}</div>}>
          <StatusTracker />
        </Suspense>
      </div>
    </div>
  );
}
