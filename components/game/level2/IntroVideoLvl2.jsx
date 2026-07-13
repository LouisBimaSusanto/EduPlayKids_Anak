"use client";

import { motion } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";
import { useEffect } from "react";

export function IntroVideoLvl2({ onComplete }) {
  const { speak } = useTTS();

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Selamat datang di Istana Rima! Di sini kita akan belajar tentang bunyi kata yang sama.");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative w-full max-w-4xl aspect-video rounded-[3rem] overflow-hidden border-[8px] border-purple-300 shadow-[0_0_50px_rgba(216,180,254,0.6)] bg-black"
      >
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/5mYI8JIfHmc?autoplay=1&controls=0&modestbranding=1" 
          title="Intro Video Istana Rima"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
        
        {/* Magical Purple Overlay effects */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-purple-500/30 mix-blend-overlay rounded-[3rem]" />
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={onComplete}
        className="
          mt-12 px-12 py-6 
          bg-gradient-to-tr from-fuchsia-600 to-purple-400 
          text-white font-black text-4xl tracking-wider
          rounded-[3rem] 
          border-[6px] border-[#FFF]
          border-b-[12px] border-b-purple-900 
          shadow-[0_20px_40px_rgba(168,85,247,0.5),_inset_0_5px_15px_rgba(255,255,255,0.4)]
          active:border-b-[6px] active:translate-y-[6px] 
          hover:scale-105 transition-all duration-300
          flex items-center gap-4
        "
      >
        <span>MASUK ISTANA RIMA</span>
        <span className="text-5xl">🏰</span>
      </motion.button>
    </div>
  );
}
