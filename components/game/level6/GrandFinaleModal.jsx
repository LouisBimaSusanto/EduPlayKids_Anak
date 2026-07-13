"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";

// Mock API Call
const syncGameLoopData = async (childId, phase, stats) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[API] Synced Phase: ${phase} for Child: ${childId}`, stats);
      resolve(true);
    }, 1500);
  });
};

export function GrandFinaleModal({ onCompleteLevel }) {
  const { speak } = useTTS();
  const { playSound } = useAudio();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    playSound("magic"); // Triumphant music would be ideal here
    
    setTimeout(() => {
      speak("Wah, Kamu luar biasa! Kamu sudah lulus dan menjadi ahli fonem!");
    }, 1000);

    const performSync = async () => {
      const childId = "child_123"; // In a real app, from auth context
      const finalStats = { score: 100, completedNodes: 36 };
      
      // API Call to Supabase: Triggers Parent App push notification and generates final PDF Assessment Report for the Psychologist.
      await syncGameLoopData(childId, "PHASE_4_COMPLETE", finalStats);
      setIsSynced(true);
    };

    performSync();
  }, [playSound, speak]);

  return (
    <div className="flex flex-col items-center justify-center h-full relative w-full overflow-hidden">
      
      {/* Background Celebration Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.4)_0%,_transparent_80%)]" />
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-white/30 to-transparent mix-blend-overlay" />
      </div>

      {/* Main Graduation Content */}
      <motion.div 
        initial={{ scale: 0.5, y: 100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="flex gap-8 items-end mb-12">
           <span 
             className="text-[10rem] drop-shadow-[0_20px_30px_rgba(251,191,36,0.6)] animate-[float_2s_ease-in-out_infinite] transform-gpu"
             style={{ animationDelay: '0.2s' }}
           >
             🦜
           </span>
           
           <div
             className="relative animate-[pulse_3s_ease-in-out_infinite] transform-gpu"
           >
             <span className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl drop-shadow-[0_0_50px_white]">👑</span>
             <div className="bg-white/20 backdrop-blur-md border-8 border-yellow-300 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(251,191,36,0.8)] will-change-transform">
               <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 drop-shadow-md text-center tracking-tight">
                 SELAMAT!<br/>KAMU LULUS!
               </h1>
             </div>
           </div>

           <span 
             className="text-[10rem] drop-shadow-[0_20px_30px_rgba(251,191,36,0.6)] animate-[float_2s_ease-in-out_infinite] transform-gpu"
             style={{ animationDelay: '0.5s' }}
           >
             🦊
           </span>
        </div>
        
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          onClick={onCompleteLevel} 
          disabled={!isSynced}
          className="
            mt-8
            bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 
            text-white font-black text-4xl tracking-widest
            py-8 px-24 rounded-full 
            border-[8px] border-[#FFF]
            border-b-[16px] border-b-amber-800 
            active:border-b-[8px] active:translate-y-[12px] 
            shadow-[0_30px_60px_rgba(251,191,36,1),_inset_0_10px_20px_rgba(255,255,255,0.8)]
            transition-all duration-100 ease-out
            disabled:opacity-50 disabled:grayscale
          "
        >
          {isSynced ? "KEMBALI KE PETA" : "MENYIMPAN..."}
        </motion.button>
      </motion.div>

      {/* Persistent CSS Confetti */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden perspective-[1000px]">
        {[...Array(60)].map((_, i) => {
          const duration = 3 + Math.random() * 5;
          const delay = Math.random() * 5;
          const startX = Math.random() * 100;
          return (
            <div
              key={i}
              className="absolute w-4 h-8 bg-yellow-400 top-[-50px] transform-gpu"
              style={{ 
                left: `${startX}vw`,
                backgroundColor: ['#FFD700', '#FFA500', '#FF69B4', '#00FFFF', '#32CD32', '#FFF'][Math.floor(Math.random() * 6)],
                animation: `confetti-fall ${duration}s linear ${delay}s infinite`
              }}
            />
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-50px) rotate(0deg) translateZ(0); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg) translateZ(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
