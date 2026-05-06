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
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-6 h-6 text-accent-400" />
              <span className="text-xl font-bold">A S <span className="text-accent-400">SERVICE</span></span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              {lang === 'ta'
                ? 'தமிழ்நாட்டில் நம்பகமான வீட்டு உபகரண பழுது சேவை.'
                : 'Your trusted home appliance repair service in Tamil Nadu.'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-accent-400">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/services', label: t.nav.services },
                { href: '/booking', label: t.nav.booking },
                { href: '/booking/status', label: t.nav.status },
                { href: '/contact', label: t.nav.contact },
                { href: '/about', label: t.nav.about },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-blue-200 hover:text-accent-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-accent-400">{t.services.title}</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>{t.services.ac}</li>
              <li>{t.services.fridge}</li>
              <li>{t.services.washer}</li>
              <li>{t.services.tv}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-accent-400">{t.contact.title}</h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <a href={`tel:${PHONE}`} className="hover:text-accent-400">{PHONE}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <a href="mailto:info@asservice.com" className="hover:text-accent-400">info@asservice.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span>{t.contact.companyAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-blue-300">
          <p>© {new Date().getFullYear()} A S SERVICE. All rights reserved.</p>
          <Link href="/admin/login" className="text-blue-400 hover:text-blue-200 text-xs">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
