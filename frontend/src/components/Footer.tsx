import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../lib/LanguageContext';

const Instagram = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsappIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.1-.473-.15-.672.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.064-.3-.15-1.265-.461-2.406-1.474-.888-.788-1.487-1.761-1.663-2.061-.175-.3-.02-.461.131-.611.134-.131.3-.346.451-.521.151-.176.202-.296.301-.497.098-.195.051-.375-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51l-.573-.008c-.198 0-.521.074-.795.375-.274.301-1.045 1.02-1.045 2.485s1.073 2.88 1.222 3.08c.15.195 2.102 3.195 5.088 4.492 1.954.85 2.385.807 2.825.759.508-.056 1.767-.714 2.015-1.411.248-.696.248-1.291.173-1.411-.074-.118-.273-.195-.572-.345z" />
    <path d="M12 2a10 10 0 0 0-8.586 15.127l-1.396 4.195 4.316-1.129A10 10 0 1 0 12 2z" />
  </svg>
);

const CopyItem = ({ text, label }: { text: string, label: string }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const isEn = language === 'en';

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between group gap-2">
      <span className="flex-1">{label}</span>
      <button 
        onClick={handleCopy}
        className="text-xs flex items-center space-x-1 text-brand-muted hover:text-brand-cyan transition-colors"
        title={isEn ? `Copy ${label}` : `${label} kopieren`}
      >
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        <span>{copied ? (isEn ? "Copied" : "Kopiert") : (isEn ? "Copy" : "Kopieren")}</span>
      </button>
    </li>
  );
};

export function Footer() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  return (
    <footer className="bg-brand-surface pt-16 pb-8 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-8 mb-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-5">
            <div className="mb-4 transform scale-[0.8] origin-left">
              <Logo />
            </div>
            <p className="text-brand-muted max-w-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/beschriftungen.ylrk?igsh=MXVveXUzaWY5OHpsNg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-cyan transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://wa.me/41764337795?text=Hallo%20YLRK%2C%20ich%20h%C3%A4tte%20gerne%20eine%20Offerte%20f%C3%BCr..." 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-cyan transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsappIcon size={24} />
              </a>
            </div>
          </div>
          
          <div className="sm:col-span-1 md:col-span-4">
            <h4 className="font-display font-bold uppercase tracking-wider mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-brand-muted">
              <CopyItem label="Aaraustrasse 29, 5734 Reinach AG" text="Aaraustrasse 29, 5734 Reinach AG" />
              <CopyItem label="ylber.avdili@hotmail.com" text="ylber.avdili@hotmail.com" />
              <CopyItem label="076 433 77 95" text="+41764337795" />
            </ul>
          </div>
          
          <div className="sm:col-span-1 md:col-span-3">
            <h4 className="font-display font-bold uppercase tracking-wider mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-brand-muted">
              <li><a href="#leistungen" className="hover:text-brand-text transition-colors">Leistungen</a></li>
              <li><a href="#ablauf" className="hover:text-brand-text transition-colors">Ablauf</a></li>
              <li><a href="#faq" className="hover:text-brand-text transition-colors">FAQ</a></li>
              <li><a href="#offerte" className="hover:text-brand-text transition-colors">Offerte</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-muted gap-4">
          <p>&copy; {new Date().getFullYear()} YLRK Beschriftungen. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
