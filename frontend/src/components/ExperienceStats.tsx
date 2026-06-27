import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Calendar, Car, Users } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

function Counter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // Easing function for smoother stop
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeOutQuart * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function ExperienceStats() {
  const { t } = useLanguage();
  const stats = [
    { icon: Calendar, value: 5, suffix: "+", label: t('stats.years') },
    { icon: Car, value: 150, suffix: "+", label: t('stats.cars') },
    { icon: Users, value: 200, suffix: "+", label: t('stats.customers') },
  ];

  return (
    <section className="py-20 bg-brand-surface relative z-10 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center justify-center p-8 bg-brand-bg rounded-2xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={32} strokeWidth={2} />
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-brand-text mb-3">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-brand-muted text-sm md:text-base font-semibold tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
