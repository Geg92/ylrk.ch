import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Compass, 
  Upload, 
  RefreshCw, 
  Download, 
  BrainCircuit, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Maximize2 
} from 'lucide-react';

interface GenerationResult {
  imageUrl?: string;
  textResponse?: string;
}

export function AIDesignStudio() {
  const [activeTab, setActiveTab] = useState<'generate' | 'advisor'>('generate');
  
  // Design Input States
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [qualityMode, setQualityMode] = useState<'standard' | 'studio'>('standard');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Advisor States
  const [advisorPrompt, setAdvisorPrompt] = useState('');
  const [useHighThinking, setUseHighThinking] = useState(false);
  
  // Status & loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
    } else {
      setError("Bitte wählen Sie ein gültiges Bild.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Image Generation Handler (including editing)
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Bitte beschreiben Sie das gewünschte Design!");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          aspectRatio: aspectRatio,
          mode: qualityMode,
          image: uploadedImage || undefined,
          mimeType: uploadedImage ? "image/png" : undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "Unerwarteter Fehler.");
      }

      setResult({ imageUrl: data.imageUrl });
    } catch (err: any) {
      setError(err.message || "Bildgenerierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };



  // Advisor Strategy Strategy Handler (Thinking mode)
  const handleConsultation = async () => {
    if (!advisorPrompt.trim()) {
      setError("Bitte geben Sie eine Frage ein.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/chat-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: advisorPrompt,
          useHighThinking: useHighThinking
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "Kommunikationsfehler.");
      }

      setResult({ textResponse: data.text });
    } catch (err: any) {
      setError(err.message || "Beratung konnte nicht gestartet werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-studio" className="py-24 bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-black/5 text-black px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-black/15">
            <Sparkles size={14} className="text-brand-cyan" />
            <span>YLRK AI Brand-Lab & Design Studio</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-sans font-black tracking-tight text-gray-900 mb-4 uppercase">
            Visualisieren Sie Ihre Vision in Echtzeit
          </h2>
          <p className="text-lg text-brand-muted font-light">
            Nutzen Sie wegweisende Gemini 3.5 KI, um Beschriftungen auf Fahrzeugen, Schaufenstern oder Textilien fotorealistisch zu entwerfen.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 border-b border-black/10 pb-4">
          <button
            onClick={() => { setActiveTab('generate'); setResult(null); setError(null); }}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'generate' ? 'bg-black text-white shadow-md' : 'text-brand-muted hover:bg-black/5'}`}
          >
            <ImageIcon size={16} />
            <span>Design Generator (Bild)</span>
          </button>

          <button
            onClick={() => { setActiveTab('advisor'); setResult(null); setError(null); }}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'advisor' ? 'bg-black text-white shadow-md' : 'text-brand-muted hover:bg-black/5'}`}
          >
            <Compass size={16} />
            <span>Designberater & Karten</span>
          </button>
        </div>

        {/* Studio Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-5 bg-brand-surface border border-black/10 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Image Upload Area (Shared for image edits or video input) */}
            {activeTab !== 'advisor' && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Ausgangsfoto hochladen (Optional)
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${dragActive ? 'border-brand-cyan bg-brand-cyan/5' : 'border-black/15 hover:border-black/30 bg-white'}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {uploadedImage ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 border border-black/5">
                      <img src={uploadedImage} alt="Hochgeladen" className="h-full object-contain" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                        className="absolute top-2 right-2 bg-black text-white p-1 rounded-full text-xs hover:bg-red-600 transition-colors"
                      >
                        Entfernen
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-brand-muted mb-2" size={28} />
                      <span className="text-xs font-medium text-gray-600 text-center">
                        Bild ziehen & ablegen oder anklicken
                      </span>
                      <span className="text-[10px] text-brand-muted mt-1 text-center">
                        Ihr Fahrzeug, Schaufenster oder Logo
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tab-Specific Control Panels */}
            {activeTab === 'generate' && (
              <div className="space-y-6">
                {/* Prompt Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Design-Beschreibung & Stil
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g. Weißer Mercedes Sprinter Lieferwagen mit elegantem metallic goldenem Firmenlogo 'Schreinerei Müller', fotorealistisch, Seitenansicht..."
                    className="w-full h-28 p-3 text-sm border border-black/15 rounded-lg focus:outline-none focus:border-brand-cyan bg-white resize-none"
                  />
                </div>

                {/* Aspect Ratio choice (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, and 21:9) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Seitenverhältnis (Aspect Ratio)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1.5 text-xs font-bold rounded border transition-all ${aspectRatio === ratio ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-black/15 hover:border-black/30'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality / Model switch */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 font-sans">
                    Qualitätsstufe
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setQualityMode('standard')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center transition-all ${qualityMode === 'standard' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-black/15 hover:border-black/30'}`}
                    >
                      <span className="font-bold">Standard</span>
                      <span className="text-[9px] opacity-70">gemini-3.1-flash</span>
                    </button>
                    <button
                      onClick={() => setQualityMode('studio')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center transition-all ${qualityMode === 'studio' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-black/15 hover:border-black/30'}`}
                    >
                      <span className="font-bold">Studio Premium</span>
                      <span className="text-[9px] opacity-70">gemini-3-pro-image</span>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  disabled={loading}
                  onClick={handleGenerateImage}
                  className="w-full bg-brand-cyan text-white py-3.5 rounded-lg font-bold text-sm hover:bg-brand-cyan/90 transition-colors shadow-md shadow-brand-cyan/20 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Generiere Entwurf...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>{uploadedImage ? "Foto modifizieren" : "Design entwerfen"}</span>
                    </>
                  )}
                </button>
              </div>
            )}



            {activeTab === 'advisor' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Was möchten Sie designen oder herausfinden?
                  </label>
                  <textarea
                    value={advisorPrompt}
                    onChange={(e) => setAdvisorPrompt(e.target.value)}
                    placeholder="E.g. Welche rechtlichen Besonderheiten gelten für Heckscheibenbeschriftung in der Schweiz und wo in der Zentralschweiz kann ich diese anbringen lassen?"
                    className="w-full h-32 p-3 text-sm border border-black/15 rounded-lg focus:outline-none focus:border-brand-cyan bg-white resize-none"
                  />
                </div>

                {/* Interactive Toggles */}
                <div className="space-y-3">
                  {/* High thinking toggle */}
                  <div className="flex items-center justify-between p-3 border border-black/10 rounded-xl bg-white hover:bg-black/5 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <BrainCircuit size={18} className="text-purple-600" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-gray-900">Hohe Denkstufe (Thinking Mode)</span>
                        <span className="text-[10px] text-brand-muted">Löst komplexe Designfragen</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useHighThinking}
                        onChange={(e) => setUseHighThinking(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                {/* Submit advisor prompt */}
                <button
                  disabled={loading}
                  onClick={handleConsultation}
                  className="w-full bg-brand-cyan text-white py-3.5 rounded-lg font-bold text-sm hover:bg-brand-cyan/90 transition-colors shadow-md shadow-brand-cyan/20 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Frage KI-Strategen...</span>
                    </>
                  ) : (
                    <>
                      <Compass size={16} />
                      <span>Beratung anfordern</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-150 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Result Visualization / Display Screen (Right) */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="w-full bg-black rounded-2xl border border-black/15 overflow-hidden shadow-xl aspect-[16/10] relative flex flex-col items-center justify-center bg-radial from-gray-900 to-black select-none">
              
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="studio-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/80"
                  >
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-brand-cyan/25 border-t-brand-cyan animate-spin" />
                      <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-cyan animate-pulse" />
                    </div>

                    <h4 className="text-white font-sans font-extrabold text-base tracking-wide uppercase mb-2">
                      Studio-Engine rendert
                    </h4>
                    
                    <p className="text-xs text-brand-cyan animate-pulse">
                      Komponiere fotorealistische Schweizer Vektorgrafiken...
                    </p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="studio-result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    {/* Render Image Result with custom container cropping for simulated aspect precision */}
                    {result.imageUrl && (
                      <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <div 
                          className="relative shadow-2xl rounded-xl overflow-hidden bg-brand-surface max-w-full max-h-full border border-white/10 flex items-center justify-center"
                          style={{
                            aspectRatio: aspectRatio === '21:9' ? '21/9' : aspectRatio.replace(':', '/')
                          }}
                        >
                          <img 
                            src={result.imageUrl} 
                            alt="YLRK AI Entwurf" 
                            className="max-h-full max-w-full object-contain"
                          />
                          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold py-1 px-2.5 rounded-full flex items-center gap-1">
                            <span>Image Generated</span>
                          </div>
                        </div>
                      </div>
                    )}



                    {/* Render Advisor consultation output */}
                    {result.textResponse && (
                      <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between text-left overflow-y-auto bg-gray-900 border border-white/10 text-white/95 transition-all">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                            <BrainCircuit className={useHighThinking ? "text-purple-400" : "text-brand-cyan"} size={20} />
                            <h4 className="text-sm font-sans font-black uppercase tracking-wider">
                              {useHighThinking ? "KI-Experte (Hohe Denkstufe)" : "KI-Designberater & Stratege"}
                            </h4>
                          </div>
                          <div className="text-xs leading-relaxed text-gray-200 whitespace-pre-wrap font-sans max-h-[300px] overflow-y-auto pr-2">
                            {result.textResponse}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 justify-between">
                          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                            YLRK CONSULTING SUITE
                          </span>
                          <button
                            onClick={() => {
                              // Auto populate into contact/inquiry form
                              const form = document.getElementById('offerte');
                              if (form) {
                                form.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="bg-white hover:bg-brand-cyan hover:text-white transition-colors text-black text-[10px] font-bold py-1.5 px-3 rounded-md uppercase"
                          >
                            Projekt anfragen
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="studio-placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-8 text-center text-gray-500"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                      <Sparkles className="text-brand-cyan/80" size={32} />
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      Bereit zum Entwerfen
                    </span>
                    <span className="text-xs text-gray-400 max-w-sm">
                      Treffen Sie links Ihre Einstellungen für Fahrzeugbeschriftungen, Textilfolierungen oder Schaufenstergrafiken und klicken Sie auf Generieren.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Tech indicators */}
              <div className="absolute top-3 left-4 flex items-center space-x-1.5 pointer-events-none select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" />
                <span className="text-[9px] font-mono text-gray-400 ml-2 tracking-wider">STUDIO_LIVE_GRID</span>
              </div>
            </div>

            {/* Quick Action bar underneath image results */}
            {result && result.imageUrl && (
              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => {
                    // download handle
                    const link = document.createElement('a');
                    link.href = result.imageUrl || '';
                    link.download = 'ylrk-brand-concept.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-1 bg-black text-white hover:bg-neutral-800 text-xs font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-black/10 transition-all uppercase tracking-wide"
                >
                  <Download size={14} />
                  <span>Render herunterladen</span>
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="bg-brand-surface hover:bg-black/5 text-gray-700 text-xs font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-1.5 border border-black/10 transition-all uppercase tracking-wide"
                >
                  <RefreshCw size={14} />
                  <span>Neues Design</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
