"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";

const ROUNDS = [
  { id: 1, name: "Sapi", emoji: "🐄", targetTaps: 2, instruction: "Sa... pi. Dua ketukan! Ayo pecahkan esnya!", text: ["Satu! Sa!", "Dua! Pi! Hore, sapi bebas!"] },
  { id: 2, name: "Kuda", emoji: "🐎", targetTaps: 2, instruction: "Ku... da. Dua ketukan! Ayo pecahkan!", text: ["Satu! Ku!", "Dua! Da! Kuda bebas!"] },
  { id: 3, name: "Gajah", emoji: "🐘", targetTaps: 2, instruction: "Ga... jah. Dua ketukan!", text: ["Satu! Ga!", "Dua! Jah! Gajah bebas!"] },
  { id: 4, name: "Jerapah", emoji: "🦒", targetTaps: 3, instruction: "Je... ra... pah. Tiga ketukan!", text: ["Satu! Je!", "Dua! Ra!", "Tiga! Pah! Jerapah bebas!"] },
  { id: 5, name: "Beruang", emoji: "🐻", targetTaps: 3, instruction: "Be... ru... ang. Tiga ketukan!", text: ["Satu! Be!", "Dua! Ru!", "Tiga! Ang! Beruang bebas!"] }
];

export function GamePaluEs({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [taps, setTaps] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const { speak } = useTTS();

  const roundData = ROUNDS[currentRound];

  useEffect(() => {
    // Mount instruction
    if (!isBroken && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.instruction);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isBroken, speak]);

  const handleTap = () => {
    if (taps < roundData.targetTaps && !isBroken) {
      const newTaps = taps + 1;
      setTaps(newTaps);
      
      speak(roundData.text[newTaps - 1]);

      if (newTaps === roundData.targetTaps) {
        setIsBroken(true);
        setTimeout(() => {
          if (currentRound < ROUNDS.length - 1) {
            setCurrentRound(prev => prev + 1);
            setTaps(0);
            setIsBroken(false);
          } else {
            onComplete();
          }
        }, 3000);
      }
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/20">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / {ROUNDS.length}
        </span>
      </div>

      {/* Top Area: Ice Block & Animal */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`iceblock-${currentRound}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96"
          >
            
            {/* The Frozen Animal */}
            <motion.span 
              animate={isBroken ? { scale: 1.2, y: [0, -20, 0] } : {}}
              transition={isBroken ? { duration: 0.5, repeat: 4 } : {}}
              className="text-[10rem] md:text-[14rem] drop-shadow-xl z-10"
            >
              {roundData.emoji}
            </motion.span>

            {/* The Ice Block Overlay */}
            <AnimatePresence>
              {!isBroken && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ 
                    rotate: taps > 0 ? [-5, 5, -5, 5, 0] : 0,
                    scale: taps > 0 ? [1, 1.05, 1] : 1
                  }}
                  exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  className={`
                    absolute inset-[-20%] z-20 
                    bg-[#00E5C8]/40 backdrop-blur-md 
                    border-8 border-white/50 rounded-3xl 
                    shadow-[inset_0_0_50px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.3)]
                    flex items-center justify-center
                    overflow-hidden
                  `}
                >
                  {/* Cracks appear on taps */}
                  {taps >= 1 && (
                    <svg className="absolute inset-0 w-full h-full text-white/80 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 10,10 L 40,40 L 30,70 L 60,50 L 90,80" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 80,20 L 60,40 L 80,60" fill="transparent" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      {taps >= 2 && <path d="M 20,80 L 40,60" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                    </svg>
                  )}
                  {/* Visual "Ice" texture */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                  <span className="text-[12rem] md:text-[16rem] opacity-30">🧊</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Magical Explosion when Ice Breaks */}
            <AnimatePresence>
              {isBroken && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-0 z-30 bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,transparent_70%)] pointer-events-none"
                />
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Area: Massive 3D Hammer Button */}
      <div className="w-full flex justify-center pb-12 z-20">
        <button 
          onClick={handleTap}
          disabled={isBroken}
          className={`
            bg-linear-to-tr from-purple-500 to-pink-400 
            text-white font-black text-6xl md:text-8xl 
            py-8 px-16 md:py-12 md:px-24
            rounded-[4rem] 
            border-8 border-[#FFF]
            border-b-24 border-b-purple-800 
            shadow-[0_20px_40px_rgba(128,0,128,0.4),inset_0_10px_20px_rgba(255,255,255,0.6)]
            active:border-b-8 active:translate-y-4 
            active:shadow-[0_10px_20px_rgba(128,0,128,0.4),inset_0_5px_10px_rgba(255,255,255,0.6)]
            transition-all duration-100 ease-out
            ${!isBroken ? 'animate-[bounce_2s_infinite]' : 'opacity-0 scale-50 pointer-events-none transition-all duration-500'}
          `}
        >
          <span className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">🔨</span> TAP!
        </button>
      </div>

    </div>
  );
}
