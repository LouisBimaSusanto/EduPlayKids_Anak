"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_5_DATA } from "./data";

const EMOJI_MAP = {
  "Muda": "🌱", "Sapi": "🐄", "Bola": "⚽",
  "Buku": "📚", "Jari": "🖐️", "Topi": "🧢",
  "Meja": "🪑", "Kuku": "💅", "Rapi": "👔",
  "Mata": "👁️", "Baju": "👕", "Kuda": "🐴",
  "Tari": "💃"
};

export function GameMeriamRima({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [isFiring, setIsFiring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_5_DATA.game2_MeriamRima[currentRound];
  // Extract base word from "Cari rima: Kuda"
  const baseWord = roundData?.audio.split(": ")[1];

  useEffect(() => {
    if (!isSuccess && !isError && roundData && !isFiring) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, isFiring, speak]);

  const handleShoot = (option) => {
    if (isFiring || isSuccess || isError) return;
    
    setSelectedTarget(option);
    setIsFiring(true);
    playSound("bloop"); // Ideal: fuse burning sound
    
    setTimeout(() => {
      playSound("magic"); // Ideal: cannon blast sound
      
      if (option === roundData.target) {
        setIsSuccess(true);
        speak(`Hebat! ${baseWord} dan ${option} bunyinya sama!`);
        
        setTimeout(() => {
          if (currentRound < 4) {
            setCurrentRound(prev => prev + 1);
            setSelectedTarget(null);
            setIsFiring(false);
            setIsSuccess(false);
          } else {
            onComplete();
          }
        }, 3500);
      } else {
        setIsError(true);
        speak("Wah, tembakannya meleset. Bunyinya beda!");
        
        setTimeout(() => {
          setSelectedTarget(null);
          setIsFiring(false);
          setIsError(false);
        }, 2000);
      }
    }, 1000); // 1s fuse delay
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-indigo-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Top: Glowing Targets in the Sky */}
      <div className="w-full flex-1 flex flex-row items-center justify-center gap-6 md:gap-16 relative z-20 mt-12">
        <AnimatePresence>
          {roundData.options.map((opt, i) => {
            const isTargeted = selectedTarget === opt;
            const isHit = isTargeted && isSuccess;
            const isMiss = isTargeted && isError;

            return (
              <motion.button
                key={`target-${currentRound}-${opt}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isHit ? -50 : [0, 10, 0], opacity: 1, scale: isHit ? 1.5 : 1 }}
                transition={isHit ? { duration: 0.5, type: "spring" } : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                onClick={() => handleShoot(opt)}
                disabled={isFiring}
                className={`
                  relative w-32 h-32 md:w-48 md:h-48
                  rounded-full border-8 border-indigo-400
                  bg-gradient-to-tr from-indigo-900 to-purple-800
                  shadow-[0_0_30px_rgba(129,140,248,0.6),_inset_0_0_20px_rgba(255,255,255,0.3)]
                  flex flex-col items-center justify-center
                  transition-all duration-300
                  ${isMiss ? 'animate-shake border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] bg-red-900' : ''}
                  ${isHit ? 'border-fuchsia-300 shadow-[0_0_80px_rgba(217,70,239,1)] bg-fuchsia-600 z-50' : 'hover:scale-110'}
                `}
              >
                {/* Target rings */}
                <div className="absolute inset-2 border-4 border-dashed border-indigo-300/50 rounded-full" />
                
                {/* Image */}
                <span className="text-5xl md:text-[5rem] drop-shadow-lg z-10">{EMOJI_MAP[opt] || "❓"}</span>
                <span className="mt-2 font-bold text-white z-10 bg-black/40 px-2 rounded-full text-sm md:text-base">{opt}</span>

                {/* Explosion effect if hit */}
                {isHit && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-fuchsia-400 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom: The Circus Cannon */}
      <div className="w-full flex-1 flex flex-col items-center justify-end pb-8 z-30">
        
        {/* Central Display of Base Word */}
        <div className="mb-8 flex flex-col items-center">
          <span className="text-xl text-fuchsia-200 font-bold mb-2 uppercase tracking-widest drop-shadow-md">Cari Rima Untuk:</span>
          <div className="bg-indigo-950/80 backdrop-blur-md px-12 py-4 rounded-full border-4 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.5)] flex items-center gap-4">
             <span className="text-5xl">{EMOJI_MAP[baseWord] || "❓"}</span>
             <span className="text-4xl font-black text-white">{baseWord}</span>
          </div>
        </div>

        {/* The Cannon */}
        <div className="relative">
          <motion.div
            animate={isFiring ? { rotate: [-5, 5, -10, 10, -15, 15] } : { rotate: 0 }}
            transition={{ duration: 1 }}
            className="w-40 h-64 md:w-48 md:h-80 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-t-[4rem] border-x-8 border-t-8 border-slate-950 shadow-[0_30px_50px_rgba(0,0,0,0.8)] relative z-20 flex justify-center origin-bottom"
          >
             {/* Cannon Mouth Rings */}
             <div className="absolute -top-4 w-[110%] h-8 bg-slate-600 border-4 border-slate-900 rounded-full" />
             <div className="absolute top-2 w-full h-4 bg-slate-900 rounded-full" />
             
             {/* Spark effect during fuse */}
             {isFiring && !isSuccess && !isError && (
               <motion.div 
                 animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 0.2, repeat: Infinity }}
                 className="absolute -bottom-10 right-0 text-4xl"
               >
                 ✨
               </motion.div>
             )}

             {/* Cannon Ball Firing */}
             {(isSuccess || isError) && (
               <motion.div
                 initial={{ y: 0, scale: 0.5 }}
                 animate={{ y: -600, scale: 2 }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
                 className="absolute -top-10 w-16 h-16 bg-gradient-to-tr from-orange-600 to-yellow-300 rounded-full shadow-[0_0_40px_#fde047] flex items-center justify-center z-10"
               >
                 <span className="text-3xl animate-[spin_1s_linear_infinite]">💫</span>
               </motion.div>
             )}
          </motion.div>

          {/* Cannon Wheels */}
          <div className="absolute -bottom-8 -left-12 w-24 h-24 bg-amber-800 border-8 border-amber-950 rounded-full z-30 shadow-xl flex items-center justify-center">
            <div className="w-12 h-12 bg-amber-900 rounded-full border-4 border-amber-950" />
            <div className="absolute w-full h-2 bg-amber-950" />
            <div className="absolute h-full w-2 bg-amber-950" />
          </div>
          <div className="absolute -bottom-8 -right-12 w-24 h-24 bg-amber-800 border-8 border-amber-950 rounded-full z-30 shadow-xl flex items-center justify-center">
            <div className="w-12 h-12 bg-amber-900 rounded-full border-4 border-amber-950" />
            <div className="absolute w-full h-2 bg-amber-950" />
            <div className="absolute h-full w-2 bg-amber-950" />
          </div>
        </div>

      </div>

    </div>
  );
}
