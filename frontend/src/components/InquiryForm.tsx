import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function InquiryForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    details: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    contactPreference: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      // Non-blocking: still show confirmation to the user
      console.error('Inquiry submission failed', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const types = ["Fahrzeug", "Schaufenster", "Werbetafel", "Textil"];
  const typeDict = t('form.types') || {};

  return (
    <section id="offerte" className="py-24 bg-brand-bg relative border-t border-brand-cyan/20">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase"
          >
            {t('form.title')} <span className="text-brand-cyan">{t('form.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-brand-muted"
          >
            {t('form.subtitle')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-brand-surface border border-black/10 rounded-lg p-6 sm:p-10 shadow-2xl"
        >
          
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-brand-cyan" />
              </div>
              <h3 className="text-3xl font-display font-bold uppercase mb-4">{t('form.successTitle')}</h3>
              <p className="text-brand-muted mb-8">{t('form.successMessage')}</p>
              <button 
                onClick={() => { setSubmitted(false); setStep(1); setFormData({type: '', details: '', name: '', email: '', phone: '', company: '', contactPreference: 'email'}) }}
                className="text-brand-cyan border-b border-brand-cyan/30 hover:border-brand-cyan transition-colors"
              >
                {t('form.newRequest')}
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-brand-bg rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-cyan"
                    initial={{ width: '33%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= i ? 'bg-brand-cyan text-white' : 'bg-brand-surface border border-black/20 text-brand-muted'}`}
                  >
                    {i}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-display font-bold uppercase mb-6">{t('form.step1Title')}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                        {types.map(tKey => (
                          <button
                            key={tKey}
                            type="button"
                            onClick={() => { setFormData({...formData, type: tKey}); handleNext(); }}
                            className={`p-4 rounded border text-center transition-colors ${formData.type === tKey ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan' : 'border-black/10 hover:border-black/30 text-brand-text bg-brand-bg'}`}
                          >
                            <span className="font-medium">{typeDict[tKey] || tKey}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <button type="button" onClick={handleNext} disabled={!formData.type} className="bg-brand-cyan text-white px-6 py-2 rounded font-bold uppercase hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{t('form.next')}</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-display font-bold uppercase mb-6">{t('form.step2Title')}</h3>
                      <div className="mb-8">
                        <textarea 
                          rows={4}
                          value={formData.details}
                          onChange={(e) => setFormData({...formData, details: e.target.value})}
                          className="w-full bg-brand-bg border border-black/10 rounded p-4 text-brand-text focus:outline-none focus:border-brand-cyan resize-none"
                          placeholder={t('form.step2Placeholder')}
                        />
                      </div>
                      <div className="flex justify-between">
                        <button type="button" onClick={handlePrev} className="text-brand-muted hover:text-brand-text transition-colors px-4 py-2">{t('form.prev')}</button>
                        <button type="button" onClick={handleNext} className="bg-brand-cyan text-white px-6 py-2 rounded font-bold uppercase hover:opacity-80 transition-colors">{t('form.next')}</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-display font-bold uppercase mb-6">{t('form.step3Title')}</h3>
                      <div className="space-y-4 mb-8 text-left">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-brand-muted mb-1 text-left">{t('form.name')} *</label>
                            <input 
                              required
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-brand-bg border border-black/10 rounded p-3 text-brand-text focus:outline-none focus:border-brand-cyan"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-brand-muted mb-1 text-left">{t('form.company')}</label>
                            <input 
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({...formData, company: e.target.value})}
                              className="w-full bg-brand-bg border border-black/10 rounded p-3 text-brand-text focus:outline-none focus:border-brand-cyan"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-brand-muted mb-1 text-left">{t('form.email')} *</label>
                            <input 
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-brand-bg border border-black/10 rounded p-3 text-brand-text focus:outline-none focus:border-brand-cyan"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-brand-muted mb-1 text-left">{t('form.phone')}</label>
                            <input 
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-brand-bg border border-black/10 rounded p-3 text-brand-text focus:outline-none focus:border-brand-cyan"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-black/5">
                          <label className="block text-sm font-bold uppercase text-brand-muted mb-3">{t('form.pref')}</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${formData.contactPreference === 'email' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-black/10 hover:border-black/30 bg-brand-bg'}`}>
                              <input 
                                type="radio" 
                                name="contactPreference" 
                                value="email" 
                                checked={formData.contactPreference === 'email'}
                                onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
                                className="accent-brand-cyan w-4 h-4"
                              />
                              <span className="text-sm font-medium">{t('form.prefEmail')}</span>
                            </label>
                            <label className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${formData.contactPreference === 'phone' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-black/10 hover:border-black/30 bg-brand-bg'}`}>
                              <input 
                                type="radio" 
                                name="contactPreference" 
                                value="phone" 
                                checked={formData.contactPreference === 'phone'}
                                onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
                                className="accent-brand-cyan w-4 h-4"
                              />
                              <span className="text-sm font-medium">{t('form.prefPhone')}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button type="button" onClick={handlePrev} className="text-brand-muted hover:text-brand-text transition-colors px-4 py-2" disabled={isSubmitting}>{t('form.prev')}</button>
                        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center bg-brand-cyan text-white px-8 py-3 rounded font-bold uppercase hover:opacity-80 transition-colors disabled:opacity-50 min-w-[200px]">
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            t('form.submit')
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          )}

        </motion.div>
      </div>
    </section>
  );
}
