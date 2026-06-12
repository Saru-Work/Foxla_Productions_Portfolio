"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "./context";

const SERVICES = [
  {
    title: "FOXLA",
    subtitle: "Advertising Agency",
    year: "Est 2026",
    video:
      "https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_30fps.mp4",
  },
  {
    title: "CINEMA",
    subtitle: "Cinematography",
    year: "Production",
    video:
      "https://videos.pexels.com/video-files/5961661/5961661-uhd_2560_1440_30fps.mp4",
  },
  {
    title: "BRANDS",
    subtitle: "Brand Strategy",
    year: "Strategy",
    video:
      "https://videos.pexels.com/video-files/5961655/5961655-uhd_2560_1440_30fps.mp4",
  },
  {
    title: "SOCIAL",
    subtitle: "Digital Marketing",
    year: "Growth",
    video:
      "https://videos.pexels.com/video-files/6981412/6981412-uhd_2560_1440_25fps.mp4",
  },
  {
    title: "DESIGN",
    subtitle: "Web & Product Design",
    year: "Creative",
    video:
      "https://videos.pexels.com/video-files/6981410/6981410-uhd_2560_1440_25fps.mp4",
  },
];

export default function Home() {
  const { homeIndex, setHomeIndex } = useAppContext();
  const isScrolling = useRef(false);

  useEffect(() => {
    // 1. Keep track of touch coordinates
    let touchStartY = 0;
    let touchEndY = 0;

    const handleScroll = (direction: number) => {
      if (isScrolling.current) return;

      setHomeIndex((prev: number) => {
        let newIndex = prev + direction;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= SERVICES.length) newIndex = SERVICES.length - 1; // CHANGE THIS ARRAY NAME FOR ABOUT/CONTACT PAGES
        return newIndex;
      });

      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000); // 1s cool-down between scrolls
    };

    // 2. Mouse Wheel Logic
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 20) {
        const direction = e.deltaY > 0 ? 1 : -1;
        handleScroll(direction);
      }
    };

    // 3. Mobile Touch Logic
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      const deltaY = touchStartY - touchEndY;

      // Require a minimum swipe distance of 50px to prevent accidental micro-swipes
      if (Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 1 : -1;
        handleScroll(direction);
      }
    };

    // 4. Attach all listeners
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    // 5. Cleanup
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setHomeIndex]);

  const currentService = SERVICES[homeIndex];

  return (
    <>
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
    </>
  );
}
