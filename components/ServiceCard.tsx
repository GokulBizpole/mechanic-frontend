'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Wind, Box, Waves, Tv, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { Service } from '@/types';

const ICONS: Record<string, React.ElementType> = { wind: Wind, box: Box, waves: Waves, tv: Tv };

const IMAGES: Record<string, string> = {
  wind:  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  waves: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80',
  box:   'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80',
  tv:    'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&q=80',
};

interface Props {
  service: Service;
  showFullDesc?: boolean;
}

export default function ServiceCard({ service, showFullDesc }: Props) {
  const { lang, t } = useLanguage();
  const Icon  = ICONS[service.icon]  || Wind;
  const image = IMAGES[service.icon] || IMAGES.wind;
  const name  = lang === 'ta' ? service.name_ta : service.name_en;
  const desc  = lang === 'ta' ? service.description_ta : service.description_en;

  return (
    <div className="card overflow-hidden flex flex-col group">

      {/* ── Image section ── */}
      <div className="relative min-h-[160px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* gradient overlay – dark at bottom, transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* text content anchored to bottom of image */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* amber icon badge */}
          <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-2 shadow-lg">
            <Icon className="w-5 h-5" />
          </div>

          <h3 className="text-white font-bold text-base leading-tight drop-shadow">
            {name}
          </h3>

          <p className={`text-white/75 text-xs mt-1 leading-relaxed drop-shadow ${showFullDesc ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {desc}
          </p>
        </div>
      </div>

      {/* ── Price + CTA ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
        <div>
          <span className="text-xs text-gray-400">{t.services.from}</span>
          <span className="text-accent-600 font-bold text-base ml-1">
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
