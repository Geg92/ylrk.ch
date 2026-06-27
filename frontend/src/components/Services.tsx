import { Car, Store, Webhook, Shirt, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export function Services() {
  const { t } = useLanguage();
  const scrollToContact = () => {
    document.getElementById('offerte')?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      icon: Car,
      title: t('services.carTitle'),
      description: t('services.carDesc'),
      specs: t('services.carSpecs') || []
    },
    {
      icon: Store,
      title: t('services.storeTitle'),
      description: t('services.storeDesc'),
      specs: t('services.storeSpecs') || []
    },
    {
      icon: Webhook,
      title: t('services.boardTitle'),
      description: t('services.boardDesc'),
      specs: t('services.boardSpecs') || []
    },
    {
      icon: Shirt,
      title: t('services.textileTitle'),
      description: t('services.textileDesc'),
      specs: t('services.textileSpecs') || []
    }
  ];

  return (
    <motion.section 
      id="leistungen" 
      className="py-24 bg-brand-surface relative z-10 border-t border-black/5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase"
          >
            {t('services.title')} <span className="text-brand-cyan">{t('services.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-brand-muted max-w-2xl mx-auto"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={service.title}
                className="bg-brand-bg flex flex-col rounded-lg p-8 border border-black/5 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand-cyan/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded bg-brand-surface border border-black/5 flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 uppercase tracking-wide">{service.title}</h3>
                <p className="text-brand-muted mb-6 text-sm leading-relaxed flex-1">
                  {service.description}
                </p>

                <div className="space-y-2 mb-8 pt-6 border-t border-black/5">
                  <h4 className="text-xs uppercase tracking-widest text-brand-text/40 mb-3 font-bold">{t('services.specs')}</h4>
                  {(service.specs as string[]).map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-sm text-brand-muted">
                      <CheckCircle2 size={14} className="text-brand-cyan min-w-[14px]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <button onClick={scrollToContact} className="text-brand-cyan font-medium flex items-center text-sm group-hover:text-brand-text transition-colors">
                  {t('services.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
