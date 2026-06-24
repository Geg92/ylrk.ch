import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { useLanguage } from '../lib/LanguageContext';

export function Hero() {
  const { t, language } = useLanguage();

  const scrollToContact = () => {
    document.getElementById('offerte')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Graphic - abstract plotter effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden flex items-center justify-end">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="w-[800px] h-[800px] border-[1px] border-brand-cyan rounded-full absolute -right-40 -top-20"
        />
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
           className="w-[600px] h-[600px] border-[1px] border-brand-cyan rounded-full absolute -right-20 -top-10"
        />
        {/* Plotter line animation */}
        <motion.svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-30"
          viewBox="0 0 400 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M 400 0 C 100 200, 300 600, 0 800"
            stroke="#111111"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 bg-brand-surface border border-black/10 px-3 py-1.5 rounded-full mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-cyan text-brand-cyan" />
              ))}
            </div>
            <span className="text-xs font-medium text-brand-muted">
              {t('hero.trustBadge')}
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-6 uppercase">
            {t('hero.headingLine1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500">
              {t('hero.headingLine2')}
            </span><br />
            {t('hero.headingLine3')}
          </h1>
          
          <div className="text-lg sm:text-xl text-brand-muted mb-8 max-w-lg leading-relaxed h-[60px] sm:h-[84px]">
            {t('hero.professionell')}
            <TypewriterText 
              words={language === 'en' 
                ? ['Vehicle Wrapping', 'Signage Tech', 'Textile Print', 'Window Lettering'] 
                : ['Fahrzeugbeschriftung', 'Werbetechnik', 'Textildruck', 'Schaufensterbeschriftung']
              } 
            />
            <br />
            {t('hero.serviceSubtitle')}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={scrollToContact}
              className="bg-brand-cyan text-white px-8 py-4 rounded text-lg font-bold hover:opacity-80 transition-colors flex items-center justify-center uppercase tracking-wide group"
              data-testid="hero-quote-button"
            >
              {t('nav.offerte')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#leistungen"
              className="px-8 py-4 rounded text-lg font-bold border border-black/20 hover:bg-black/5 transition-colors flex items-center justify-center uppercase tracking-wide"
            >
              {t('hero.services')}
            </a>
          </div>
        </motion.div>

        {/* Hero Video Showcase (autoplay loop) */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           id="hero-video-showcase"
           className="relative h-[450px] lg:h-[580px] rounded-2xl overflow-hidden border border-black/10 bg-brand-surface shadow-lg hidden md:block group"
        >
          <div className="absolute inset-0 w-full h-full bg-[#111]">
            <video
              src="/videos/hero.mp4"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              data-testid="hero-video"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
