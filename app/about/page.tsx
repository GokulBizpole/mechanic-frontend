'use client';
import Link from 'next/link';
import { Shield, Award, Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function AboutPage() {
  const { t, lang } = useLanguage();

  const values = [
    { icon: Shield, label: lang === 'ta' ? 'நேர்மை' : 'Integrity', desc: lang === 'ta' ? 'வெளிப்படையான விலை, மறைமுக கட்டணம் இல்லை' : 'Transparent pricing, no hidden charges' },
    { icon: Award, label: lang === 'ta' ? 'தரம்' : 'Quality', desc: lang === 'ta' ? 'அனைத்து பழுதிலும் சிறந்த தரம்' : 'Best quality in every repair we do' },
    { icon: Users, label: lang === 'ta' ? 'வாடிக்கையாளர் முதல்' : 'Customer First', desc: lang === 'ta' ? 'உங்கள் திருப்தியே எங்கள் முன்னுரிமை' : 'Your satisfaction is our top priority' },
    { icon: CheckCircle, label: lang === 'ta' ? 'நம்பகத்தன்மை' : 'Reliability', desc: lang === 'ta' ? 'சரியான நேரத்தில் சரியான சேவை' : 'Right service at the right time' },
  ];

  const team = [
    { name: 'Arumugam S.', role: lang === 'ta' ? 'நிறுவனர் & முதன்மை தொழில்நுட்பவியலாளர்' : 'Founder & Lead Technician', exp: '20+ yrs', spec: 'AC & Refrigerator' },
    { name: 'Selvam K.', role: lang === 'ta' ? 'மூத்த தொழில்நுட்பவியலாளர்' : 'Senior Technician', exp: '12+ yrs', spec: 'Washing Machine' },
    { name: 'Rajan M.', role: lang === 'ta' ? 'தொழில்நுட்பவியலாளர்' : 'Technician', exp: '8+ yrs', spec: 'TV & Electronics' },
    { name: 'Murugan P.', role: lang === 'ta' ? 'தொழில்நுட்பவியலாளர்' : 'Technician', exp: '6+ yrs', spec: 'All Appliances' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">{t.about.title}</h1>
          <p className="text-blue-200 text-lg">{t.about.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">{t.about.story}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{t.about.storyText}</p>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">{t.about.mission}</h2>
              <p className="text-gray-600 leading-relaxed">{t.about.missionText}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ n: '14+', l: lang === 'ta' ? 'வருட அனுபவம்' : 'Years Experience' }, { n: '5000+', l: lang === 'ta' ? 'வாடிக்கையாளர்கள்' : 'Happy Customers' }, { n: '20+', l: lang === 'ta' ? 'தொழில்நுட்பவியலாளர்கள்' : 'Expert Technicians' }, { n: '99%', l: lang === 'ta' ? 'திருப்தி விகிதம்' : 'Satisfaction Rate' }].map(s => (
                <div key={s.l} className="bg-primary-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-extrabold text-primary-800 mb-1">{s.n}</div>
                  <div className="text-gray-500 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">{t.about.values}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {values.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{label}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">{t.about.team}</h2>
          <p className="section-subtitle">{t.about.teamText}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.name} className="card p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {m.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-800">{m.name}</h3>
                <p className="text-primary-600 text-sm mb-2">{m.role}</p>
                <p className="text-gray-400 text-xs">{m.exp} • {m.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-primary-800">{t.about.serviceAreas}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {t.about.serviceAreaList.map(a => (
                  <span key={a} className="bg-primary-50 text-primary-700 border border-primary-200 px-4 py-2 rounded-full text-sm font-medium">{a}</span>
                ))}
              </div>
            </div>
            <div className="bg-primary-800 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                {lang === 'ta' ? 'சேவை பதிவு செய்ய தயாரா?' : 'Ready to Book a Service?'}
              </h3>
              <p className="text-blue-200 mb-6">
                {lang === 'ta' ? 'இப்போதே பதிவு செய்யுங்கள் - விரைவான சேவை உத்தரவாதம்' : 'Book now and get same-day service guaranteed'}
              </p>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                {lang === 'ta' ? 'இப்போது பதிவு செய்க' : 'Book a Service'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
