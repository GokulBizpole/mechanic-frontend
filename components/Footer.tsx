'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/technician');
  if (isAdmin) return null;

  const PHONE = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91-9999999999';
  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

  return (
    /* bg-gray-900 = #111827 — kept dark per spec */
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                A S <span className="text-amber-500">SERVICE</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {lang === 'ta'
                ? 'தமிழ்நாட்டில் நம்பகமான வீட்டு உபகரண பழுது சேவை.'
                : 'Your trusted home appliance repair service in Tamil Nadu.'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-amber-500 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/services', label: t.nav.services },
                { href: '/booking', label: t.nav.booking },
                { href: '/booking/status', label: t.nav.status },
                { href: '/contact', label: t.nav.contact },
                { href: '/about', label: t.nav.about },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-amber-500 mb-4">
              {t.services.title}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t.services.ac}</li>
              <li>{t.services.fridge}</li>
              <li>{t.services.washer}</li>
              <li>{t.services.tv}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-amber-500 mb-4">
              {t.contact.title}
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${PHONE}`} className="hover:text-white transition-colors">{PHONE}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href={`https://wa.me/${WA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:info@asservice.com" className="hover:text-white transition-colors">
                  info@asservice.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{t.contact.companyAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} A S SERVICE. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-gray-300 text-xs transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
