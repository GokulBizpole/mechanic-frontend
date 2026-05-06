'use client';
import Link from 'next/link';
import { Wind, Box, Waves, Tv, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { Service } from '@/types';

const ICONS: Record<string, React.ElementType> = { wind: Wind, box: Box, waves: Waves, tv: Tv };
const COLORS: Record<string, string> = {
  wind: 'bg-blue-100 text-blue-600',
  box: 'bg-cyan-100 text-cyan-600',
  waves: 'bg-indigo-100 text-indigo-600',
  tv: 'bg-purple-100 text-purple-600',
};

interface Props {
  service: Service;
  showFullDesc?: boolean;
}

export default function ServiceCard({ service, showFullDesc }: Props) {
  const { lang, t } = useLanguage();
  const Icon = ICONS[service.icon] || Wind;
  const color = COLORS[service.icon] || 'bg-gray-100 text-gray-600';
  const name = lang === 'ta' ? service.name_ta : service.name_en;
  const desc = lang === 'ta' ? service.description_ta : service.description_en;

  return (
    <div className="card p-6 flex flex-col gap-4 group">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
        <p className={`text-gray-500 text-sm leading-relaxed ${showFullDesc ? '' : 'line-clamp-2'}`}>{desc}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400">{t.services.from}</span>
          <span className="text-accent-600 font-bold text-lg ml-1">
            {service.price_from?.toLocaleString()} – ₹{service.price_to?.toLocaleString()}
          </span>
        </div>
        <Link
          href={`/booking?service=${service.id}`}
          className="flex items-center gap-1 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {t.services.bookNow}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
