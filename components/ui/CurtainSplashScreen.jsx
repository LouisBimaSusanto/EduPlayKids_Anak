"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTTS } from "@/hooks/useAudio";
import { usePathname } from "next/navigation";

export function CurtainSplashScreen() {
  const pathname = usePathname();
  const isParentRoute = pathname?.startsWith("/orangtua");
  
  const [isVisible, setIsVisible] = useState(!isParentRoute);
  const [hasStarted, setHasStarted] = useState(false);
  const { speak } = useTTS();

  useEffect(() => {
    if (isParentRoute) return;

    // We keep the curtain closed until everything is hydrated,
    // but because browsers block auto-audio, we will just visually wait 2 seconds.
    const timer = setTimeout(() => {
      setHasStarted(true);
      speak("Selamat datang di EduPlay!"); // Might be blocked by some browsers without user interaction, but good to have
      setIsVisible(false);
    }, 2500); // 2.5 seconds gives enough time for background images/layouts to render
    return () => clearTimeout(timer);
  }, [speak, isParentRoute]);

  if (isParentRoute) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex pointer-events-none overflow-hidden">
          {/* Left Velvet Curtain */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
            className="w-1/2 h-full border-r-[24px] border-[#FFD700] shadow-[30px_0_60px_rgba(0,0,0,0.8)] flex items-center justify-end overflow-hidden relative z-10"
            style={{ 
              backgroundImage: `linear-gradient(90deg, #4A0000 0%, #A50000 20%, #300000 50%, #A50000 80%, #4A0000 100%)`,
              backgroundSize: '150px 100%' 
            }}
          >
             {/* Left inner glow / highlight on the golden edge */}
             <div className="absolute right-0 inset-y-0 w-[40px] bg-gradient-to-l from-[#FFF5E0] to-transparent opacity-40 mix-blend-overlay"></div>
             {/* Velvet fabric texture */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
             <span className="text-8xl md:text-[10rem] mb-32 -mr-20 drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-[pulse_3s_infinite]">✨</span>
          </motion.div>
          
          {/* Right Velvet Curtain */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="w-1/2 h-full border-l-[24px] border-[#FFD700] shadow-[-30px_0_60px_rgba(0,0,0,0.8)] flex items-center justify-start overflow-hidden relative z-10"
            style={{ 
              backgroundImage: `linear-gradient(90deg, #4A0000 0%, #A50000 20%, #300000 50%, #A50000 80%, #4A0000 100%)`,
              backgroundSize: '150px 100%' 
            }}
          >
             {/* Right inner glow / highlight on the golden edge */}
             <div className="absolute left-0 inset-y-0 w-[40px] bg-gradient-to-r from-[#FFF5E0] to-transparent opacity-40 mix-blend-overlay"></div>
             {/* Velvet fabric texture */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
             <span className="text-8xl md:text-[10rem] mt-32 -ml-20 drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-[pulse_3s_infinite_reverse]">✨</span>
          </motion.div>
          
          {/* Center Stage Magical Plaque */}
          <motion.div 
            exit={{ opacity: 0, scale: 0.8, y: -50, filter: "brightness(2) blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          >
            
            {/* Massive Volumetric Spotlights hitting the plaque */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.4)_0%,_transparent_60%)] mix-blend-screen opacity-80 animate-[pulse_4s_infinite]" />

            <div className="relative bg-[#3D1F0A] px-12 py-10 md:px-20 md:py-16 rounded-[4rem] border-[16px] border-[#FFD700] border-b-[24px] border-b-[#B8860B] shadow-[0_40px_80px_rgba(0,0,0,1),_inset_0_5px_30px_rgba(0,0,0,0.8)] flex flex-col items-center animate-[float_4s_infinite]">
               
               {/* Plaque Corner Ornaments */}
               <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#FFD700] rounded-full shadow-lg border-4 border-[#B8860B]" />
               <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#FFD700] rounded-full shadow-lg border-4 border-[#B8860B]" />
               <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#B8860B] rounded-full shadow-lg border-4 border-[#8B6508]" />
               <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-[#B8860B] rounded-full shadow-lg border-4 border-[#8B6508]" />

               {/* Central Icon */}
               <div className="relative">
                 <div className="absolute inset-0 bg-[#FFD700] blur-[40px] opacity-60 rounded-full animate-pulse-glow" />
                 <span className="relative text-[8rem] md:text-[11rem] mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] block transform hover:scale-110 transition-transform">🎪</span>
               </div>
               
               {/* Typography */}
               <h1 className="text-4xl md:text-6xl font-black text-shimmer drop-shadow-[0_5px_0_#000] tracking-widest text-center leading-tight mt-4">
                 MEMBUKA<br/>PANGGUNG...
               </h1>
            </div>
            
            {/* Glowing Magical Loading Orbs */}
            <div className="mt-16 flex gap-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -30, 0], scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-8 h-8 rounded-full bg-[#00E5C8] border-4 border-white shadow-[0_0_20px_rgba(0,229,200,1)]"
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
