import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'A S SERVICE - Home Appliance Repair', template: '%s | A S SERVICE' },
  description: 'Professional AC, Refrigerator, Washing Machine and TV repair services in Tamil Nadu. Fast, reliable and affordable.',
  keywords: ['AC repair', 'refrigerator repair', 'washing machine repair', 'TV repair', 'home appliance service', 'Coimbatore'],
  openGraph: {
    title: 'A S SERVICE - Expert Home Appliance Repair',
    description: 'Fast, reliable, and affordable home appliance repair services at your doorstep.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
