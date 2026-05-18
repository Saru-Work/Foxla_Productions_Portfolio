'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider } from './context';

const FOXLA_STYLES = [
  "font-sans font-thin tracking-widest",
  "font-serif font-black italic tracking-tight",
  "font-mono font-bold uppercase tracking-widest",
  "font-sans font-bold tracking-tighter",
  "font-bebas tracking-widest",
  "font-serif font-medium uppercase tracking-normal",
];

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [styleIndex, setStyleIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // rapidly cycle through styles
    const interval = setInterval(() => {
      setStyleIndex((prev) => (prev + 1) % FOXLA_STYLES.length);
    }, 150);

    const duration = 2500;
    // end loading after 2.5s
    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    // progress counter
    const startTime = Date.now();
    let animationFrameId: number;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.floor(currentProgress));

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };
    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background text-text"
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <motion.div
        animate={{
          x: [0, -3, 3, -3, 3, 0],
          y: [0, 3, -3, 3, -3, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "mirror"
        }}
        className="flex items-center justify-center"
      >
        <span className={`text-6xl md:text-8xl transition-all duration-75 ${FOXLA_STYLES[styleIndex]}`}>
          Foxla
        </span>
      </motion.div>

      {/* Loading Progress Strip */}
      <div className="absolute bottom-0 left-0 w-full h-[28px] bg-white/20">
        <motion.div
          className="absolute top-0 left-0 h-full bg-white flex items-center justify-end pr-2 overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "linear" }}
        >
          <span className="text-black font-mono font-bold text-sm md:text-base tracking-widest">
            {progress.toString().padStart(2, '0')}%
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppProvider>
      <main className="relative h-[100dvh] w-full overflow-hidden bg-background text-text selection:bg-primary selection:text-text">
        <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="absolute inset-0 w-full h-full">
          {children}
        </div>
      )}
      </main>
    </AppProvider>
  );
}
