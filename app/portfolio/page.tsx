'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import Image from 'next/image';

const PROJECTS = [
  { id: '1', title: 'POWERADE', subtitle: 'College Football', year: '2025', image: 'https://picsum.photos/seed/nike/1200/800', tags: ['Production', 'Animation & VFX'] },
  { id: '2', title: 'RED BULL', subtitle: 'Racing Doc', year: '2024', image: 'https://picsum.photos/seed/redbull/1200/800', tags: ['Directing', 'Cinematography'] },
  { id: '3', title: 'PORSCHE', subtitle: '911 GT3 RS', year: '2024', image: 'https://picsum.photos/seed/porsche/1200/800', tags: ['Commercial', 'VFX'] },
  { id: '4', title: 'NIKE', subtitle: 'Just Do It', year: '2023', image: 'https://picsum.photos/seed/n/1200/800', tags: ['Creative', 'VFX'] },
  { id: '5', title: 'SONY', subtitle: 'Bravia', year: '2023', image: 'https://picsum.photos/seed/sony/1200/800', tags: ['Color Grading'] },
  { id: '6', title: 'APPLE', subtitle: 'Vision Pro', year: '2024', image: 'https://picsum.photos/seed/apple/1200/800', tags: ['Animation', 'Post'] },
  { id: '7', title: 'ADIDAS', subtitle: 'Originals', year: '2025', image: 'https://picsum.photos/seed/adidas/1200/800', tags: ['Directing'] },
  { id: '8', title: 'BMW', subtitle: 'M Series', year: '2024', image: 'https://picsum.photos/seed/bmw/1200/800', tags: ['Editing', 'Color'] },
];

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const updateSize = () => setWindowWidth(window.innerWidth);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [activeProject, setActiveProject] = useState(Math.floor(PROJECTS.length / 2));

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    const velocityThreshold = 400;
    
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  const handleNext = () => setActiveProject(prev => Math.min(prev + 1, PROJECTS.length - 1));
  const handlePrev = () => setActiveProject(prev => Math.max(prev - 1, 0));

  const spacingX = windowWidth < 640 ? 140 : windowWidth < 1024 ? 200 : 300;

  return (
    <div className="absolute inset-0 w-full h-full text-text overflow-y-auto pointer-events-auto no-scrollbar">
      
      {/* 100vh Hero Text Section */}
      <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center shrink-0">
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex justify-center pointer-events-none z-0"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
          >
            {"PORTFOLIO".split("").map((char, index) => (
              <span key={index} className="inline-block overflow-hidden py-2 -my-2">
                <motion.h1 
                  className="text-[14vw] md:text-[12vw] leading-none font-[family-name:var(--font-archivo-black)] text-center uppercase text-text tracking-[0.05em] drop-shadow-2xl"
                  variants={{
                    hidden: { y: "100%" },
                    visible: { 
                      y: 0, 
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                    },
                    exit: { 
                      y: "100%", 
                      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } 
                    }
                  }}
                >
                  {char}
                </motion.h1>
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-2 pointer-events-none text-text/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="text-xs uppercase tracking-widest font-mono">Scroll to explore</span>
          <motion.div 
            className="w-px h-12 bg-gradient-to-b from-text/50 to-transparent"
            animate={{ scaleY: [0, 1, 0], transformOrigin: ["top", "top", "bottom"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* 3D Coverflow Section */}
      <div className="w-full min-h-[100dvh] pb-32 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Coverflow Container */}
        <div 
          className="relative w-full h-[50vh] xl:h-[60vh] flex items-center justify-center z-10 my-12" 
          style={{ perspective: "1000px" }}
        >
          {mounted && (
            <motion.div 
              className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05}
              onDragEnd={handleDragEnd}
              style={{ transformStyle: "preserve-3d" }}
            >
              {PROJECTS.map((project, i) => {
                const offset = i - activeProject;
                const isFront = offset === 0;
                
                const rotateY = isFront ? 0 : offset < 0 ? 30 : -30;
                const x = offset * spacingX;
                const z = Math.abs(offset) * -150 - (isFront ? 0 : 50);
                const scale = isFront ? 1 : 0.85;
                const opacity = Math.abs(offset) > 3 ? 0 : (isFront ? 1 : 0.4);
                
                return (
                  <motion.div
                    key={project.id}
                    className="absolute w-[260px] sm:w-[320px] md:w-[450px] aspect-[4/5] sm:aspect-[16/10] bg-background/80 backdrop-blur-md border border-text/10 shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden group rounded-2xl origin-center"
                    initial={false}
                    animate={{
                      x,
                      z,
                      scale,
                      rotateY,
                      opacity,
                      zIndex: PROJECTS.length - Math.abs(offset)
                    }}
                    transition={{ type: "spring", stiffness: 70, damping: 20 }}
                    style={{
                      transformStyle: "preserve-3d",
                      pointerEvents: isFront ? "auto" : "none",
                      WebkitBoxReflect: "below 5px linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.3))"
                    }}
                  >
                    <div className="w-full h-full flex flex-col relative">
                      {/* Image Area */}
                      <div className="relative w-full flex-1 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 z-10 group-hover:opacity-0 transition-opacity duration-500" />
                        <Image 
                          src={project.image}
                          alt={project.title}
                          fill
                          className={`object-cover transition-all duration-700 ease-[0.16,1,0.3,1] will-change-transform ${isFront ? "grayscale-0 opacity-100 scale-105 group-hover:scale-110" : "grayscale opacity-60 scale-100"}`}
                        />
                      </div>
                      
                      {/* Content Area */}
                      <div className="h-[90px] sm:h-[110px] flex flex-col justify-center px-4 sm:px-6 bg-background/80 backdrop-blur-lg border-t border-text/10" style={{ transform: "translateZ(1px)" }}>
                        <div className="flex justify-between items-end mb-2 gap-4 text-left">
                          <h3 className="font-[family-name:var(--font-archivo-black)] text-xl sm:text-2xl lg:text-3xl uppercase tracking-tighter leading-none group-hover:text-accent transition-colors truncate">
                            {project.title}
                          </h3>
                          <span className="text-secondary font-mono text-sm sm:text-base leading-none">0{project.id}</span>
                        </div>
                        <div className="flex justify-between items-center w-full gap-4 text-left">
                           <p className="text-xs sm:text-sm text-text/60 tracking-wide font-medium truncate">{project.subtitle}</p>
                           <p className="text-[10px] sm:text-xs text-text/40 font-mono flex-shrink-0">{project.year}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Carousel UI Controls & Info */}
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-8 z-20 pointer-events-auto px-6">
          
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={handlePrev}
              disabled={activeProject === 0}
              className="p-3 text-text/60 hover:text-text border border-text/20 hover:border-text transition-all rounded-full hover:bg-text/5 backdrop-blur-sm disabled:opacity-30 disabled:hover:border-text/20 disabled:hover:bg-transparent"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <div className="flex flex-col items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap justify-center gap-2"
                >
                  {PROJECTS[activeProject]?.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-text text-background text-[10px] sm:text-xs uppercase tracking-widest font-medium">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <button 
              onClick={handleNext}
              disabled={activeProject === PROJECTS.length - 1}
              className="p-3 text-text/60 hover:text-text border border-text/20 hover:border-text transition-all rounded-full hover:bg-text/5 backdrop-blur-sm disabled:opacity-30 disabled:hover:border-text/20 disabled:hover:bg-transparent"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          
          <div className="font-mono text-[10px] text-text/40 tracking-widest uppercase flex items-center gap-2 mt-4">
             Swipe or use arrows to navigate
          </div>
        </div>

      </div>

    </div>
  );
}
