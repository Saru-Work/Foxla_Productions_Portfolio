"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context";

// 1. Import standard Firebase SDK modules
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Make sure you place your 'firebase-config.js' (or .ts) in the same folder as this file,
// or update the path below to wherever it lives!
import { firebaseConfig } from "@/lib/firebase-config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CONTACT_SLIDES = [
  {
    type: "intro",
    subtitle: "Let's Talk",
    title: "Start Your",
    highlight: "Next Chapter",
    content:
      "Whether you have a fully formed brief or just a spark of an idea we want to hear it. Tell us what you're building and let's figure out how to make it extraordinary.",
  },
  {
    type: "info",
    subtitle: "Based In",
    title: "Colombo",
    highlight: "",
    link: "https://maps.app.goo.gl/5adcCdrEMRaUKtMJ7",
    isLarge: true,
  },
  {
    type: "info",
    subtitle: "Email",
    title: "foxlaproductions",
    highlight: "@gmail.com",
    link: "mailto:foxlaproductions@gmail.com",
    isEmail: true,
  },
  {
    type: "info",
    subtitle: "Phone",
    title: "+94 70 331",
    highlight: "0725",
    link: "tel:+94703310725",
    whatsapp: "https://wa.me/94703310725",
  },
  {
    type: "form",
    subtitle: "Project Details",
  },
];

