"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_3_DATA } from "./data";

const EMOJI_MAP = {
  "Baju": "👕", "Sapi": "🐄", "Buku": "📚", "Meja": "🪑",
  "Mata": "👁️", "Topi": "🧢", "Kuda": "🐴", "Susu": "🍼",
  "Tari": "💃", "Kuku": "💅", "Bata": "🧱", "Bola": "⚽"
};

export function GamePulauSama({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_3_DATA.game2_PulauSama[currentRound];

  useEffect(() => {
    if (!isSuccess && !isError && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, speak]);

  const handleSelect = (option) => {
    if (isSuccess || isError || selectedItems.includes(option)) return;

    playSound("bloop");
    const newSelection = [...selectedItems, option];
    setSelectedItems(newSelection);

    if (newSelection.length === 2) {
      const isCorrect = newSelection.every(sel => roundData.target.includes(sel)) &&
                        roundData.target.every(targ => newSelection.includes(targ));
      
      if (isCorrect) {
        setIsSuccess(true);
        speak("Hebat! Keduanya punya bunyi yang sama!");
        
        setTimeout(() => {
          if (currentRound < 4) {
            setCurrentRound(prev => prev + 1);
            setSelectedItems([]);
            setIsSuccess(false);
          } else {
            onComplete();
          }
        }, 3000);
      } else {
        setIsError(true);
        speak("Ups, ada yang salah. Coba periksa lagi bunyinya!");
        setTimeout(() => {
          setSelectedItems([]);
          setIsError(false);
        }, 2000);
      }
    } else {
      speak(option);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay" />

      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-teal-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-cyan-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center relative z-20">
        <div className="grid grid-cols-2 gap-8 md:gap-16 w-full place-items-center">
          <AnimatePresence mode="wait">
            {roundData.options.map((opt, i) => {
              const isSelected = selectedItems.includes(opt);
              const isWrong = isError && isSelected && !roundData.target.includes(opt);
              const isCorrect = isSuccess && isSelected;

              return (
                <motion.button
                  key={`${currentRound}-${opt}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: isSelected ? -20 : [0, 10, 0], opacity: 1 }}
                  transition={{ 
                    y: { duration: 3, repeat: isSelected ? 0 : Infinity, ease: "easeInOut", delay: i * 0.3 }
                  }}
                  onClick={() => handleSelect(opt)}
                  className={`
                    relative flex flex-col items-center justify-end pb-8
                    w-48 h-48 md:w-64 md:h-64
                    rounded-full
                    bg-gradient-to-t from-teal-900 to-emerald-700
                    border-b-[16px] border-b-teal-950 border-[4px] border-teal-500
                    shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                    transition-all duration-300
                    ${isSelected ? 'shadow-[0_0_50px_#2dd4bf] border-cyan-300 scale-105' : 'hover:-translate-y-4'}
                    ${isWrong ? 'animate-shake border-red-500 shadow-[0_0_40px_#ef4444]' : ''}
                    ${isCorrect ? 'bg-gradient-to-t from-green-600 to-emerald-400 shadow-[0_0_80px_#4ade80]' : ''}
                  `}
                >
                  {/* Glowing Coral Element */}
                  <div className={`absolute -bottom-2 -left-2 text-5xl opacity-80 ${isSelected ? 'animate-pulse' : ''}`}>🪸</div>
                  <div className={`absolute -bottom-2 -right-2 text-4xl opacity-80 ${isSelected ? 'animate-pulse' : ''}`}>🌿</div>
                  
                  {/* The Item */}
                  <motion.div 
                    animate={isSelected ? { y: -20, scale: 1.2 } : { y: 0, scale: 1 }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <span className="text-6xl md:text-[6rem] drop-shadow-2xl">{EMOJI_MAP[opt] || "❓"}</span>
                    <span className="mt-4 text-xl font-bold text-white bg-black/50 px-4 py-1 rounded-full">{opt}</span>
                  </motion.div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
