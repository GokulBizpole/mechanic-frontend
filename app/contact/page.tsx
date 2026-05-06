'use client';
import { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const PHONE = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91-9999999999';
  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setSending(true); setError('');
    try {
      await submitContact(form);
      setSent(true);
      setForm({ name: '', phone: '', message: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setSending(false);
    }
  };

  const contacts = [
    { Icon: Phone, label: t.contact.phone, value: PHONE, href: `tel:${PHONE}`, color: 'bg-blue-100 text-blue-600' },
    { Icon: MessageCircle, label: t.contact.whatsapp, value: 'WhatsApp Chat', href: `https://wa.me/${WA}`, color: 'bg-green-100 text-green-600' },
    { Icon: Mail, label: t.contact.email, value: 'info@asservice.com', href: 'mailto:info@asservice.com', color: 'bg-orange-100 text-orange-600' },
    { Icon: MapPin, label: t.contact.address, value: t.contact.companyAddress, href: '#map', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t.contact.title}</h1>
          <p className="text-gray-500 text-lg">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.map(({ Icon, label, value, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="card p-5 flex items-start gap-4 hover:border-primary-200 hover:border-2 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                      <p className="font-semibold text-gray-800 text-sm">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">Service Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Monday – Saturday</span><span className="font-medium">9:00 AM – 7:00 PM</span></div>
                  <div className="flex justify-between text-gray-600"><span>Sunday</span><span className="font-medium text-accent-600">9:00 AM – 2:00 PM</span></div>
                </div>
              </div>

              <div id="map" className="card overflow-hidden rounded-xl h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125319.41556895!2d76.8856!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                />
              </div>
            </div>

            <div>
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-primary-800 mb-6">{t.contact.sendMessage}</h2>
                {sent ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-green-600 font-semibold text-lg">{t.contact.sent}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.name} *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.phoneField} *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.messageField} *</label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-field resize-none" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
                      <Send className="w-5 h-5" />
                      {sending ? t.contact.sending : t.contact.submit}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
