"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_3_DATA } from "./data";

const EMOJI_MAP = {
  "Bola": "⚽", "Topi": "🧢", "Sapi": "🐄",
  "Meja": "🪑", "Buku": "📚", "Kuda": "🐴",
  "Susu": "🍼", "Baju": "👕", "Tari": "💃"
};

export function GameJaringIkan({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [caughtFish, setCaughtFish] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_3_DATA.game4_JaringIkan[currentRound];

  useEffect(() => {
    if (!isSuccess && !caughtFish && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, caughtFish, speak]);

  const handleSelect = (option) => {
    if (isSuccess || caughtFish) return;

    setCaughtFish(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      speak(`Tangkap! ${option}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setCaughtFish(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      speak("Wah, bukan ikan yang itu!");
      setTimeout(() => {
        setCaughtFish(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-blue-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-cyan-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="w-full flex-1 relative max-w-5xl">
        <AnimatePresence mode="popLayout">
          {roundData.options.map((opt, i) => {
            const isCaught = caughtFish === opt;
            const isCorrect = isCaught && opt === roundData.target;
            const isWrong = isCaught && opt !== roundData.target;
            
            // Define unique swimming paths for each fish
            const startY = 100 + i * 150;
            const duration = 8 + Math.random() * 4;

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ x: i % 2 === 0 ? -300 : "100vw", y: startY, opacity: 0 }}
                animate={isCaught ? 
                  { x: "50%", y: "50%", scale: 1.5, opacity: 1, zIndex: 50, x: "-50%", y: "-50%", position: "fixed", top: "50%", left: "50%" } 
                  : { x: i % 2 === 0 ? ["-10vw", "110vw"] : ["110vw", "-10vw"], opacity: 1, y: [startY, startY - 50, startY] }
                }
                transition={isCaught ? { duration: 0.5, type: "spring" } : { 
                  x: { duration: duration, repeat: Infinity, ease: "linear", repeatType: "mirror" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                onClick={() => handleSelect(opt)}
                disabled={caughtFish !== null}
                className={`
                  absolute flex flex-col items-center justify-center
                  ${isCaught ? 'pointer-events-none' : ''}
                `}
                style={{
                  transform: i % 2 === 1 && !isCaught ? "scaleX(-1)" : "none" // Flip fish direction
                }}
              >
                {/* The Fish */}
                <div className="relative">
                  <span className="text-[6rem] md:text-[8rem] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" style={{ display: 'inline-block', transform: i % 2 === 1 && !isCaught ? "scaleX(-1)" : "none" }}>🐟</span>
                  
                  {/* The Item carried by the fish */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border-4 border-cyan-400 shadow-[0_0_15px_#22d3ee]"
                    style={{ transform: i % 2 === 1 && !isCaught ? "translate(-50%, -50%) scaleX(-1)" : "translate(-50%, -50%)" }}
                  >
                    <span className="text-4xl md:text-5xl">{EMOJI_MAP[opt] || "❓"}</span>
                  </div>
                </div>

                {/* Net effect if caught */}
                {isCorrect && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay border-4 border-green-400 rounded-full w-48 h-48 -left-12 -top-8 shadow-[0_0_50px_#4ade80]"
                  />
                )}
                {isWrong && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-8 border-red-500 rounded-full w-32 h-32 flex items-center justify-center left-4 top-4"
                  >
                     <span className="text-6xl text-red-500 font-bold">❌</span>
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
