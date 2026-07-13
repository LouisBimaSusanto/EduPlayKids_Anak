"use client";

import { motion } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";
import { useEffect } from "react";

export function IntroVideoLvl6({ onComplete }) {
  const { speak } = useTTS();

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Luar Biasa! Kamu sudah sampai di Istana Puncak Bintang Nusantara!");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative w-full max-w-4xl aspect-video rounded-[2rem] overflow-hidden border-[12px] border-amber-400 shadow-[0_0_50px_rgba(251,191,36,1)] bg-black z-20"
      >
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/gJ4VXXP2Tqw?autoplay=1&controls=0&modestbranding=1" 
          title="Intro Video Istana Bintang"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
        
        {/* Golden Overlay effects */}
        <div className="absolute inset-0 pointer-events-none border-[16px] border-yellow-300/30 mix-blend-overlay rounded-[2rem] shadow-[inset_0_0_50px_rgba(255,215,0,0.8)]" />
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={onComplete}
        className="
          mt-12 px-12 py-6 
          bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 
          text-yellow-900 font-black text-4xl tracking-wider
          rounded-full 
          border-[4px] border-[#FFF]
          border-b-[12px] border-b-amber-700 
          shadow-[0_0_40px_rgba(251,191,36,0.8),_inset_0_5px_15px_rgba(255,255,255,0.8)]
          active:border-b-[4px] active:translate-y-[8px] 
          hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,1)] transition-all duration-300
          flex items-center gap-4 z-20 relative overflow-hidden
        "
      >
        <span className="drop-shadow-sm z-10">BUKA PINTU ISTANA!</span>
        <span className="text-5xl animate-[pulse_1.5s_infinite] z-10 drop-shadow-[0_0_10px_white]">👑</span>
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </motion.button>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
