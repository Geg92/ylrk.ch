import { ShieldCheck, Zap, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Schweizer Qualität',
    description: 'Höchste Präzision und langlebige Premium-Materialien.',
  },
  {
    icon: Zap,
    title: 'Schnelle Umsetzung',
    description: 'Effiziente Prozesse für minimale Standzeiten.',
  },
  {
    icon: MapPin,
    title: 'Schweizweit im Einsatz',
    description: 'Montage bei uns in Reinach AG oder direkt bei Ihnen vor Ort.',
  }
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-brand-bg relative z-10 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-black/5">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index} 
                className="flex items-center gap-5 py-6 md:py-2 md:px-8 first:pt-0 first:md:pl-0 last:pb-0 last:md:pr-0"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-brand-surface border border-brand-cyan/20 flex items-center justify-center text-brand-cyan relative">
                  <div className="absolute inset-0 rounded-full bg-brand-cyan/10 blur-sm"></div>
                  <Icon size={24} className="relative z-10" />
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase tracking-wide text-lg text-brand-text mb-1">{badge.title}</h3>
                  <p className="text-sm text-brand-muted leading-snug">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
