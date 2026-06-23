import { MessageSquare, Printer, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export function SocialProofBar() {
  const proofs = [
    { icon: MessageSquare, text: 'Professionelle Beratung' },
    { icon: Printer, text: 'Präzise Produktion' },
    { icon: Layers, text: 'Fachgerechte Montage' }
  ];

  return (
    <div className="w-full bg-brand-surface border-y border-black/5 py-4 overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center sm:justify-around items-center gap-y-4 gap-x-6 sm:gap-x-8">
          {proofs.map((proof, index) => {
            const Icon = proof.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                  <Icon size={14} strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-brand-muted uppercase tracking-wider">
                  {proof.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
