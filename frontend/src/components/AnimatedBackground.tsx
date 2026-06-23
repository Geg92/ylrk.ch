import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef } from 'react';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Create subtle parallax scroll transformations for different layers
  const yLayer1 = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const yLayer3 = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  
  // Rotations for abstract shapes on scroll
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -35]);

  // SVG dashOffset or scale animation matching the flow of wrapping films
  const scaleLine = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.95]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 md:block"
      style={{ isolation: 'isolate' }}
    >
      {/* Decorative Layer 1: Elegant, soft fluid organic vehicle-like contour curves (representing precision cutting lines & film foil application) */}
      <motion.div 
        style={{ y: yLayer1, scale: scaleLine }}
        className="absolute inset-0 opacity-[0.035] transition-opacity duration-700"
      >
        <svg 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full object-cover"
        >
          {/* Swirling aerodynamic curves */}
          <path 
            d="M-100 200 C300 250 500 50 800 150 C1100 250 1200 450 1600 400" 
            stroke="#111111" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M-50 215 C330 265 480 35 820 165 C1120 285 1180 430 1580 415" 
            stroke="#111111" 
            strokeWidth="1" 
            strokeLinecap="round"
            strokeDasharray="8 8"
          />
          <path 
            d="M50 750 C400 680 750 850 1000 690 C1250 530 1300 620 1550 580" 
            stroke="#111111" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Decorative Layer 2: Ultra-fine blueprint precision grid and tech crosshairs (representing measurement accuracy) */}
      <motion.div 
        style={{ y: yLayer2 }}
        className="absolute inset-0 opacity-[0.025]"
      >
        <svg 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full object-cover"
        >
          {/* Subtly spaced horizontal lines representing design grid */}
          <line x1="0" y1="100" x2="1440" y2="100" stroke="#111111" strokeWidth="1" />
          <line x1="0" y1="300" x2="1440" y2="300" stroke="#111111" strokeWidth="0.5" />
          <line x1="0" y1="500" x2="1440" y2="500" stroke="#111111" strokeWidth="1" />
          <line x1="0" y1="700" x2="1440" y2="700" stroke="#111111" strokeWidth="0.5" />
          
          {/* Layout coordinates/crosshair details reminiscent of professional vector editing tools */}
          <g transform="translate(180, 250)">
            <circle cx="0" cy="0" r="15" stroke="#111111" strokeWidth="1" />
            <line x1="-25" y1="0" x2="25" y2="0" stroke="#111111" strokeWidth="1" />
            <line x1="0" y1="-25" x2="0" y2="25" stroke="#111111" strokeWidth="1" />
          </g>
          <g transform="translate(1250, 600)">
            <circle cx="0" cy="0" r="10" stroke="#111111" strokeWidth="0.75" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#111111" strokeWidth="0.75" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#111111" strokeWidth="0.75" />
          </g>
        </svg>
      </motion.div>

      {/* Decorative Layer 3: Abstract squircle curves and geometric foil shapes drifting subtly (representing actual sticker materials) */}
      <motion.div 
        style={{ y: yLayer3, rotate: rotate2 }}
        className="absolute right-[-100px] top-[15%] w-[400px] h-[400px] opacity-[0.015] border border-brand-text rounded-[80px]"
      />
      <motion.div 
        style={{ y: yLayer2, rotate: rotate1 }}
        className="absolute left-[-150px] bottom-[20%] w-[500px] h-[500px] opacity-[0.012] border-2 border-dashed border-brand-text rounded-[100px]"
      />
      
      {/* Tiny geometric dot matrices representing high-precision printer rasters */}
      <div className="absolute top-[8%] left-[5%] w-32 h-32 opacity-[0.035] bg-[radial-gradient(#111111_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
      <div className="absolute bottom-[12%] right-[5%] w-48 h-48 opacity-[0.03] bg-[radial-gradient(#111111_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
    </div>
  );
}
