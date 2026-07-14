"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";
import { LEVEL_2_DATA } from "./data";

const EMOJI_MAP = {
  "Bola": "⚽", "Kola": "🥤", "Meja": "🪑",
  "Sapi": "🐄", "Topi": "🧢", "Buku": "📚",
  "Mata": "👁️", "Bata": "🧱", "Baju": "👕",
  "Jari": "🖐️", "Tari": "💃", "Kuda": "🐴",
  "Kuku": "💅"
};

export function GameKembarRima({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedBubbles, setSelectedBubbles] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { speak } = useTTS();

  const roundData = LEVEL_2_DATA.game1_KembarRima[currentRound];

  useEffect(() => {
    if (!isSuccess && !isError && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, speak]);

  const handleSelect = (option) => {
    if (isSuccess || isError || selectedBubbles.includes(option)) return;

    const newSelection = [...selectedBubbles, option];
    setSelectedBubbles(newSelection);

    if (newSelection.length === 2) {
      // Check if both targets are selected
      const isCorrect = newSelection.every(sel => roundData.target.includes(sel)) &&
                        roundData.target.every(targ => newSelection.includes(targ));
      
      if (isCorrect) {
        setIsSuccess(true);
        speak("Wah keren! Rima nya kembar!");
        
        setTimeout(() => {
          if (currentRound < 4) {
            setCurrentRound(prev => prev + 1);
            setSelectedBubbles([]);
            setIsSuccess(false);
          } else {
            onComplete();
          }
        }, 3000);
      } else {
        setIsError(true);
        speak("Ups, bunyinya beda. Coba lagi!");
        setTimeout(() => {
          setSelectedBubbles([]);
          setIsError(false);
        }, 1500);
      }
    } else {
      speak(option);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-purple-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="w-full max-w-4xl flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key={`bubbles-${currentRound}`}
              className="flex flex-row justify-center items-center gap-8 md:gap-16 w-full"
            >
              {roundData.options.map((opt, i) => {
                const isSelected = selectedBubbles.includes(opt);
                return (
                  <motion.button
                    key={`${currentRound}-${opt}`}
                    initial={{ y: 200, opacity: 0, scale: 0.5 }}
                    animate={{ 
                      y: isSelected ? -50 : [0, -15, 0], 
                      opacity: 1, 
                      scale: isSelected ? 1.1 : 1 
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      y: { duration: isSelected ? 0.3 : 2, repeat: isSelected ? 0 : Infinity, ease: "easeInOut", delay: isSelected ? 0 : i * 0.2 },
                      scale: { type: "spring", bounce: 0.5 },
                      opacity: { duration: 0.5, delay: i * 0.1 }
                    }}
                    onClick={() => handleSelect(opt)}
                    className={`
                      relative rounded-full flex flex-col items-center justify-center
                      w-40 h-40 md:w-56 md:h-56
                      border-[6px] 
                      ${isSelected ? 'bg-fuchsia-400 border-white shadow-[0_0_50px_#e879f9]' : 'bg-purple-800/80 border-purple-300 shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] backdrop-blur-sm'}
                      ${isError && isSelected ? 'bg-red-500 animate-shake' : ''}
                      transition-colors duration-300
                    `}
                  >
                    {/* Bubble Highlight */}
                    <div className="absolute top-4 right-6 w-8 h-8 bg-white/40 rounded-full blur-[2px]" />
                    <span className="text-7xl md:text-[6rem] drop-shadow-lg">{EMOJI_MAP[opt] || "❓"}</span>
                    <span className="mt-2 text-xl font-bold text-white drop-shadow-md bg-black/30 px-4 py-1 rounded-full">{opt}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="success-merge"
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.5, 1.2], opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5, times: [0, 0.5, 1] }}
                className="w-64 h-64 md:w-96 md:h-96 bg-green-400 rounded-full border-8 border-white shadow-[0_0_80px_#4ade80] flex flex-row items-center justify-center gap-4"
              >
                <div className="absolute top-8 right-12 w-16 h-16 bg-white/40 rounded-full blur-xs" />
                <span className="text-[6rem] md:text-[8rem] drop-shadow-xl">{EMOJI_MAP[roundData.target[0]]}</span>
                <span className="text-[6rem] md:text-[8rem] drop-shadow-xl">{EMOJI_MAP[roundData.target[1]]}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
