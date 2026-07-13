"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_3_DATA } from "./data";

const EMOJI_MAP = {
  "Baju": "👕", "Buku": "📚", "Kuda": "🐴",
  "Sapi": "🐄", "Susu": "🍼", "Meja": "🪑",
  "Topi": "🧢", "Tari": "💃", "Bola": "⚽",
  "Kuku": "💅", "Mata": "👁️"
};

export function GamePenyusupLautan({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_3_DATA.game3_PenyusupLautan[currentRound];

  useEffect(() => {
    if (!isSuccess && !isError && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, speak]);

  const handleSelect = (option) => {
    if (isSuccess || isError || selectedItem) return;

    setSelectedItem(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      speak(`Benar! ${option} bunyinya beda sendiri.`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedItem(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      setIsError(true);
      speak("Itu bukan penyusupnya. Coba cari yang lain!");
      setTimeout(() => {
        setSelectedItem(null);
        setIsError(false);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-950/80 to-transparent pointer-events-none" />

      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-blue-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-cyan-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="flex-1 w-full max-w-5xl flex flex-row items-center justify-center gap-6 md:gap-16 z-20">
        <AnimatePresence mode="popLayout">
          {roundData.options.map((opt, i) => {
            const isSelected = selectedItem === opt;
            const isWrong = isSelected && isError;
            const isCorrect = isSelected && isSuccess;

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: isCorrect ? -20 : [0, 10, 0], opacity: 1 }}
                transition={{ 
                  y: { duration: 3, repeat: isCorrect ? 0 : Infinity, ease: "easeInOut", delay: i * 0.3 }
                }}
                onClick={() => handleSelect(opt)}
                disabled={selectedItem !== null}
                className={`
                  relative flex flex-col items-center justify-end pb-4
                  w-40 h-48 md:w-56 md:h-64
                  transition-all duration-300
                  ${isWrong ? 'animate-[shake_0.5s_ease-in-out]' : 'hover:scale-105'}
                `}
              >
                {/* Clamshell Top (Opens) */}
                <motion.div 
                  animate={{ rotateX: isSelected ? 80 : 20, y: isSelected ? -20 : 0 }}
                  style={{ transformOrigin: "bottom" }}
                  className="absolute top-0 w-32 h-32 md:w-48 md:h-48 z-30 flex items-center justify-center drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                >
                  <span className="text-[6rem] md:text-[8rem]">🐚</span>
                </motion.div>

                {/* The Item hidden inside */}
                <motion.div 
                  animate={{ y: isSelected ? -40 : 20, scale: isSelected ? 1.2 : 0.8 }}
                  className={`
                    relative z-20 flex flex-col items-center bg-cyan-900/50 rounded-full p-4 border-2 border-cyan-400/50 backdrop-blur-md
                    ${isCorrect ? 'bg-green-500/50 border-green-400 shadow-[0_0_50px_#4ade80]' : ''}
                    ${isWrong ? 'bg-red-500/50 border-red-400' : ''}
                  `}
                >
                  <span className="text-5xl md:text-7xl drop-shadow-lg">{EMOJI_MAP[opt] || "❓"}</span>
                  <span className="text-sm md:text-base font-bold text-white mt-2">{opt}</span>
                </motion.div>

                {/* Clamshell Bottom */}
                <div className="absolute bottom-0 w-32 h-16 md:w-48 md:h-24 bg-gradient-to-t from-orange-900 to-amber-800 rounded-b-full border-b-8 border-orange-950 z-10 opacity-80" />
                
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
