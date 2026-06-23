import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export function Process() {
  const { t } = useLanguage();
  const steps = t('proc.steps') || [];

  return (
    <motion.section 
      id="ablauf" 
      className="py-24 bg-brand-bg relative border-t border-black/5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase"
          >
            {t('proc.title')} <span className="text-brand-cyan">{t('proc.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-brand-muted max-w-2xl"
          >
            {t('proc.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-[1px] bg-black/10 z-0"></div>

          {(steps as any[]).map((step, index) => (
             <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index} 
                className="relative z-10 flex flex-col items-center text-center"
             >
               <div className="w-24 h-24 rounded-full bg-brand-surface border border-black/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.15)]">
                 <span className="font-display font-bold text-4xl text-brand-cyan">{step.number}</span>
               </div>
               <h3 className="text-2xl font-display font-bold mb-3 uppercase">{step.title}</h3>
               <p className="text-brand-muted">{step.description}</p>
             </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
