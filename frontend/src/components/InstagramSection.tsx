import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Heart, MessageCircle } from 'lucide-react';

const InstagramIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
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

// Pool of real YLRK project photos. The grid shows 4 at a time and rotates through all of them.
const POOL = [
  { src: '/images/ip3.jpg', likes: 241, comments: 31 },
  { src: '/images/hagex_photo.jpg', likes: 184, comments: 32 },
  { src: '/images/oda_suites.jpg', likes: 198, comments: 22 },
  { src: '/images/barberossa.jpg', likes: 156, comments: 19 },
  { src: '/images/livoreka.jpg', likes: 132, comments: 11 },
  { src: '/images/cleanax.jpg', likes: 203, comments: 27 },
  { src: '/images/auto_center_wolhusen.jpg', likes: 88, comments: 7 },
  { src: '/images/ek_isol.jpg', likes: 142, comments: 14 },
  { src: '/images/h_therm_photo.png', likes: 168, comments: 21 },
  { src: '/images/chollerstrasse_pylon.jpg', likes: 97, comments: 8 },
  { src: '/images/auto_station_sempach_photo.jpg', likes: 210, comments: 24 },
];

const VISIBLE = 4;
const INSTA_URL = 'https://www.instagram.com/beschriftungen.ylrk';

export function InstagramSection() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [start, setStart] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStart(prev => (prev + 1) % POOL.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const visiblePosts = Array.from({ length: VISIBLE }, (_, i) => POOL[(start + i) % POOL.length]);

  return (
    <section id="instagram-feed" className="py-24 bg-brand-surface relative z-10 border-t border-black/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-bg mb-6 shadow-sm border border-black/5 text-brand-cyan"
          >
            <InstagramIcon size={32} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            {isEn ? (
              <>Follow <span className="text-brand-cyan">@beschriftungen.ylrk</span></>
            ) : (
              <>Folge <span className="text-brand-cyan">@beschriftungen.ylrk</span></>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted text-lg max-w-2xl mx-auto"
          >
            {isEn ? (
              <>Get daily insights into our workshop, fresh before-and-after pictures, and live updates of our latest wrapping projects.</>
            ) : (
              <>Erhalte tägliche Einblicke in unsere Werkstatt, frische Vorher-Nachher-Bilder und Live-Updates unserer neuesten Folierungs-Projekte.</>
            )}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {visiblePosts.map((post, i) => (
            <motion.a
              key={i}
              href={INSTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              data-testid={`instagram-tile-${i}`}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={post.src}
                  src={post.src}
                  alt="YLRK Beschriftungen Projekt"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Stats overlay on hover */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2 font-bold">
                  <Heart className="w-6 h-6 fill-current" />
                  <span className="text-lg">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <MessageCircle className="w-6 h-6 fill-current" />
                  <span className="text-lg">{post.comments}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-cyan hover:bg-brand-cyan/90 text-white px-8 py-4 rounded font-bold uppercase transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <InstagramIcon size={20} />
            {isEn ? 'View on Instagram' : 'Auf Instagram ansehen'}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
