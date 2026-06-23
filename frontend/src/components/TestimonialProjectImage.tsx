import React, { useState, useEffect } from 'react';

interface TestimonialProjectImageProps {
  company: string;
  fallbackImage: string;
}

export function TestimonialProjectImage({ company, fallbackImage }: TestimonialProjectImageProps) {
  const [customSrc, setCustomSrc] = useState<string | null>(null);
  const name = company.toUpperCase();

  // Determine standard keys and paths for local storage integration
  let storageKey = '';
  let defaultLocalPath = '';

  if (name.includes('H-THERM')) {
    storageKey = 'portfolio_h_therm';
    defaultLocalPath = '/images/h_therm.svg';
  } else if (name.includes('HAGEX')) {
    storageKey = 'portfolio_hagex';
    defaultLocalPath = '/images/hagex.svg';
  } else if (name.includes('SEMPACH') || name.includes('AUTO STATION')) {
    storageKey = 'portfolio_auto_station_sempach';
    defaultLocalPath = '/images/auto_station_sempach.svg';
  }

  useEffect(() => {
    if (!storageKey) return;
    
    // Initial fetch of uploaded image from client state
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setCustomSrc(stored);
    }

    // Listener for instant updating across the workspace on user image uploads
    const handleStorageChange = () => {
      const updated = localStorage.getItem(storageKey);
      setCustomSrc(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolio-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolio-update', handleStorageChange);
    };
  }, [storageKey]);

  // Priority queue: 
  // 1st: User interactive uploaded photo (Base64 in local state)
  // 2nd: The fallbackImage (which now contains real project photos)
  const imgSrc = customSrc || fallbackImage;

  return (
    <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-lg border border-black/10 bg-brand-surface group shadow-sm">
      <img 
        src={imgSrc} 
        alt={`Referenzprojekt für ${company}`} 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Visual Indicator of a Verified Reference Work */}
      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded border border-white/5 pointer-events-none">
        Kunden-Referenz
      </div>
    </div>
  );
}
