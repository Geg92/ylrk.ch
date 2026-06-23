import { motion } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Heart, MessageCircle, Camera, Trash2 } from 'lucide-react';
import { getStoredInstagramImage, saveStoredInstagramImage, deleteStoredInstagramImage } from '../lib/mediaDb';

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

const POSTS = [
  { id: 'insta-1', likes: 184, comments: 32, src: '/images/hagex_photo.jpg' },
  { id: 'insta-2', likes: 156, comments: 19, src: '/images/barberossa.jpg' },
  { id: 'insta-3', likes: 203, comments: 27, src: '/images/cleanax.jpg' },
  { id: 'insta-4', likes: 142, comments: 14, src: '/images/ek_isol.jpg' },
  { id: 'insta-5', likes: 168, comments: 21, src: '/images/h_therm_photo.png' },
  { id: 'insta-6', likes: 97, comments: 8, src: '/images/chollerstrasse_pylon.jpg' },
  { id: 'insta-7', likes: 210, comments: 24, src: '/images/auto_station_sempach_photo.jpg' },
];

export function InstagramSection() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  
  const [customMedias, setCustomMedias] = useState<Record<string, { url: string; isVideo: boolean }>>({});
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadCustomMedias() {
      const loaded: Record<string, { url: string; isVideo: boolean }> = {};
      for (const post of POSTS) {
        const blob = await getStoredInstagramImage(post.id);
        if (blob) {
          loaded[post.id] = {
            url: URL.createObjectURL(blob),
            isVideo: blob.type.startsWith('video/')
          };
        }
      }
      setCustomMedias(loaded);
    }
    loadCustomMedias();

    return () => {
      Object.values(customMedias).forEach((m: any) => {
        if (m && m.url) {
          URL.revokeObjectURL(m.url);
        }
      });
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadTargetId || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const isVideo = file.type.startsWith('video/');
    
    const success = await saveStoredInstagramImage(uploadTargetId, file);
    if (success) {
      if (customMedias[uploadTargetId]) {
        URL.revokeObjectURL(customMedias[uploadTargetId].url);
      }
      const url = URL.createObjectURL(file);
      setCustomMedias(prev => ({
        ...prev,
        [uploadTargetId]: { url, isVideo }
      }));
    } else {
      alert('Fehler beim Speichern.');
    }
    setUploadTargetId(null);
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await deleteStoredInstagramImage(id);
    if (success) {
      if (customMedias[id]) {
        URL.revokeObjectURL(customMedias[id].url);
      }
      setCustomMedias(prev => {
        const newMedias = { ...prev };
        delete newMedias[id];
        return newMedias;
      });
    }
  };

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
          {POSTS.map((post, i) => {
            const hasCustom = !!customMedias[post.id];
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {hasCustom ? (
                  customMedias[post.id].isVideo ? (
                    <video
                      src={customMedias[post.id].url}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={customMedias[post.id].url}
                      alt="Instagram post"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )
                ) : (
                  <img 
                    src={post.src} 
                    alt="Instagram post" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                
                {/* Stats Overlay on Hover */}
                <a 
                  href="https://www.instagram.com/beschriftungen.ylrk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Heart className="w-6 h-6 fill-current" />
                    <span className="text-lg">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <MessageCircle className="w-6 h-6 fill-current" />
                    <span className="text-lg">{post.comments}</span>
                  </div>
                </a>
                  
                {/* Always Visible Edit Controls */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setUploadTargetId(post.id);
                      fileInputRef.current?.click();
                    }}
                    className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors backdrop-blur-md shadow-lg border border-white/10"
                    title={isEn ? "Change media" : "Medium ändern"}
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                  {hasCustom && (
                    <button
                      onClick={(e) => handleRemoveImage(e, post.id)}
                      className="p-2.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors backdrop-blur-md shadow-lg border border-white/10"
                      title={isEn ? "Remove media" : "Medium entfernen"}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.instagram.com/beschriftungen.ylrk"
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
