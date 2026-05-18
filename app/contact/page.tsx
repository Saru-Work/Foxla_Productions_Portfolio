'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="absolute top-[50%] left-0 w-full -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
      <motion.h2 
        className="text-4xl md:text-6xl font-sans font-bold tracking-tighter uppercase text-text mb-6 pointer-events-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Get in touch
      </motion.h2>

      <motion.div 
        className="flex flex-col items-center gap-4 pointer-events-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <a href="mailto:hello@foxla.com" className="text-xl md:text-3xl font-serif italic text-text/70 hover:text-accent transition-colors">
          hello@foxla.com
        </a>
        <div className="text-sm tracking-widest text-text/50 uppercase mt-4">
          Los Angeles &bull; New York &bull; London
        </div>
      </motion.div>
    </div>
  );
}
