'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import clsx from 'clsx';

export default function Navbar() {
  const { t, lang, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/services', label: t.nav.services },
    { href: '/booking', label: t.nav.booking },
    { href: '/booking/status', label: t.nav.status },
    { href: '/contact', label: t.nav.contact },
    { href: '/about', label: t.nav.about },
  ];

  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/technician');
  if (isAdmin) return null;

  return (
    <nav className="bg-primary-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Wrench className="w-6 h-6 text-accent-400" />
            <span>A S <span className="text-accent-400">SERVICE</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === l.href
                    ? 'bg-primary-700 text-white'
                    : 'text-blue-100 hover:bg-primary-700 hover:text-white'
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 bg-primary-700 hover:bg-primary-600 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
            >
              <span className={lang === 'en' ? 'text-accent-400' : 'text-blue-300'}>EN</span>
              <span className="text-blue-300">|</span>
              <span className={lang === 'ta' ? 'text-accent-400' : 'text-blue-300'}>தமிழ்</span>
            </button>
            <Link
              href="/booking"
              className="hidden sm:inline-flex bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {t.nav.booking}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md hover:bg-primary-700"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-primary-900 px-4 pb-4 pt-2 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={clsx(
                'block px-3 py-2 rounded-md text-sm font-medium',
                pathname === l.href ? 'bg-primary-700 text-white' : 'text-blue-100 hover:bg-primary-700'
              )}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={toggleLanguage}
            className="w-full text-left px-3 py-2 text-sm text-blue-100 hover:bg-primary-700 rounded-md"
          >
            {lang === 'en' ? '🇮🇳 Switch to தமிழ்' : '🇬🇧 Switch to English'}
          </button>
        </div>
      )}
    </nav>
  );
}
