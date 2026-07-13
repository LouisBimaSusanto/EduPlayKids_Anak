"use client";

import { motion } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";
import { useEffect } from "react";

export function IntroVideoLvl3({ onComplete }) {
  const { speak } = useTTS();

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Selamat datang di Lautan Fonem! Di sini kita akan belajar huruf dan bunyi pertama.");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative w-full max-w-4xl aspect-video rounded-[3rem] overflow-hidden border-[8px] border-cyan-300 shadow-[0_0_50px_rgba(34,211,238,0.6)] bg-black"
      >
        {/* Placeholder for YouTube iframe, using a random suitable one or just generic ocean for now */}
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/Pj1L5pT-DDI?autoplay=1&controls=0&modestbranding=1" 
          title="Intro Video Lautan Fonem"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
        
        {/* Magical Ocean Overlay effects */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-cyan-500/30 mix-blend-overlay rounded-[3rem]" />
        
        {/* Animated bubbles overlapping the video frame */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute bottom-0 w-8 h-8 rounded-full border-2 border-white/50 animate-[float_3s_ease-in_infinite]"
            style={{ 
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.7}s`
            }}
          />
        ))}
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={onComplete}
        className="
          mt-12 px-12 py-6 
          bg-gradient-to-tr from-cyan-600 to-teal-400 
          text-white font-black text-4xl tracking-wider
          rounded-[3rem] 
          border-[6px] border-[#FFF]
          border-b-[12px] border-b-cyan-900 
          shadow-[0_20px_40px_rgba(34,211,238,0.5),_inset_0_5px_15px_rgba(255,255,255,0.4)]
          active:border-b-[6px] active:translate-y-[6px] 
          hover:scale-105 transition-all duration-300
          flex items-center gap-4
        "
      >
        <span>MENYELAM SEKARANG</span>
        <span className="text-5xl">🌊</span>
      </motion.button>
    </div>
  );
}
