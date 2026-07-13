"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_4_DATA } from "./data";

const EMOJI_MAP = {
  "Baju": "👕", "Api": "🔥", "Topi": "🧢",
  "Ibu": "👩", "Sapi": "🐄"
};

export function GameMesinMembongkar({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_4_DATA.game2_MesinMembongkar[currentRound];

  useEffect(() => {
    if (!isSuccess && !isError && roundData && tapCount === 0) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, tapCount, speak]);

  const handleTap = () => {
    if (isSuccess || isError) return;

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    playSound("bloop"); // Ideal: glass ting or hammer tap sound

    // Logic: If they reach the exact target, wait slightly to see if they tap again.
    // However, for kids, it's safer to just validate after a short delay of no tapping.
    // Let's implement a timeout logic for validation.
  };

  useEffect(() => {
    if (tapCount > 0 && !isSuccess && !isError) {
      const timeout = setTimeout(() => {
        validateTaps();
      }, 1500); // Wait 1.5s after last tap to validate
      return () => clearTimeout(timeout);
    }
  }, [tapCount, isSuccess, isError]);

  const validateTaps = () => {
    if (tapCount === roundData.target) {
      setIsSuccess(true);
      playSound("magic"); // Ideal: glass shatter sound
      speak(`Hebat! Ada ${tapCount} bunyi!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setTapCount(0);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      setIsError(true);
      speak(`Tetoot. Bunyinya ada ${roundData.target}. Kita coba lagi ya!`);
      
      setTimeout(() => {
        setTapCount(0);
        setIsError(false);
      }, 3000);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-orange-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-yellow-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Main Glass Orb Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-20">
        
        {/* The Glass Orb Base (Anvil) */}
        <div className="absolute bottom-1/4 w-64 h-32 bg-gradient-to-t from-gray-900 to-gray-700 rounded-[100%] border-b-[16px] border-b-black shadow-[0_30px_50px_rgba(0,0,0,0.8)] z-10" />

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key={`orb-${currentRound}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }} // Shatter effect substitute
              className="relative z-20 mb-16 flex items-center justify-center"
            >
              {/* Glass Orb */}
              <motion.div 
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : { scale: 1 + (tapCount * 0.05) }}
                transition={isError ? { duration: 0.5 } : { type: "spring" }}
                className={`
                  w-64 h-64 md:w-80 md:h-80 rounded-full 
                  bg-gradient-to-tr from-cyan-400/30 to-white/60
                  border-[8px] border-white/50 backdrop-blur-md
                  shadow-[0_0_50px_rgba(255,255,255,0.5),_inset_0_0_30px_rgba(255,255,255,0.8)]
                  flex items-center justify-center relative overflow-hidden
                  ${isError ? 'bg-red-500/30 border-red-500' : ''}
                `}
              >
                {/* Highlight curve */}
                <div className="absolute top-4 right-8 w-20 h-10 bg-white/80 rounded-full blur-[4px] -rotate-12" />
                
                {/* The Item inside */}
                <span className="text-[6rem] md:text-[8rem] drop-shadow-xl opacity-90">{EMOJI_MAP[roundData.image]}</span>
                
                {/* Crack lines based on tap count */}
                {tapCount > 0 && (
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cracked-earth.png')] mix-blend-overlay opacity-50" />
                )}
              </motion.div>
            </motion.div>
          ) : (
            // Shattered state
            <motion.div
              key="shattered"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="relative z-20 mb-16 flex items-center justify-center"
            >
              <span className="text-[8rem] md:text-[10rem] drop-shadow-[0_0_50px_#fde047]">{EMOJI_MAP[roundData.image]}</span>
              {/* Particle effects for shattered glass could be added here */}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* The Giant Hammer Button */}
      <div className="w-full flex items-center justify-center pb-12 z-30">
        <motion.button
          whileTap={{ scale: 0.9, rotate: -20 }}
          onClick={handleTap}
          disabled={isSuccess || isError}
          className="
            relative w-48 h-48 md:w-64 md:h-64
            bg-gradient-to-t from-zinc-800 to-zinc-500
            rounded-full border-[12px] border-zinc-900
            shadow-[0_20px_40px_rgba(0,0,0,0.8),_inset_0_10px_20px_rgba(255,255,255,0.3)]
            flex flex-col items-center justify-center gap-2
          "
        >
          <span className="text-6xl md:text-[5rem] drop-shadow-xl -rotate-45 -translate-y-4">🔨</span>
          <div className="absolute bottom-6 bg-red-600 px-6 py-2 rounded-full border-4 border-red-900 shadow-lg">
            <span className="text-2xl font-black text-white">{tapCount}</span>
          </div>
        </motion.button>
      </div>

    </div>
  );
}
