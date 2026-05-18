'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="absolute top-[50%] left-0 w-full -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
      <motion.h2 
        className="text-4xl md:text-6xl font-sans font-bold tracking-tighter uppercase text-text mb-6 pointer-events-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        About Us
      </motion.h2>

      <motion.p 
        className="max-w-2xl text-center text-text/70 md:text-lg leading-relaxed px-6 pointer-events-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Foxla Productions is a premium advertising agency dedicated to creating cinematic and bold digital experiences. 
        We specialize in pushing boundaries to deliver unparalleled visual storytelling for the modern world.
      </motion.p>
    </div>
  );
}
