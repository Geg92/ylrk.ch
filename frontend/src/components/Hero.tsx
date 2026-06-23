import { motion } from 'motion/react';
import { ArrowRight, Star, Camera, Trash2 } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { getStoredHeroVideo, saveStoredHeroVideo, deleteStoredHeroVideo } from '../lib/mediaDb';

export function Hero() {
  const { t, language } = useLanguage();
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadStoredVideo() {
      const blob = await getStoredHeroVideo();
      if (blob) {
        setLocalVideoUrl(URL.createObjectURL(blob));
      }
    }
    loadStoredVideo();

    return () => {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
      }
    };
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    const success = await saveStoredHeroVideo(file);
    if (success) {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
      }
      setLocalVideoUrl(URL.createObjectURL(file));
    } else {
      alert('Fehler beim Speichern des Videos.');
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveVideo = async () => {
    const success = await deleteStoredHeroVideo();
    if (success) {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
      }
      setLocalVideoUrl(null);
    }
  };

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

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*"
          onChange={handleVideoUpload}
        />

        {/* Hero Asset Container (Interactive Video Player) */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           id="hero-video-showcase"
           className="relative h-[450px] lg:h-[580px] rounded-2xl overflow-hidden border border-black/10 bg-brand-surface shadow-lg hidden md:block group"
        >
          <div className="absolute inset-0 w-full h-full bg-[#111]">
            {localVideoUrl ? (
              <video
                src={localVideoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1646531840695-62810bcd1171?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
                  alt="Fahrzeugfolierung in Arbeit"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Overlay Controls */}
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10 flex justify-between items-start">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-[11px] font-mono text-white tracking-wider uppercase">{t('hero.preview')}</span>
              </div>
              
              {/* Upload / Edit Controls - Always visible */}
              <div className="flex flex-col gap-2 pointer-events-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors backdrop-blur-md shadow-lg border border-white/10"
                  title="Video ändern"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                {localVideoUrl && (
                  <button
                    onClick={handleRemoveVideo}
                    className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors backdrop-blur-md shadow-lg border border-white/10"
                    title="Video entfernen"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Bar Controls */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10">
              <div className="flex items-end justify-between pointer-events-none">
                <div className="flex flex-col text-white max-w-xs md:max-w-md drop-shadow-md">
                  <p className="text-sm font-bold tracking-tight uppercase mb-1">{t('hero.teslaWrap')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

