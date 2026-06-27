import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { TestimonialProjectImage } from './TestimonialProjectImage';
import { useLanguage } from '../lib/LanguageContext';

export function Testimonials() {
  const { t } = useLanguage();

  const staticKunden = [
    {
      name: 'Kunde',
      company: 'H-THERM GmbH',
      rating: 5,
      image: '/images/h_therm_photo.png'
    },
    {
      name: 'Kunde',
      company: 'HAGEX HAUSHALTSGERÄTE',
      rating: 5,
      image: '/images/hagex_photo.jpg'
    },
    {
      name: 'Kunde',
      company: 'Auto Station Sempach',
      rating: 5,
      image: '/images/auto_station_sempach_photo.jpg'
    }
  ];

  const tKunden = t('testi.kunden') || [];

  const testimonials = staticKunden.map((item, idx) => {
    const translation = tKunden[idx] || {};
    return {
      ...item,
      name: translation.name || item.name,
      company: translation.company || item.company,
      text: translation.text || ''
    };
  });

  return (
    <section id="referenzen" className="py-24 bg-brand-surface relative border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wide mb-4"
          >
            {t('testi.title')} <span className="text-brand-cyan">{t('testi.titleHighlight')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-brand-muted max-w-2xl mx-auto"
          >
            {t('testi.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={testimonial.company}
              className="bg-brand-bg rounded-lg p-8 border border-black/10 relative group"
            >
              <Quote size={40} className="absolute top-6 right-6 text-brand-text/5 group-hover:text-brand-cyan/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-brand-cyan text-brand-cyan" />
                ))}
              </div>
              
              <div className="mb-6">
                <TestimonialProjectImage 
                  company={testimonial.company} 
                  fallbackImage={testimonial.image} 
                />
              </div>

              <p className="text-brand-muted mb-8 leading-relaxed italic relative z-10">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-black/10 pt-4 mt-auto">
                <p className="font-bold text-brand-text uppercase tracking-wider text-sm">{testimonial.name}</p>
                <p className="text-brand-cyan text-xs">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
