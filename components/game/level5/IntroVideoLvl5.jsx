"use client";

import { motion } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";
import { useEffect } from "react";

export function IntroVideoLvl5({ onComplete }) {
  const { speak } = useTTS();

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Wah, kita sudah sampai di Puncak! Selamat datang di Mega Festival Bunyi!");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative w-full max-w-4xl aspect-video rounded-[2rem] overflow-hidden border-[8px] border-fuchsia-500 shadow-[0_0_50px_rgba(217,70,239,0.8)] bg-black z-20"
      >
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/gJ4VXXP2Tqw?autoplay=1&controls=0&modestbranding=1" 
          title="Intro Video Mega Festival"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
        
        {/* Neon Overlay effects */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-indigo-600/40 mix-blend-overlay rounded-[2rem] shadow-[inset_0_0_50px_rgba(192,132,252,0.5)]" />
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={onComplete}
        className="
          mt-12 px-12 py-6 
          bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 
          text-white font-black text-4xl tracking-wider
          rounded-full 
          border-[4px] border-[#FFF]
          border-b-[12px] border-b-indigo-950 
          shadow-[0_0_40px_rgba(192,132,252,0.8),_inset_0_5px_15px_rgba(255,255,255,0.4)]
          active:border-b-[4px] active:translate-y-[8px] 
          hover:scale-105 hover:shadow-[0_0_60px_rgba(217,70,239,1)] transition-all duration-300
          flex items-center gap-4 z-20 relative overflow-hidden
        "
      >
        <span className="drop-shadow-md z-10">MULAI FESTIVAL!</span>
        <span className="text-5xl animate-[pulse_1s_infinite] z-10">🎆</span>
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </motion.button>
      
      {/* Decorative Fireworks Background Elements specific to Intro */}
      <div className="absolute top-10 left-10 text-6xl animate-[bounce_2s_infinite]">🎇</div>
      <div className="absolute top-20 right-20 text-5xl animate-[pulse_1.5s_infinite]">🌟</div>
      <div className="absolute bottom-10 left-32 text-7xl animate-[bounce_3s_infinite_reverse]">🎆</div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
