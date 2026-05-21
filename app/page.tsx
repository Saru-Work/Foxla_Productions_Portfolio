"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "./context";

const SERVICES = [
  { title: "FOXLA", subtitle: "Advertising Agency", year: "Est 2026" },
  { title: "CINEMA", subtitle: "Cinematography", year: "Production" },
  { title: "BRANDS", subtitle: "Brand Strategy", year: "Strategy" },
  { title: "SOCIAL", subtitle: "Digital Marketing", year: "Growth" },
  { title: "DESIGN", subtitle: "Web & Product Design", year: "Creative" },
];

export default function Home() {
  const { homeIndex, setHomeIndex } = useAppContext();
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      if (e.deltaY > 20 || e.deltaY < -20) {
        setHomeIndex((prev: number) => {
          let newIndex = prev + direction;
          if (newIndex < 0) newIndex = 0;
          if (newIndex >= SERVICES.length) newIndex = SERVICES.length - 1;
          return newIndex;
        });

        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 1000); // 1s cool-down between scrolls
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [setHomeIndex]);

  const currentService = SERVICES[homeIndex];

  return (
    <div className="absolute top-[50%] left-0 w-full -translate-y-1/2 flex flex-col md:flex-row items-center justify-center md:justify-between pointer-events-none px-6 md:px-12 gap-8 md:gap-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`subtitle-${homeIndex}`}
          className="text-sm font-home font-bold md:text-lg tracking-[0.2em] md:w-32 pointer-events-auto text-primary text-center md:text-left drop-shadow-[0_0_15px_rgba(255,122,61,0.6)] uppercase"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentService.subtitle}
        </motion.div>
      </AnimatePresence>

      {/* Main Title */}
      <div className="flex mx-auto px-4 md:px-0 max-w-full justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${homeIndex}`}
            className="flex font-home flex-nowrap justify-center max-w-full whitespace-nowrap"
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
            {currentService.title.split("").map((char, index) => (
              <motion.h1
                key={`${homeIndex}-${index}`}
                className={`text-[18vw] font-bold sm:text-[16vw] md:text-[12vw] leading-none text-center uppercase text-text pointer-events-auto filter drop-shadow-2xl`}
                variants={{
                  hidden: { y: 200, opacity: 0, scale: 0.9 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  },
                  exit: {
                    y: -200,
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                  },
                }}
                style={{
                  textShadow: "0 10px 40px rgba(0,0,0,0.8)",
                  transformOrigin: "bottom center",
                }}
              >
                {char.trim()}
              </motion.h1>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`year-${homeIndex}`}
          className="text-sm md:text-lg font-bold tracking-[0.2em] pointer-events-auto md:w-32 text-center md:text-right text-text drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] uppercase"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentService.year}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
