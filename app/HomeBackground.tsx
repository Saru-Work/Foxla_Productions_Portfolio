"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "./context";

const SERVICES = [
  {
    video:
      "https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_30fps.mp4",
  },
  {
    video:
      "https://videos.pexels.com/video-files/5961661/5961661-uhd_2560_1440_30fps.mp4",
  },
  {
    video:
      "https://videos.pexels.com/video-files/5961655/5961655-uhd_2560_1440_30fps.mp4",
  },
  {
    video:
      "https://videos.pexels.com/video-files/6981412/6981412-uhd_2560_1440_25fps.mp4",
  },
  {
    video:
      "https://videos.pexels.com/video-files/6981410/6981410-uhd_2560_1440_25fps.mp4",
  },
];

export default function HomeBackground() {
  const pathname = usePathname();
  const { homeIndex } = useAppContext();

  if (pathname !== "/") return null;

  const currentVideo = SERVICES[homeIndex]?.video || SERVICES[0].video;

  return (
    <div className="fixed inset-0 w-[100vw] h-[100vh] z-0 bg-black pointer-events-none overflow-hidden">
      {/* <AnimatePresence>
        <motion.video
          key={currentVideo}
          src={currentVideo}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-[100vw] h-[100vh] object-cover"
        />
      </AnimatePresence> */}
      <div className="absolute inset-0 w-[100vw] h-[100vh] bg-gradient-to-t from-background/80 via-transparent to-background/80" />
    </div>
  );
}
