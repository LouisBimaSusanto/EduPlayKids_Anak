"use client";

import { motion } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";
import { useEffect } from "react";

export function IntroVideoLvl4({ onComplete }) {
  const { speak } = useTTS();

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Selamat datang di Pabrik Fonem Ajaib! Ayo kita nyalakan mesinnya.");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative w-full max-w-4xl aspect-video rounded-[2rem] overflow-hidden border-[12px] border-orange-500 shadow-[0_0_50px_rgba(251,146,60,0.8)] bg-black"
      >
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/gJ4VXXP2Tqw?autoplay=1&controls=0&modestbranding=1" 
          title="Intro Video Pabrik Fonem"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
        
        {/* Machinery Overlay effects */}
        <div className="absolute inset-0 pointer-events-none border-[16px] border-orange-600/40 mix-blend-overlay rounded-[2rem]" />
        
        {/* Rotating Gears in corners */}
        <div className="absolute -top-10 -left-10 w-32 h-32 border-8 border-dashed border-yellow-500 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[12px] border-dashed border-red-500 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-50" />
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={onComplete}
        className="
          mt-12 px-12 py-6 
          bg-gradient-to-t from-red-700 via-orange-500 to-yellow-400 
          text-white font-black text-4xl tracking-wider
          rounded-[2rem] 
          border-[6px] border-[#FFF]
          border-b-[16px] border-b-red-900 
          shadow-[0_20px_40px_rgba(239,68,68,0.6),_inset_0_5px_15px_rgba(255,255,255,0.4)]
          active:border-b-[6px] active:translate-y-[10px] 
          hover:scale-105 transition-all duration-300
          flex items-center gap-4
        "
      >
        <span className="drop-shadow-md">NYALAKAN MESIN!</span>
        <span className="text-5xl animate-[spin_3s_linear_infinite]">⚙️</span>
      </motion.button>
    </div>
  );
}
