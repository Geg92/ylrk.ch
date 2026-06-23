import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../lib/LanguageContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language: lang, setLanguage: setLang, t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById('offerte')?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-bg/90 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <Logo />
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#leistungen" className="text-sm font-medium hover:text-brand-cyan transition-colors">{t('nav.leistungen')}</a>
            <a href="#ablauf" className="text-sm font-medium hover:text-brand-cyan transition-colors">{t('nav.ablauf')}</a>
            <a href="#faq" className="text-sm font-medium hover:text-brand-cyan transition-colors">{t('nav.faq')}</a>
            <div className="flex items-center space-x-2 text-sm font-medium border-x border-black/20 px-4">
              <button 
                onClick={() => setLang('de')} 
                className={`transition-colors ${lang === 'de' ? 'text-brand-cyan' : 'text-brand-muted hover:text-brand-text'}`}
              >
                DE
              </button>
              <span className="text-brand-muted/50">/</span>
              <button 
                onClick={() => setLang('en')} 
                className={`transition-colors ${lang === 'en' ? 'text-brand-cyan' : 'text-brand-muted hover:text-brand-text'}`}
              >
                EN
              </button>
            </div>
            <button 
              onClick={scrollToContact}
              className="bg-brand-cyan text-white px-6 py-2.5 rounded hover:bg-brand-cyan/90 transition-colors font-medium text-sm flex items-center"
            >
              {t('nav.offerte')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-text p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-surface border-b border-black/10 px-4 pt-2 pb-6 space-y-4"
        >
          <div className="flex items-center space-x-4 pb-2 border-b border-black/10 mb-2">
            <span className="text-sm text-brand-muted uppercase tracking-wider">{t('nav.langLabel')}</span>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <button 
                onClick={() => { setLang('de'); setIsOpen(false); }} 
                className={`transition-colors ${lang === 'de' ? 'text-brand-cyan' : 'text-brand-muted hover:text-brand-text'}`}
              >
                DE
              </button>
              <span className="text-brand-muted/50">/</span>
              <button 
                onClick={() => { setLang('en'); setIsOpen(false); }} 
                className={`transition-colors ${lang === 'en' ? 'text-brand-cyan' : 'text-brand-muted hover:text-brand-text'}`}
              >
                EN
              </button>
            </div>
          </div>
          <a href="#leistungen" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-brand-cyan">{t('nav.leistungen')}</a>
          <a href="#ablauf" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-brand-cyan">{t('nav.ablauf')}</a>
          <a href="#faq" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-brand-cyan">{t('nav.faq')}</a>
          <button 
            onClick={scrollToContact}
            className="w-full bg-brand-cyan text-white px-6 py-3 rounded hover:bg-brand-cyan/90 transition-colors font-medium text-center"
          >
            {t('nav.offerte')}
          </button>
        </motion.div>
      )}
    </nav>
  );
}
