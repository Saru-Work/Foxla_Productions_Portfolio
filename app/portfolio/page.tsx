"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import portraitImage from "../../public/assets/images/potrait.png";
import Image from "next/image";
const Gallery3D = dynamic(() => import("./Gallery3D"), { ssr: false });

const PROJECTS = [
  {
    id: "1",
    title: "Photography",
    subtitle: "VISUAL STORYTELLING",
    year: "2025",
    image: "/assets/images/photography/2.jpeg",
    video: undefined,
    type: "carousel",
    carouselImages: [
      { id: 1, src: "/assets/images/photography/1.jpeg", alt: "Photography 1" },
      { id: 2, src: "/assets/images/photography/2.jpeg", alt: "Photography 2" },
      { id: 3, src: "/assets/images/photography/3.jpeg", alt: "Photography 3" },
      { id: 4, src: "/assets/images/photography/4.jpeg", alt: "Photography 4" },
      { id: 5, src: "/assets/images/photography/5.jpeg", alt: "Photography 5" },
      { id: 6, src: "/assets/images/photography/6.jpeg", alt: "Photography 6" },
    ],
    tags: ["Portrait", "Editorial"],
  },
  {
    id: "2",
    title: "End to end video production",
    subtitle: "SCRIPT TO FINAL CUT",
    year: "2024",
    image: "https://picsum.photos/seed/video/1200/800",
    video: "/assets/videos/3.mp4",
    tags: ["Directing", "Cinematography"],
  },
  {
    id: "3",
    title: "Commercial ads",
    subtitle: "BRAND MOMENTS THAT MATTER",
    year: "2024",
    image: "https://picsum.photos/seed/promo/1200/800",
    video: "/assets/videos/2.mp4",
    tags: ["Commercial", "VFX"],
  },
  {
    id: "4",
    title: "Creative Direction and Design",
    subtitle: "CRAFTING BRAND EXPERIENCES",
    year: "2025",
    image: "https://picsum.photos/seed/creative/1200/800",
    video: "/assets/videos/1.mp4",
    tags: ["Creative", "Design"],
  },
  {
    id: "5",
    title: "Website Design and Development",
    subtitle: "Interactive Experiences",
    year: "2023",
    image: "https://picsum.photos/seed/web/1200/800",
    video: "/assets/videos/web.mp4",
    tags: ["UX/UI", "Development"],
    layout: "landscape" as const,
  },
];

const SERVICES = [
  {
    title: "End to End Video Production",
    desc: "From concept to color grade full pipeline. Scripting, direction, shoot, post-production, and delivery at the highest standard.",
  },
  {
    title: "Commercial Ads",
    desc: "productions for TV, digital, and social. Ads that don't interrupt they engage, captivate, and convert with purpose.",
  },
  {
    title: "Creative Direction and Design",
    desc: "Strategic creative vision for campaigns, brand identities, and visual systems. We define the aesthetic DNA of your brand at every level.",
  },
  {
    title: "Website Design and Development",
    desc: "Premium digital experiences built for performance and beauty. From UX strategy to pixel-perfect code web presences that convert.",
  },
  {
    title: "Photography",
    desc: "Editorial, commercial, and lifestyle photography that captures the soul of your brand. Every frame tells a story worth stopping for.",
  },
];

