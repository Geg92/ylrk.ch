import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, MapPin } from 'lucide-react';
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

export function FloatingContact() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-40 sm:bottom-24 right-6 z-50 flex flex-col-reverse items-center gap-4">
      <motion.button
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-brand-surface border border-black/10 text-brand-text rounded-full shadow-lg hover:bg-black/10 transition-colors duration-300 relative z-10"
        aria-label="Kontaktoptionen"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 absolute bottom-[4.5rem]"
          >
            <motion.a
              href="https://maps.google.com/?q=Aaraustrasse+29,+5734+Reinach+AG"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="group relative flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              aria-label="Standort auf Google Maps"
            >
              <MapPin size={22} />
              <span className="absolute right-full mr-4 bg-brand-surface text-brand-text text-sm py-1.5 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-black/10 shadow-xl hidden md:block">
                {t('footer.location')}
              </span>
            </motion.a>

            <motion.a
              href="https://wa.me/41764337795?text=Hallo%20YLRK%2C%20ich%20h%C3%A4tte%20gerne%20eine%20Offerte%20f%C3%BCr..."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="group relative flex items-center justify-center w-12 h-12 bg-[#25D366] text-brand-text rounded-full shadow-[0_4px_12px_rgba(37,211,102,0.4)]"
              aria-label="Chat auf WhatsApp"
            >
              <WhatsappIcon size={24} className="translate-x-[1px] translate-y-[1px]" />
              <span className="absolute right-full mr-4 bg-brand-surface text-brand-text text-sm py-1.5 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-black/10 shadow-xl hidden md:block">
                WhatsApp
              </span>
            </motion.a>

            <motion.a
              href="https://www.instagram.com/beschriftungen.ylrk"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-brand-text rounded-full shadow-[0_4px_12px_rgba(220,39,67,0.4)]"
              aria-label="Folge uns auf Instagram"
            >
              <Instagram size={22} />
              <span className="absolute right-full mr-4 bg-brand-surface text-brand-text text-sm py-1.5 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-black/10 shadow-xl hidden md:block">
                Instagram
              </span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
