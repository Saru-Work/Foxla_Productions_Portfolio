"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "./context";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { homeIndex } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Mouse Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 50, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const translateX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const translateY = useTransform(smoothY, [-1, 1], [-30, 30]);

  const contentTranslateX = useTransform(smoothX, [-1, 1], [15, -15]);
  const contentTranslateY = useTransform(smoothY, [-1, 1], [15, -15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Keep images for the other pages
  const bgImages: Record<string, string> = {
    "/about": "https://picsum.photos/seed/agency/1920/1080?blur=2",
    "/contact": "https://picsum.photos/seed/contact/1920/1080?blur=2",
  };

  const showVideoBg =
    pathname === "/" || pathname === "/about" || pathname === "/contact";

  const pages = ["/", "/portfolio", "/about", "/contact"];
  const currentIndex =
    pages.indexOf(pathname) === -1 ? 0 : pages.indexOf(pathname);

  const getTransitionStyle = () => {
    switch (pathname) {
      case "/portfolio":
        return {
          initial: { y: "100%", opacity: 1, filter: "blur(5px)" },
          animate: { y: 0, opacity: 1, filter: "blur(0px)" },
        };
      case "/about":
        return {
          initial: { y: "-100%", opacity: 1, filter: "blur(5px)" },
          animate: { y: 0, opacity: 1, filter: "blur(0px)" },
        };
      case "/contact":
        return {
          initial: { scale: 1.1, opacity: 0, filter: "blur(10px)" },
          animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
        };
      case "/":
      default:
        return {
          initial: { x: "100%", opacity: 1, filter: "blur(5px)" },
          animate: { x: 0, opacity: 1, filter: "blur(0px)" },
        };
    }
  };

  const currentTransition = getTransitionStyle();

  return (
    <motion.div
      initial={currentTransition.initial}
      animate={currentTransition.animate}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 w-full h-[100dvh] bg-background flex flex-col justify-between overflow-hidden shadow-2xl shadow-background z-20 origin-center"
      style={{ willChange: "transform, filter" }}
    >
      {/* Background Container */}
      <motion.div
        className="absolute inset-[-50px] z-0 bg-[#e1591e]"
        style={{ x: translateX, y: translateY }}
      >
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={
                showVideoBg
                  ? "global-video"
                  : pathname === "/portfolio"
                    ? "portfolio-gradient"
                    : bgImages[pathname as string] || "fallback"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {showVideoBg ? (
                <video
                  ref={videoRef}
                  src="/assets/videos/bg.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-70"
                />
              ) : pathname === "/portfolio" ? (
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--color-secondary)_0%,_var(--color-background)_100%)] opacity-80" />
              ) : (
                <Image
                  src={
                    bgImages[pathname as string] ||
                    "https://picsum.photos/seed/fallback/1920/1080"
                  }
                  alt="Page Background"
                  fill
                  priority
                  className="object-cover opacity-70"
                />
              )}
            </motion.div>
          </AnimatePresence>
          {/* Color overlay to match the moody tone */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-secondary/30 mix-blend-overlay pointer-events-none" />
        </>
      </motion.div>

      {/* Foreground Container */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-[1920px] mx-auto p-6 md:p-12 pointer-events-none">
        {/* Header */}
        <header className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm tracking-wide pointer-events-auto">
          <div className="flex gap-4 md:gap-8 items-center flex-1">
            <Link
              href="/portfolio"
              className="text-text/70 hover:text-accent transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            >
              Case Studies <span className="text-[10px] text-text/50">[6]</span>
            </Link>
            <Link
              href="/portfolio"
              className="text-text/50 hover:text-accent transition-colors cursor-pointer flex items-center gap-1"
            >
              Portfolio{" "}
              <span className="text-[10px] text-text/40 hidden sm:inline-block">
                [25]
              </span>
            </Link>
          </div>

          <div
            className="flex justify-center items-center cursor-pointer pointer-events-auto flex-1"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <Link href="/">
              <div className="relative h-12 sm:h-16 flex items-center justify-center min-w-[120px]">
                <AnimatePresence mode="wait">
                  {!isLogoHovered ? (
                    <motion.div
                      key="logo"
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center origin-center"
                    >
                      <Image
                        src="/logo.png"
                        alt="Foxla Logo"
                        fill
                        className="object-contain drop-shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const svg = document.createElement("div");
                            svg.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-full h-full text-text"><polygon points="12 2 2 22 22 22"></polygon></svg>`;
                            parent.appendChild(svg);
                          }
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="font-black text-lg sm:text-2xl md:text-3xl tracking-widest uppercase text-text drop-shadow-lg flex gap-1"
                    >
                      {"FOXLA".split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: i * 0.05,
                            ease: "easeOut",
                          }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          </div>

          <div className="flex gap-4 md:gap-8 items-center text-text/70 flex-1 justify-end">
            <Link
              href="/about"
              className="hover:text-accent transition-colors cursor-pointer hidden sm:block"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Contact
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <motion.div
          className="relative flex-1 w-full flex items-center my-12 pointer-events-none"
          style={{ x: contentTranslateX, y: contentTranslateY }}
        >
          {children}
        </motion.div>

        {/* Footer - Glassmorphism surface */}
        <footer className="flex flex-col gap-6 pointer-events-auto">
          {/* Progress Bar Component */}
          {pathname !== "/portfolio" && (
            <div className="w-full flex gap-2">
              {[0, 1, 2, 3, 4].map((item, index) => {
                const activeIndex =
                  pathname === "/" ||
                  pathname === "/about" ||
                  pathname === "/contact"
                    ? homeIndex
                    : currentIndex;
                const isActive = index <= activeIndex;
                return (
                  <div
                    key={item}
                    className="h-[2px] md:h-1 bg-white/20 rounded-full flex-1 overflow-hidden relative"
                  >
                    {mounted && isActive && (
                      <motion.div
                        initial={{
                          width: index === activeIndex ? "0%" : "100%",
                        }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: index === activeIndex ? 0.3 : 0,
                        }}
                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center text-[8px] md:text-[10px] text-text/50 tracking-wider gap-4 md:gap-0 mt-4">
            <div className="md:flex-1 text-center md:text-left">
              © 2026 Foxla All rights reserved.
            </div>

            <div className="flex gap-4 md:gap-6 md:flex-1 justify-center">
              <a href="#" className="hover:text-accent transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                LinkedIn
              </a>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 md:flex-1 text-center">
              <a
                href="#"
                className="hover:text-accent transition-colors whitespace-nowrap"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors whitespace-nowrap"
              >
                Terms of Services
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors whitespace-nowrap hidden sm:inline-block"
              >
                Site by Stökt
              </a>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
