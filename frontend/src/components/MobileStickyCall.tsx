import { Phone } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function MobileStickyCall() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-brand-surface border-t border-black/10 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <a 
        href="tel:+41764337795"
        className="w-full flex items-center justify-center gap-2 bg-brand-text text-white py-3.5 px-6 rounded font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all"
      >
        <Phone size={18} />
        {isEn ? 'Call Now' : 'Jetzt Anrufen'}
      </a>
    </div>
  );
}
