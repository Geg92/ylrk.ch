import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Truck, CarFront, Loader2, Store, Shirt, Clock } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const CATEGORIES = [
  { id: 'small', label: 'Kleinwagen', icon: CarFront, multiplier: 1 },
  { id: 'medium', label: 'Kombi / Limousine', icon: Car, multiplier: 1.2 },
  { id: 'large', label: 'Transporter / Bus', icon: Truck, multiplier: 1.5 },
  { id: 'window', label: 'Schaufenster', icon: Store, multiplier: 0.8 },
  { id: 'textile', label: 'Textil', icon: Shirt, multiplier: 0.2 },
];

const INTENSITIES = [
  { id: 'subtle', label: 'Dezent / Einfach', baseMin: 300, baseMax: 450 },
  { id: 'medium', label: 'Mittel / Teilflächig', baseMin: 550, baseMax: 850 },
  { id: 'full', label: 'Komplex / Vollflächig', baseMin: 1200, baseMax: 2000 },
];

// Fixed per-piece price range for textile printing (CHF). Total range stays 30-60.
const TEXTILE_PRICES: Record<string, { min: number; max: number }> = {
  subtle: { min: 30, max: 40 },
  medium: { min: 40, max: 50 },
  full: { min: 50, max: 60 },
};

export function CostCalculator() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [intensity, setIntensity] = useState<typeof INTENSITIES[0] | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState(false);

  const catsDict = t('calc.cats') || {};
  const intsDict = t('calc.ints') || {};

  const handleCategoryChange = (c: typeof CATEGORIES[0]) => {
    if (c.id !== category?.id) {
      if (intensity) setIsCalculating(true);
      setCategory(c);
      if (c.id !== 'textile') {
        setQuantity(1);
      }
    }
  };

  const handleIntensityChange = (i: typeof INTENSITIES[0]) => {
    if (i.id !== intensity?.id) {
      if (category) setIsCalculating(true);
      setIntensity(i);
    }
  };

  useEffect(() => {
    if (isCalculating) {
      const timer = setTimeout(() => {
        setIsCalculating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isCalculating, category, intensity, quantity]);

  let discountMultiplier = 1;
  let discountPercentage = 0;
  if (category?.id === 'textile') {
    if (quantity >= 10 && quantity < 25) { discountMultiplier = 0.90; discountPercentage = 10; }
    else if (quantity >= 25 && quantity < 50) { discountMultiplier = 0.85; discountPercentage = 15; }
    else if (quantity >= 50 && quantity < 100) { discountMultiplier = 0.80; discountPercentage = 20; }
    else if (quantity >= 100) { discountMultiplier = 0.70; discountPercentage = 30; }
  }

  let unitMin = category && intensity ? intensity.baseMin * category.multiplier : 0;
  let unitMax = category && intensity ? intensity.baseMax * category.multiplier : 0;
  if (category?.id === 'textile' && intensity) {
    unitMin = TEXTILE_PRICES[intensity.id].min;
    unitMax = TEXTILE_PRICES[intensity.id].max;
  }

  const minPrice = Math.round(unitMin * quantity * discountMultiplier);
  const maxPrice = Math.round(unitMax * quantity * discountMultiplier);

  const piecePriceMin = Math.round(unitMin * discountMultiplier);
  const piecePriceMax = Math.round(unitMax * discountMultiplier);

  let currentStep = 1;
  if (category) currentStep = 2;
  if (category && intensity) currentStep = 3;

  return (
    <section id="calculator" className="py-24 bg-brand-surface relative z-10 border-t border-black/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-brand-cyan/10 text-brand-cyan px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          >
            <Clock size={16} />
            <span>{t('calc.quickQuote')}</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wide mb-4"
          >
            {t('calc.title')}<span className="text-brand-cyan">{t('calc.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-brand-muted max-w-2xl mx-auto"
          >
            {t('calc.subtitle')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-brand-bg border border-black/10 rounded-lg p-6 md:p-10 shadow-xl"
        >
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${currentStep >= 1 ? 'text-brand-cyan' : 'text-brand-muted'}`}>{t('calc.step1')}</span>
              <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${currentStep >= 2 ? 'text-brand-cyan' : 'text-brand-muted'}`}>{t('calc.step2')}</span>
              <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${currentStep >= 3 ? 'text-brand-cyan' : 'text-brand-muted'}`}>{t('calc.step3')}</span>
            </div>
            <div className="h-2 bg-brand-surface border border-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-cyan"
                initial={{ width: '0%' }}
                animate={{ width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="space-y-12">
            {/* Category Selection */}
            <div className={`transition-opacity duration-500 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
               <h3 className="text-lg font-medium text-brand-text mb-4">{t('calc.catTitle')}</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category?.id === c.id;
                  const catLabel = catsDict[c.id] || c.label;
                  return (
                    <button
                       key={c.id}
                       onClick={() => handleCategoryChange(c)}
                       className={`flex flex-col items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${
                        isSelected 
                          ? 'border-brand-cyan bg-brand-cyan/10 text-brand-text shadow-[0_0_15px_rgba(0,0,0,0.15)]' 
                          : 'border-black/10 bg-brand-surface text-brand-muted hover:border-black/30 hover:text-brand-text'
                      }`}
                    >
                      <Icon size={32} className={isSelected ? 'text-brand-cyan' : ''} />
                      <span className="font-medium text-sm text-center">{catLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intensity Selection */}
            <div className={`transition-opacity duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
              <h3 className="text-lg font-medium text-brand-text mb-4">{t('calc.intensityTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {INTENSITIES.map((i) => {
                  const isSelected = intensity?.id === i.id;
                  const intLabel = intsDict[i.id] || i.label;
                  return (
                    <button
                      key={i.id}
                      onClick={() => handleIntensityChange(i)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 ${
                        isSelected 
                          ? 'border-brand-cyan bg-brand-cyan/10 text-brand-text shadow-[0_0_15px_rgba(0,0,0,0.15)]' 
                          : 'border-black/10 bg-brand-surface text-brand-muted hover:border-black/30 hover:text-brand-text'
                      }`}
                    >
                      <span className="font-medium text-sm text-center">{intLabel}</span>
                    </button>
                  );
                })}
              </div>

              {category?.id === 'textile' && currentStep >= 2 && (
                <div className="bg-brand-surface border border-black/10 rounded-lg p-6 animate-in slide-in-from-bottom-2 mt-4 max-w-xl mx-auto text-center">
                  <h3 className="text-lg font-medium text-brand-text mb-2">Menge / Quantity</h3>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="200" 
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(parseInt(e.target.value));
                        setIsCalculating(true);
                      }}
                      className="w-full max-w-xs accent-brand-cyan" 
                    />
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        min="1" 
                        value={quantity}
                        onChange={(e) => {
                          let val = parseInt(e.target.value);
                          if (isNaN(val) || val < 1) val = 1;
                          setQuantity(val);
                          setIsCalculating(true);
                        }}
                        className="w-20 bg-brand-bg border border-black/20 rounded p-2 text-center text-xl font-bold focus:outline-none focus:border-brand-cyan" 
                      />
                      <span className="text-brand-muted">Stk.</span>
                    </div>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="inline-block bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20">
                      {discountPercentage}% Mengenrabatt aktiv!
                    </div>
                  )}
                  {discountPercentage === 0 && quantity < 10 && (
                    <div className="text-xs text-brand-muted/70 italic">
                      Ab 10 Stück profitieren Sie von 10% Mengenrabatt!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Result */}
            <div className={`mt-8 pt-8 border-t border-black/10 text-center relative overflow-hidden min-h-[140px] transition-all duration-500 ${currentStep >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <h3 className="text-sm text-brand-muted uppercase tracking-wider mb-2">{t('calc.priceTitle')}</h3>
              <div className="flex justify-center items-center mb-4 flex-col gap-2">
                <AnimatePresence mode="wait">
                  {!category || !intensity ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xl md:text-2xl text-brand-muted h-[48px] flex items-center"
                    >
                      {t('calc.chooseAll')}
                    </motion.div>
                  ) : isCalculating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="h-[48px] flex items-center justify-center text-brand-cyan"
                    >
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center"
                    >
                      <div className="text-4xl md:text-5xl font-display font-bold text-brand-cyan drop-shadow-[0_0_15px_rgba(0,0,0,0.15)] mb-2">
                        CHF {minPrice} - {maxPrice}
                      </div>
                      {category.id === 'textile' && quantity > 1 && (
                        <div className="text-sm font-medium text-brand-muted bg-black/5 px-4 py-1.5 rounded-full border border-black/5">
                           (CHF {piecePriceMin} - {piecePriceMax} / Stk.)
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-xs text-brand-muted/70 max-w-lg mx-auto">
                {t('calc.note')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
