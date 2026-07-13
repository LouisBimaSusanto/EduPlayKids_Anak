"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_5_DATA } from "./data";

const EMOJI_MAP = {
  "Susu": "🍼", "Baju": "👕", "Kuda": "🐴",
  "Topi": "🧢", "Buku": "📚", "Meja": "🪑",
  "Mata": "👁️", "Bola": "⚽", "Sapi": "🐄",
  "Tari": "💃", "Kuku": "💅"
};

export function GameTangkapFonem({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [caughtStar, setCaughtStar] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_5_DATA.game3_TangkapFonem[currentRound];

  useEffect(() => {
    if (!isSuccess && !caughtStar && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, caughtStar, speak]);

  const handleSelect = (option) => {
    if (isSuccess || caughtStar) return;

    setCaughtStar(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      playSound("magic");
      speak(`Tangkap! Benar, ${option}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setCaughtStar(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      speak("Wah, bukan bintang yang itu!");
      setTimeout(() => {
        setCaughtStar(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-indigo-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="w-full flex-1 relative max-w-5xl z-20">
        <AnimatePresence mode="popLayout">
          {roundData.options.map((opt, i) => {
            const isCaught = caughtStar === opt;
            const isCorrect = isCaught && opt === roundData.target;
            const isWrong = isCaught && opt !== roundData.target;
            
            // Trajectories for shooting stars
            const startY = -100 + i * 50;
            const duration = 6 + Math.random() * 3;
            
            // Randomize starting side based on index for shooting effect
            const startX = i % 2 === 0 ? "-20vw" : "120vw";
            const endX = i % 2 === 0 ? "120vw" : "-20vw";

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ x: startX, y: startY, opacity: 0 }}
                animate={isCaught ? 
                  { x: "50%", y: "50%", scale: 1.5, opacity: 1, zIndex: 50, position: "fixed", top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" } 
                  : { x: [startX, endX], opacity: [0, 1, 1, 0], y: [startY, startY + 300] }
                }
                transition={isCaught ? { duration: 0.5, type: "spring" } : { 
                  x: { duration: duration, repeat: Infinity, ease: "linear" },
                  y: { duration: duration, repeat: Infinity, ease: "linear" },
                  opacity: { duration: duration, repeat: Infinity, ease: "linear" }
                }}
                onClick={() => handleSelect(opt)}
                disabled={caughtStar !== null}
                className={`
                  absolute flex flex-col items-center justify-center
                  ${isCaught ? 'pointer-events-none' : ''}
                `}
              >
                {/* The Shooting Star */}
                <div className="relative flex items-center justify-center">
                  
                  {/* Star Trail */}
                  {!isCaught && (
                    <div 
                      className="absolute w-32 h-4 bg-gradient-to-r from-transparent to-yellow-200/80 rounded-full blur-[2px]"
                      style={{ 
                        transform: i % 2 === 0 ? "rotate(45deg) translate(-50px, -50px)" : "rotate(135deg) translate(-50px, 50px)" 
                      }} 
                    />
                  )}

                  <span className="text-[5rem] md:text-[7rem] drop-shadow-[0_0_20px_#fef08a] z-10">🌟</span>
                  
                  {/* The Item carried by the star */}
                  <div className="absolute z-20 bg-indigo-900/80 backdrop-blur-sm rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border-4 border-fuchsia-400 shadow-[0_0_15px_#d946ef]">
                    <span className="text-4xl md:text-5xl">{EMOJI_MAP[opt] || "❓"}</span>
                  </div>
                </div>

                {/* Explosion effect if caught */}
                {isCorrect && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 3 }}
                    className="absolute inset-0 border-[8px] border-yellow-300 rounded-full w-32 h-32 flex items-center justify-center left-0 top-0 shadow-[0_0_50px_#fde047]"
                  />
                )}
                {isWrong && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-[8px] border-red-500 bg-red-500/50 rounded-full w-32 h-32 flex items-center justify-center left-0 top-0 backdrop-blur-sm"
                  >
                     <span className="text-6xl text-white font-bold">❌</span>
                  </motion.div>
                )}

              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
