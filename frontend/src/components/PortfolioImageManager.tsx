import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, RefreshCw, HelpCircle, Image as ImageIcon } from 'lucide-react';

interface ProjectItem {
  id: string;
  key: string;
  title: string;
  description: string;
  defaultLocal: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'h_therm',
    key: 'portfolio_h_therm',
    title: 'H-THERM GmbH',
    description: 'Schaufensterbeschriftung (Echtglas-Dekor)',
    defaultLocal: '/images/h_therm.svg'
  },
  {
    id: 'hagex',
    key: 'portfolio_hagex',
    title: 'HAGEX HAUSHALTSGERÄTE',
    description: 'Fahrzeugbeschriftung (Flottenfolierung)',
    defaultLocal: '/images/hagex.svg'
  },
  {
    id: 'auto_station_sempach',
    key: 'portfolio_auto_station_sempach',
    title: 'Auto Station Sempach',
    description: 'Textildruck (Team-Polo-Shirts)',
    defaultLocal: '/images/auto_station_sempach.svg'
  }
];

export function PortfolioImageManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    // Load current states
    const currentImages: Record<string, string> = {};
    PROJECTS.forEach((proj) => {
      const val = localStorage.getItem(proj.key);
      if (val) {
        currentImages[proj.id] = val;
      }
    });
    setImages(currentImages);
  }, []);

  const handleFileChange = async (id: string, key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { compressImage } = await import('../lib/imageUtils');
      const base64 = await compressImage(file, 1200); // 1200px suitable for portfolio images
      localStorage.setItem(key, base64);
      setImages((prev) => ({ ...prev, [id]: base64 }));
      
      // Dispatch custom event to notify listeners immediately
      window.dispatchEvent(new Event('portfolio-update'));
    } catch {
      alert("Das Bild ist zu groß oder konnte nicht gespeichert werden.");
    }
  };

  const handleRemove = (id: string, key: string) => {
    localStorage.removeItem(key);
    setImages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    window.dispatchEvent(new Event('portfolio-update'));
  };

  const triggerInput = (id: string) => {
    fileInputs.current[id]?.click();
  };

  return (
    <div className="mt-12 bg-white rounded-xl border border-black/10 max-w-4xl mx-auto overflow-hidden shadow-sm">
      {/* Header tab to expand */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-black/5 hover:bg-black/10 transition-colors text-left"
        id="portfolio-manager-toggle"
      >
        <div className="flex items-center gap-3">
          <ImageIcon size={20} className="text-brand-cyan" />
          <div>
            <h4 className="text-sm font-sans font-black uppercase tracking-wider text-brand-text">
              Referenzfotos austauschen
            </h4>
            <p className="text-xs text-brand-muted font-light">
              Laden Sie Ihre eigenen Bilder hoch, um die voreingestellten Grafiken zu ersetzen.
            </p>
          </div>
        </div>
        <div className={`text-xs font-bold px-3 py-1.5 rounded-full border border-black/10 transition-colors uppercase select-none ${isOpen ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
          {isOpen ? 'Schliessen' : 'Verwalten'}
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-brand-bg md:p-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {PROJECTS.map((proj) => {
              const hasCustom = !!images[proj.id];
              return (
                <div 
                  key={proj.id} 
                  className="flex flex-col border border-black/10 rounded-xl p-4 bg-white shadow-sm relative group"
                >
                  {/* File preview block or upload helper */}
                  <div className="relative w-full h-32 rounded-lg bg-gray-50 border border-dashed border-black/15 flex flex-col items-center justify-center overflow-hidden mb-4">
                    {hasCustom ? (
                      <>
                        <img 
                          src={images[proj.id]} 
                          alt="Vorschau" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleRemove(proj.id, proj.key)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-transform"
                            title="Foto entfernen"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3">
                        <Upload size={24} className="mx-auto text-brand-muted mb-2 animate-pulse" />
                        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                          Echtes Foto aufspielen
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-left flex-grow">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-brand-text mb-0.5">
                      {proj.title}
                    </h5>
                    <p className="text-[10px] text-brand-muted mb-4 font-light">
                      {proj.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputs.current[proj.id] = el; }}
                      onChange={(e) => handleFileChange(proj.id, proj.key, e)}
                      className="hidden"
                    />
                    
                    <button
                      onClick={() => triggerInput(proj.id)}
                      className="w-full bg-black hover:bg-black/85 text-white py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload size={12} />
                      {hasCustom ? 'Ersetzen' : 'Bild hochladen'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expert Instruction Note */}
          <div className="bg-blue-50/55 border border-blue-100 rounded-xl p-4 flex gap-3 text-left text-blue-900 text-xs mt-6 leading-relaxed">
            <HelpCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1 uppercase tracking-wide text-[10px]">Tipp für dauerhafte Speicherung:</p>
              <p className="font-light">
                Bilder, die über diese Schaltfläche hochgeladen werden, sind sofort für Sie in Ihrem Browser sichtbar. Um sie permanent zu sichern (so dass sie jeder Besucher Ihrer Seite sieht), legen Sie Ihre Fotos einfach in das Verzeichnis <code className="font-mono bg-blue-100/50 px-1 py-0.5 rounded text-blue-950 font-semibold">/public/images/</code> Ihrer Webseite mit folgenden Dateinamen:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 font-mono text-[10px] text-blue-950">
                <li><strong className="text-blue-900">/public/images/h_therm.svg</strong> (für H-THERM)</li>
                <li><strong className="text-blue-900">/public/images/hagex.svg</strong> (für HAGEX)</li>
                <li><strong className="text-blue-900">/public/images/auto_station_sempach.svg</strong> (für Auto Station Sempach)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
