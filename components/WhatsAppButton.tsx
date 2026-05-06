'use client';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/technician');
  if (isAdmin) return null;

  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const msg = encodeURIComponent('Hello! I need home appliance repair service.');

  return (
    <a
      href={`https://wa.me/${WA}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:inline text-sm font-semibold pr-1 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
