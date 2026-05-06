'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { getServices } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import type { Service } from '@/types';
import { Wrench } from 'lucide-react';

export default function ServicesPage() {
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((d: unknown) => setServices(d as Service[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <Wrench className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t.services.title}</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.services.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-100 rounded mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map(s => <ServiceCard key={s.id} service={s} showFullDesc />)}
            </div>
          )}

          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-primary-800 mb-6">
              {lang === 'ta' ? 'அனைத்து பிராண்டுகளும் சேவை செய்யப்படுகின்றன' : 'All Major Brands Serviced'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {['LG', 'Samsung', 'Whirlpool', 'Voltas', 'Daikin', 'Godrej', 'IFB', 'Haier', 'Panasonic', 'Sony', 'OnePlus', 'TCL', 'Blue Star', 'Carrier', 'Hitachi'].map(b => (
                <span key={b} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
