'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Clock, CheckCircle, ArrowRight, TrendingUp, MessageSquare } from 'lucide-react';
import { getAdminStats } from '@/lib/api';
import type { AdminStats, Booking } from '@/types';
import clsx from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((d: unknown) => setStats(d as AdminStats))
      .finally(() => setLoading(false));
  }, []);

  const getCount = (status: string) => {
    const found = stats?.statusCounts.find(s => s.status === status);
    return found ? parseInt(found.count) : 0;
  };
  const total = stats?.statusCounts.reduce((sum, s) => sum + parseInt(s.count), 0) || 0;

  const cards = [
    { label: 'Total Bookings', value: total, icon: CalendarCheck, color: 'bg-primary-50 text-primary-600', border: 'border-primary-200' },
    { label: "Today's Bookings", value: stats?.todayCount || 0, icon: TrendingUp, color: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
    { label: 'Pending', value: getCount('pending'), icon: Clock, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200' },
    { label: 'Completed', value: getCount('completed'), icon: CheckCircle, color: 'bg-green-50 text-green-600', border: 'border-green-200' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
        <Link href="/admin/bookings" className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-1">
          View all bookings <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-xl p-6 border ${border} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {stats?.unreadMessages ? (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-orange-500 shrink-0" />
          <p className="text-orange-700 text-sm font-medium">
            You have {stats.unreadMessages} unread contact message{stats.unreadMessages > 1 ? 's' : ''}.
          </p>
        </div>
      ) : null}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Bookings</h3>
          <Link href="/admin/bookings" className="text-primary-600 text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Booking #</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentBookings.map((b: Booking) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-semibold text-primary-700">{b.booking_number}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{b.customer_name}</div>
                    <div className="text-gray-400 text-xs">{b.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.service_name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('status-badge', STATUS_COLORS[b.status])}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
