"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context"; // Make sure this path is correct

const ABOUT_SLIDES = [
  { type: "stat", title: "02", subtitle: "Years of Excellence" },
  { type: "stat", title: "07+", subtitle: "Projects Delivered" },
  { type: "stat", title: "03+", subtitle: "Brand Partnerships" },
  { type: "stat", title: "100K+", subtitle: "Views Generated" },
  {
    type: "text",
    subtitle: "Our Vision",
    content:
      "Foxla Productions is a premium creative agency born from a singular obsession to craft visual stories that don't just communicate, they resonate. We don't produce content. We engineer culture.",
  },
];

export default function About() {
  // Use the global state instead of local state!
  const { homeIndex, setHomeIndex } = useAppContext();
  const isScrolling = useRef(false);

  useEffect(() => {
    // Reset index to 0 when entering the page
    setHomeIndex(0);

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      if (e.deltaY > 20 || e.deltaY < -20) {
        setHomeIndex((prev: number) => {
          let newIndex = prev + direction;
          if (newIndex < 0) newIndex = 0;
          if (newIndex >= ABOUT_SLIDES.length)
            newIndex = ABOUT_SLIDES.length - 1;
          return newIndex;
        });

        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 1000);
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [setHomeIndex]);

  const safeIndex = Math.min(homeIndex, ABOUT_SLIDES.length - 1);
  const currentSlide = ABOUT_SLIDES[safeIndex];

  return (
    <div className="relative w-full flex flex-col items-center justify-center px-6 md:px-12 h-[60vh]">
      {/* Subtitle / Label */}
      <div className="absolute top-0 flex justify-center w-full z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`subtitle-${safeIndex}`}
            className="text-sm md:text-lg tracking-[0.3em] uppercase text-text/60 pointer-events-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentSlide.subtitle}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="flex mx-auto px-4 md:px-0 max-w-4xl justify-center items-center w-full z-10 pointer-events-none mt-16">
        <AnimatePresence mode="wait">
          {currentSlide.type === "stat" && (
            <motion.div
              key={`title-${safeIndex}`}
              className="flex flex-nowrap justify-center max-w-full whitespace-nowrap"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                exit: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              {currentSlide.title?.split("").map((char, index) => (
                <motion.h2
                  key={`${safeIndex}-${index}`}
                  className="text-[25vw] sm:text-[20vw] md:text-[15vw] leading-none font-[family-name:var(--font-archivo-black)] text-center uppercase text-text tracking-tight pointer-events-auto"
                  variants={{
                    hidden: { y: 150, opacity: 0, scale: 0.9 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                    exit: {
                      y: -150,
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                    },
                  }}
                  style={{
                    textShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    transformOrigin: "bottom center",
                  }}
                >
                  {char}
                </motion.h2>
              ))}
            </motion.div>
          )}

          {currentSlide.type === "text" && (
            <motion.div
              key={`desc-${safeIndex}`}
              className="text-center pointer-events-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xl md:text-3xl lg:text-4xl leading-snug text-text font- uppercase tracking-wide font- archivo black max-w-3xl drop-shadow-lg">
                {currentSlide.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
