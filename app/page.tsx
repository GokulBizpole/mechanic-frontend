'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wind, Box, Waves, Tv, Shield, Clock, Star, Award, ArrowRight, Phone, CheckCircle, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getServices } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import type { Service } from '@/types';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((d: unknown) => setServices(d as Service[])).catch(() => {});
  }, []);

  const stats = [
    { value: '14+', label: t.stats.experience },
    { value: '5000+', label: t.stats.customers },
    { value: '6', label: t.stats.cities },
    { value: '20+', label: t.stats.certified },
  ];

  const whyUs = [
    { Icon: Award, title: t.whyUs.certified, desc: t.whyUs.certifiedDesc, color: 'text-blue-600 bg-blue-100' },
    { Icon: Clock, title: t.whyUs.fast, desc: t.whyUs.fastDesc, color: 'text-orange-600 bg-orange-100' },
    { Icon: Shield, title: t.whyUs.warranty, desc: t.whyUs.warrantyDesc, color: 'text-green-600 bg-green-100' },
    { Icon: Star, title: t.whyUs.affordable, desc: t.whyUs.affordableDesc, color: 'text-purple-600 bg-purple-100' },
  ];

  const steps = [
    { n: '01', title: t.howItWorks.step1, desc: t.howItWorks.step1Desc },
    { n: '02', title: t.howItWorks.step2, desc: t.howItWorks.step2Desc },
    { n: '03', title: t.howItWorks.step3, desc: t.howItWorks.step3Desc },
    { n: '04', title: t.howItWorks.step4, desc: t.howItWorks.step4Desc },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-700/60 border border-primary-600 rounded-full px-4 py-2 text-sm mb-6">
              <CheckCircle className="w-4 h-4 text-accent-400" />
              <span className="text-blue-200">{t.hero.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl text-blue-200 mb-10 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary text-base px-8 py-4">
                <Wrench className="w-5 h-5" />
                {t.hero.bookNow}
              </Link>
              <Link href="/booking/status" className="btn-secondary text-base px-8 py-4">
                {t.hero.trackBooking}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-accent-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-orange-100 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-subtitle">{t.services.subtitle}</p>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name_en: t.services.ac, name_ta: t.services.ac, description_en: 'Complete AC service and repair', description_ta: '', price_from: 500, price_to: 3000, icon: 'wind', id: 1, is_active: true, created_at: '' },
                { name_en: t.services.fridge, name_ta: t.services.fridge, description_en: 'All fridge repairs', description_ta: '', price_from: 400, price_to: 2500, icon: 'box', id: 2, is_active: true, created_at: '' },
                { name_en: t.services.washer, name_ta: t.services.washer, description_en: 'Washing machine service', description_ta: '', price_from: 350, price_to: 2000, icon: 'waves', id: 3, is_active: true, created_at: '' },
                { name_en: t.services.tv, name_ta: t.services.tv, description_en: 'TV repair all brands', description_ta: '', price_from: 300, price_to: 2500, icon: 'tv', id: 4, is_active: true, created_at: '' },
              ].map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/services" className="btn-outline">
              {lang === 'ta' ? 'அனைத்து சேவைகளையும் பார்க்க' : 'View All Services'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">{t.whyUs.title}</h2>
          <p className="section-subtitle">{t.whyUs.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(({ Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">{t.howItWorks.title}</h2>
          <p className="section-subtitle">{t.howItWorks.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="relative">
                <div className="text-6xl font-extrabold text-primary-100 mb-2">{n}</div>
                <h3 className="font-bold text-primary-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-800 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            {lang === 'ta' ? 'இப்போதே சேவை பதிவு செய்யுங்கள்!' : 'Ready to Fix Your Appliance?'}
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            {lang === 'ta' ? 'விரைவான, நம்பகமான சேவைக்கு இப்போதே அழைக்கவும்' : 'Get same-day service from our certified technicians'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/booking" className="btn-primary text-base px-8 py-4">
              <Wrench className="w-5 h-5" />
              {t.hero.bookNow}
            </Link>
            <a href="tel:+919999999999" className="btn-secondary text-base px-8 py-4">
              <Phone className="w-5 h-5" />
              {lang === 'ta' ? 'இப்போது அழைக்கவும்' : 'Call Now'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