export default function Portfolio() {
  return (
    <div className="absolute inset-0 w-full h-full text-zinc-100 overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory bg-transparent pointer-events-auto z-10 selection:bg-white selection:text-black">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[60dvh] shrink-0 snap-center pointer-events-none flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-col items-center justify-center mix-blend-overlay opacity-100 z-10 whitespace-nowrap"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              exit: {
                transition: { staggerChildren: 0.05, staggerDirection: -1 },
              },
            }}
          >
            {/* Main Title */}
            {/* Added a responsive gap here (gap-1 md:gap-3) to control letter spacing nicely */}
            <div className="flex flex-row overflow-hidden pb-2 gap-1 sm:gap-1 md:gap-1 lg:gap-1">
              {"PORTFOLIO".split("").map((char, index) => (
                <span key={index} className="block overflow-hidden py-4 -my-4">
                  <motion.h1
                    // Removed 'tracking-tighter' from here so it doesn't squish the characters
                    className="text-[12vw] sm:text-[10vw] leading-none font-black text-center uppercase text-white drop-shadow-2xl"
                    variants={{
                      hidden: { y: "100%", opacity: 0, rotate: 5 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        rotate: 0,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                      },
                      exit: {
                        y: "-100%",
                        opacity: 0,
                        transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                      },
                    }}
                  >
                    {char}
                  </motion.h1>
                </span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              className="mt-2 text-sm md:text-lg font-light tracking-[0.3em] uppercase text-white/80"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: 0.6, ease: "easeOut" },
                },
              }}
            >
              Our Handpicked Featured Portfolio
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Scroll
          </span>
          <motion.div
            className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent origin-top"
            animate={{ scaleY: [0, 1, 0], translateY: [0, 10, 20] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="relative w-full h-[100dvh] shrink-0 snap-always snap-center flex items-center justify-center px-6 md:px-20 pointer-events-auto">
        <motion.div
          className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div
            className="aspect-[4/5] w-full max-w-sm mx-auto rounded-2xl overflow-hidden relative shadow-2xl border border-white/10"
            variants={{
              hidden: { opacity: 0, scale: 0.9, rotate: -2 },
              visible: {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <Image src={portraitImage} alt="" fill className="object-contain" priority />
            <div className="w-full h-full bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          <motion.div className="flex flex-col gap-6 p-6 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5">
            <motion.h2
              className="text-4xl md:text-6xl font-bold"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Not Content. Culture. <br />
              <span className="text-white/50 italic font-serif">
                Anything but Cinematic.
              </span>
            </motion.h2>
            <motion.p
              className="text-white/70 text-lg leading-relaxed font-light"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Photography | End to End Video Production | Commercial Ads |
              Creative Direction & Design | Website Design & Development
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. SERVICES SECTION */}
      {/* Changed to min-h-[100dvh], added padding, and changed to snap-start */}
      <section className="relative w-full min-h-[100dvh] py-24 md:py-32 shrink-0 snap-always snap-start flex flex-col items-center justify-center px-6 md:px-20 pointer-events-auto">
        <motion.div
          className="w-full max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.h2
            className="text-xs tracking-[0.3em] uppercase text-white/50 mb-16 text-center"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Areas of Expertise
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-6">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={idx}
                className="w-full md:w-[calc(33.333%-1rem)] group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
              >
                <div className="text-3xl font-light text-white/30 group-hover:text-white/80 transition-colors mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {service.title}
                </h3>
                <p className="text-white/60 font-light leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. GALLERY SECTION (3D) */}
      <section className="relative w-full shrink-0 snap-always snap-center pointer-events-auto">
        <Gallery3D projects={PROJECTS} />
      </section>

      {/* 5. CONTACT SECTION */}
      <section className="relative w-full h-[100dvh] shrink-0 snap-always snap-center flex items-center justify-center px-6 pointer-events-auto">
        <motion.div
          className="flex flex-col items-center text-center gap-8 bg-black/40 p-12 md:p-24 rounded-3xl backdrop-blur-xl border border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          <motion.h2
            className="text-5xl md:text-8xl font-black uppercase"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Let's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">
              Work
            </span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-white/60 font-light max-w-md"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Ready to bring your next big idea to life? Drop me a message and
            let's create something extraordinary.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <a
              href="https://wa.me/+94703310725"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-8 py-4 bg-white text-black rounded-full font-bold tracking-widest uppercase text-sm hover:scale-105 transition-transform inline-block"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            className="flex gap-6 mt-12 text-sm tracking-widest uppercase text-white/40"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.4 } },
            }}
          >
            <a
              href="https://www.instagram.com/foxlaproductions/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/foxlaproductions/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