export default function Contact() {
  const { homeIndex, setHomeIndex } = useAppContext();
  const isScrolling = useRef(false);

  // 2. Add Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    project: "",
  });

  // Track button UI state
  const [buttonState, setButtonState] = useState({
    text: "Send Message →",
    status: "idle", // 'idle' | 'sending' | 'success' | 'error'
  });

  useEffect(() => {
    // 1. Keep track of touch coordinates
    let touchStartY = 0;
    let touchEndY = 0;

    const handleScroll = (direction: number) => {
      if (isScrolling.current) return;

      setHomeIndex((prev: number) => {
        let newIndex = prev + direction;
        if (newIndex < 0) newIndex = 0;

        // ⚠️ CHANGE THIS FOR ABOUT/CONTACT PAGES
        if (newIndex >= CONTACT_SLIDES.length)
          newIndex = CONTACT_SLIDES.length - 1;

        return newIndex;
      });

      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
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

      if (Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 1 : -1;
        handleScroll(direction);
      }
    };

    // 3.5 Prevent Pull-to-Refresh
    const handleTouchMove = (e: TouchEvent) => {
      // This stops the browser from refreshing when you swipe down!
      e.preventDefault();
    };

    // 4. Attach all listeners (Notice the passive: false flag!)
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    // 5. Cleanup
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setHomeIndex]);

  // 4. The Firebase Submit Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page reload

    if (!formData.email || !formData.project) {
      alert("Please fill in your email and project details.");
      return;
    }

    setButtonState({ text: "Sending...", status: "sending" });

    try {
      await addDoc(collection(db, "messages"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        service: formData.service,
        projectDetails: formData.project,
        createdAt: serverTimestamp(),
      });

      setButtonState({ text: "Message Sent ✓", status: "success" });

      // Clear form inputs
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        service: "",
        project: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setButtonState({ text: "Error. Try Again.", status: "error" });
    }

    // Reset button after 3.5s (just like your old script)
    setTimeout(() => {
      setButtonState({ text: "Send Message →", status: "idle" });
    }, 3500);
  };

  const safeIndex = Math.min(homeIndex, CONTACT_SLIDES.length - 1);
  const currentSlide = CONTACT_SLIDES[safeIndex];

  return (
    <div className="absolute top-[50%] left-0 w-full -translate-y-1/2 flex flex-col items-center justify-center px-6 md:px-12 z-10">
      <div className="absolute top-0 md:-top-8 flex justify-center w-full pointer-events-none">
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

      <div className="flex mx-auto w-full max-w-4xl h-[400px] justify-center items-center pointer-events-none">
        <AnimatePresence mode="wait">
          {currentSlide.type === "intro" && (
            <motion.div
              key="intro"
              className="text-center pointer-events-auto flex flex-col items-center w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tighter uppercase text-text leading-none mb-6">
                {currentSlide.title}
                <br />
                <span className="text-text/40">{currentSlide.highlight}</span>
              </h2>
              <p className="text-lg md:text-xl text-text/70 max-w-2xl font-light leading-relaxed">
                {currentSlide.content}
              </p>
            </motion.div>
          )}

          {currentSlide.type === "info" && (
            <motion.div
              key={`info-${safeIndex}`}
              className="text-center pointer-events-auto w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentSlide.link ? (
                <a
                  href={currentSlide.link}
                  target={
                    currentSlide.link.includes("http") ? "_blank" : undefined
                  }
                  rel={
                    currentSlide.link.includes("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="hover:opacity-70 transition-opacity flex flex-col items-center"
                >
                  <h2
                    className={`leading-none transition-all ${
                      currentSlide.isEmail
                        ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic tracking-wide text-text lowercase"
                        : currentSlide.isLarge
                          ? "text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-sans font-bold tracking-tighter uppercase text-text"
                          : "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tighter uppercase text-text"
                    }`}
                  >
                    {currentSlide.title}
                    {!currentSlide.isEmail && !currentSlide.isLarge && (
                      <br className="md:hidden" />
                    )}
                    <span
                      className={`text-text/40 ${currentSlide.isEmail || currentSlide.isLarge ? "" : "md:ml-4"}`}
                    >
                      {currentSlide.highlight}
                    </span>
                  </h2>
                </a>
              ) : (
                <h2 className="text-5xl sm:text-7xl md:text-8xl font-sans font-bold tracking-tighter uppercase text-text leading-none">
                  {currentSlide.title}
                  <br />
                  <span className="text-text/40">{currentSlide.highlight}</span>
                </h2>
              )}

              {currentSlide.whatsapp && (
                <a
                  href={currentSlide.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest border border-text/20 px-6 py-3 rounded-full hover:bg-text hover:text-background transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              )}
            </motion.div>
          )}

          {/* 3. Bind the form inputs to state and add onSubmit */}
          {currentSlide.type === "form" && (
            <motion.form
              onSubmit={handleSubmit}
              key="form"
              className="w-full max-w-2xl flex flex-col gap-4 text-left pointer-events-auto bg-black/40 p-6 md:p-8 backdrop-blur-md border border-text/10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col relative group">
                  <label className="text-[9px] uppercase tracking-widest text-text/50 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-text/30 py-1 text-text text-sm transition-colors focus:border-text outline-none placeholder:text-text/20"
                  />
                </div>
                <div className="flex flex-col relative group">
                  <label className="text-[9px] uppercase tracking-widest text-text/50 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Morgan"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-text/30 py-1 text-text text-sm transition-colors focus:border-text outline-none placeholder:text-text/20"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-text/50 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-text/30 py-1 text-text text-sm transition-colors focus:border-text outline-none placeholder:text-text/20"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-text/50 mb-1">
                  Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-text/30 py-1 text-text text-sm transition-colors focus:border-text outline-none appearance-none cursor-pointer"
                >
                  <option className="bg-background text-text" value="" disabled>
                    Select a service
                  </option>
                  <option
                    className="bg-background text-text"
                    value="Photography"
                  >
                    Photography
                  </option>
                  <option
                    className="bg-background text-text"
                    value="Video Production"
                  >
                    Video Production
                  </option>
                  <option
                    className="bg-background text-text"
                    value="Commercial Ad"
                  >
                    Commercial Ad
                  </option>
                  <option
                    className="bg-background text-text"
                    value="Creative Direction"
                  >
                    Creative Direction
                  </option>
                  <option
                    className="bg-background text-text"
                    value="Website Design & Development"
                  >
                    Website Design & Development
                  </option>
                  <option
                    className="bg-background text-text"
                    value="Full Campaign"
                  >
                    Full Campaign
                  </option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-text/50 mb-1">
                  Your Project
                </label>
                <textarea
                  placeholder="What are you building? What's the vision?"
                  rows={2}
                  value={formData.project}
                  onChange={(e) =>
                    setFormData({ ...formData, project: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-text/30 py-1 text-text text-sm transition-colors focus:border-text outline-none placeholder:text-text/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={buttonState.status === "sending"}
                className={`w-full mt-2 font-bold text-sm uppercase tracking-widest py-3 transition-all duration-300 ${
                  buttonState.status === "success"
                    ? "bg-[#1f5c35] text-white"
                    : buttonState.status === "error"
                      ? "bg-[#7c1010] text-white"
                      : "bg-text text-background hover:bg-text/80"
                } ${buttonState.status === "sending" ? "opacity-70" : "opacity-100"}`}
              >
                {buttonState.text}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
