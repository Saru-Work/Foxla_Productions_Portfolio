"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { VerticalImageStack } from "../../components/ui/vertical-image-stack";

/* ─── Google Fonts ───────────────────────────────────────────────────────── */
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&family=Syne:wght@400;700&display=swap";

function FontLoader() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
  return null;
}

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  image: string;
  video?: string;
  tags: string[];
  type?: string;
  carouselImages?: { id: number; src: string; alt: string }[];
  layout?: "portrait" | "landscape";
}

/* ─── Custom cursor ──────────────────────────────────────────────────────── */
function MagneticCursor({ label }: { label: string }) {
  // 1. Initialize slightly off-screen to avoid a flash at 0,0
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 2. Detect if the user is on a mobile/touch device
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) {
      setIsTouchDevice(true);
      return; // Stop running the mouse tracking logic on mobile
    }

    const move = (e: MouseEvent) => {
      // Offset by half the width/height (36px of 72px) to center it
      x.set(e.clientX - 36);
      y.set(e.clientY - 36);
      setVisible(true);
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.body.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  // 3. Do not render anything on the server OR on touch devices
  if (!mounted || isTouchDevice) return null;

  // 4. Portal the cursor directly to the <body> so it ignores parent transforms
  return createPortal(
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#111",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>,
    document.body,
  );
}
/* ─── VideoCard ──────────────────────────────────────────────────────────── */
function VideoCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: (p: Project) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");

  /* Alternating tall/wide layout, but allow project to override */
  const isTall = project.layout ? project.layout === "portrait" : index % 3 === 1;

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) {
      videoRef.current.play().catch(() => { });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => {
        setHovered(true);
        setCursorLabel("View");
      }}
      onMouseLeave={() => {
        setHovered(false);
        setCursorLabel("");
      }}
      onClick={() => onClick(project)}
      style={{
        position: "relative",
        gridRow: isTall ? "span 2" : "span 1",
        cursor: "none",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Media container */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          aspectRatio: isTall ? "3/4" : "16/9",
          background: "#0a0a0a",
          flex: "0 0 auto",
        }}
      >
        {project.video ? (
          <video
            ref={videoRef}
            src={`${project.video}#t=0.001`}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              position: "absolute",
              inset: 0,
            }}
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/600x400/1a1a1a/ededed?text=Image+Unavailable";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              position: "absolute",
              inset: 0,
            }}
          />
        )}

        {/* Index badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.55)",
            zIndex: 2,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Tag pill */}
        {project.tags[0] && (
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 100,
              padding: "4px 10px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              zIndex: 2,
              transition: "opacity 0.3s",
              opacity: hovered ? 1 : 0,
            }}
          >
            {project.tags[0]}
          </div>
        )}

        {/* Bottom gradient scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Text below card */}
      <div style={{ paddingTop: 12, paddingBottom: 4 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: hovered ? "italic" : "normal",
              fontSize: isTall ? 18 : 15,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--color-text-primary)",
              margin: 0,
              transition: "font-style 0.3s",
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h2>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--color-text-tertiary)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {project.year}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
            margin: "5px 0 0",
          }}
        >
          {project.subtitle}
        </p>
      </div>
    </motion.article>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vw",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(24px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-background-primary)",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          border: "0.5px solid var(--color-border-tertiary)",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
              }}
            >
              {project.subtitle}
            </span>
            <span
              style={{
                width: 1,
                height: 12,
                background: "var(--color-border-tertiary)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "var(--color-text-tertiary)",
              }}
            >
              {project.year}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              background: "none",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: 100,
              padding: "5px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "var(--color-text-primary)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "var(--color-text-secondary)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border-tertiary)";
            }}
          >
            Close esc
          </button>
        </div>

        {/* Media */}
        <div
          style={{
            position: "relative",
            aspectRatio: project.type === "carousel" ? "auto" : "16/9",
            height: project.type === "carousel" ? "60vh" : "auto",
            background: "#000",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {project.type === "carousel" && project.carouselImages ? (
            <VerticalImageStack images={project.carouselImages} />
          ) : project.video ? (
            <video
              src={project.video}
              autoPlay
              loop
              controls
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/800x600/1a1a1a/ededed?text=Image+Unavailable";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
        </div>

        {/* Meta footer */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h1>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "5px 12px",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 100,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-text-secondary)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────────────────────────── */
export default function Gallery({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))),
    [projects],
  );

  const filtered = useMemo(
    () => (filter ? projects.filter((p) => p.tags.includes(filter)) : projects),
    [projects, filter],
  );

  const handleSelect = useCallback((p: Project) => setSelected(p), []);

  return (
    <>
      <FontLoader />

      <MagneticCursor label={selected ? "" : "View"} />

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-background-primary)",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          cursor: "none",
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            paddingTop: "clamp(3rem, 8vh, 6rem)",
            paddingBottom: "clamp(2rem, 5vh, 4rem)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.5rem",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            marginBottom: "clamp(2rem, 5vh, 3.5rem)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                margin: "0 0 12px",
              }}
            >
              Selected Works
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              Projects
              <em style={{ fontStyle: "italic", display: "block" }}>
                &amp; Stories
              </em>
            </h1>
          </div>

          {/* Tag filters */}
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              alignItems: "center",
              maxWidth: 360,
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setFilter(null)}
              style={{
                padding: "6px 14px",
                border: `0.5px solid ${filter === null ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
                borderRadius: 100,
                background:
                  filter === null ? "var(--color-text-primary)" : "transparent",
                color:
                  filter === null
                    ? "var(--color-background-primary)"
                    : "var(--color-text-secondary)",
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "none",
                transition: "all 0.2s",
              }}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(filter === tag ? null : tag)}
                style={{
                  padding: "6px 14px",
                  border: `0.5px solid ${filter === tag ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
                  borderRadius: 100,
                  background:
                    filter === tag
                      ? "var(--color-text-primary)"
                      : "transparent",
                  color:
                    filter === tag
                      ? "var(--color-background-primary)"
                      : "var(--color-text-secondary)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "none",
                  transition: "all 0.2s",
                }}
              >
                {tag}
              </button>
            ))}
          </nav>
        </header>

        {/* ── Masonry-style grid ── */}
        <main
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gridAutoRows: "240px",
            gap: "clamp(1rem, 2.5vw, 2rem)",
            alignItems: "start",
            paddingBottom: "clamp(3rem, 8vh, 6rem)",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <VideoCard
                key={project.id}
                project={project}
                index={i}
                onClick={handleSelect}
              />
            ))}
          </AnimatePresence>
        </main>

        {/* ── Footer count ── */}
        <footer
          style={{
            borderTop: "0.5px solid var(--color-border-tertiary)",
            padding: "1.5rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "var(--color-text-tertiary)",
              textTransform: "uppercase",
            }}
          >
            {filtered.length} / {projects.length} works
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--color-text-tertiary)",
            }}
          >
            Hover to preview · Click to open
          </span>
        </footer>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
