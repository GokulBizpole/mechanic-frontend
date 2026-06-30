'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import clsx from 'clsx';
import Image from "next/image";

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
   <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
  <Image
    src="/AS-engneering.png"
    alt="AS Engineering logo"
    width={40}
    height={40}
    className="rounded-md object-cover w-10 h-10 shadow-sm"
  />
  <span>
    A S <span className="text-amber-500">SERVICE</span>
  </span>
</Link>


          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === l.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors text-gray-700"
            >
              <span className={lang === 'en' ? 'text-amber-600 font-bold' : 'text-gray-400'}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={lang === 'ta' ? 'text-amber-600 font-bold' : 'text-gray-400'}>தமிழ்</span>
            </button>
            <Link
              href="/booking"
              className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {t.nav.booking}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 pb-4 pt-2 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={clsx(
                'block px-3 py-2 rounded-md text-sm font-medium',
                pathname === l.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={toggleLanguage}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            {lang === 'en' ? '🇮🇳 Switch to தமிழ்' : '🇬🇧 Switch to English'}
          </button>
        </div>
      )}
    </nav>
  );
}
