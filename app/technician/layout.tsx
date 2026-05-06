'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { CalendarCheck, LogOut, Wrench, Menu, X } from 'lucide-react';
import { getUser, clearAuth, isTechnician } from '@/lib/auth';
import clsx from 'clsx';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    if (!isTechnician()) { router.replace('/admin/login'); return; }
    setUser(getUser());
    setReady(true);
  }, [router]);

  const handleLogout = () => { clearAuth(); router.push('/admin/login'); };
  if (!ready) return null;

  const navItems = [{ href: '/technician/dashboard', icon: CalendarCheck, label: 'My Bookings' }];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">A S SERVICE</p>
            <p className="text-blue-300 text-xs">Technician Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
            className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
              pathname.startsWith(href) ? 'bg-accent-500 text-white' : 'text-blue-200 hover:bg-primary-700 hover:text-white'
            )}>
            <Icon className="w-5 h-5" /> {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700">
        <div className="px-4 mb-4">
          <p className="text-blue-200 text-sm font-medium">{user?.name}</p>
          <p className="text-blue-400 text-xs capitalize">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-900/30 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex w-64 bg-primary-900 flex-col shrink-0 fixed h-full">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-primary-900 flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} className="text-white"><X className="w-6 h-6" /></button>
            </div>
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-gray-700">My Dashboard</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
