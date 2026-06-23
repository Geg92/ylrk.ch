import React, { useState, useEffect } from 'react';

export function Logo({ className = "" }: { className?: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('custom_logo');
    if (savedLogo) {
      setImgSrc(savedLogo);
    } else {
      setImgSrc("/logo.png");
    }
  }, []);

  return (
    <div className={`flex items-center ${className}`}>
      {imgSrc && !imgError ? (
        <a href="#home" title="YLRK Beschriftungen Startseite" className="relative inline-block">
          <img
            src={imgSrc}
            alt="YLRK Beschriftungen Logo"
            className="h-[44px] sm:h-[56px] w-auto object-contain select-none transition-transform duration-300 hover:scale-[1.02] drop-shadow-sm"
            style={{
              maxHeight: '64px',
            }}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        </a>
      ) : (
        <a href="#home" className="flex flex-col items-center justify-center h-[44px] sm:h-[56px] px-6 text-brand-text text-[10px] sm:text-xs text-center transition-transform duration-300 hover:scale-[1.02]">
          <span className="font-bold mb-0.5">YLRK</span>
        </a>
      )}
    </div>
  );
}




