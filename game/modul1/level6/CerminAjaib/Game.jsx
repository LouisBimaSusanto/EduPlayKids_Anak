"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_6_DATA } from '../data';

const EMOJI_MAP = {
  "Baju": "👕", "Buku": "📚", "Sapi": "🐄",
  "Topi": "🧢", "Tari": "💃", "Kuda": "🐴",
  "Meja": "🪑", "Mata": "👁️", "Bola": "⚽",
  "Kuku": "💅", "Susu": "🍼"
};

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_6_DATA.game3_CerminAjaib[currentRound];

  useEffect(() => {
    if (gameState === "idle" && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
        setGameState("selecting");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, gameState, speak]);

  const handleSelect = (option) => {
    if (gameState !== "selecting") return;
    
    setSelectedOption(option);
    
    if (option === roundData.target) {
      setGameState("success");
      playSound("magic");
      speak(`Benar sekali! ${option} bunyinya beda sendiri!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setGameState("idle");
          setSelectedOption(null);
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3500);
    } else {
      setGameState("error");
      speak("Wah, cermin ini bunyinya sama. Cari yang aneh!");
      
      setTimeout(() => {
        setGameState("selecting");
        setSelectedOption(null);
      }, 2000);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-amber-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-yellow-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="mb-12 z-20">
         <h2 className="text-3xl md:text-5xl font-black text-amber-900 drop-shadow-md text-center bg-white/50 px-8 py-4 rounded-full border-4 border-white">
           Mana cermin yang aneh? 🪞
         </h2>
      </div>

      {/* The 3 Golden Mirrors */}
      <div className="w-full flex flex-row flex-wrap items-center justify-center gap-8 md:gap-16 relative z-20">
        <AnimatePresence>
          {roundData.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isWrong = gameState === "error" && isSelected;
            const isCorrect = gameState === "success" && isSelected;

            return (
              <motion.button
                key={`mirror-${currentRound}-${opt}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, type: "spring", bounce: 0.5 }}
                onClick={() => handleSelect(opt)}
                disabled={gameState !== "selecting"}
                className="relative group outline-none"
              >
                <motion.div
                  animate={
                    isCorrect ? { rotateY: 720, scale: 1.2 } : 
                    isWrong ? { rotate: [0, -10, 10, -10, 10, 0] } : 
                    { rotateY: 0, scale: 1 }
                  }
                  transition={{ duration: isCorrect ? 2 : 0.5 }}
                  className={`
                    w-48 h-64 md:w-56 md:h-80
                    rounded-t-[50%] rounded-b-xl
                    border-[12px] border-amber-500
                    shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                    relative flex items-center justify-center overflow-hidden
                    bg-gradient-to-tr from-blue-100 via-white to-blue-50
                    ${isCorrect ? 'border-yellow-300 shadow-[0_0_80px_rgba(255,255,255,1)] ring-8 ring-yellow-200 z-50' : 'group-hover:-translate-y-4 transition-transform'}
                    ${isWrong ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.8)]' : ''}
                  `}
                >
                  {/* Mirror Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent pointer-events-none transform -skew-x-12" />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.8)_45%,rgba(255,255,255,0.8)_55%,transparent_60%)] bg-[length:300%_300%] animate-[shimmer_4s_infinite] pointer-events-none" />

                  {/* Mirror Frame details */}
                  <div className="absolute inset-0 border-4 border-amber-300 rounded-t-[50%] rounded-b-xl pointer-events-none mix-blend-overlay" />

                  {/* Content inside mirror */}
                  {(!isCorrect || (isCorrect && gameState === "success")) && (
                    <div className="flex flex-col items-center z-10">
                      <span className="text-[6rem] md:text-6xl md:text-[8rem] drop-shadow-2xl">{EMOJI_MAP[opt] || "❓"}</span>
                      {isCorrect && (
                         <span className="mt-4 font-black text-2xl text-amber-900 bg-white/80 px-4 py-1 rounded-full">{opt}</span>
                      )}
                    </div>
                  )}

                  {/* Crack effect if wrong */}
                  {isWrong && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-red-600 z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 50,0 L 45,30 L 60,50 L 40,70 L 45,100" fill="none" strokeWidth="2" />
                      <path d="M 60,50 L 80,60" fill="none" strokeWidth="2" />
                      <path d="M 45,30 L 20,40" fill="none" strokeWidth="2" />
                    </svg>
                  )}

                </motion.div>

                {/* Mirror Base/Stand */}
                <div className="w-24 h-8 bg-amber-600 rounded-t-lg mx-auto mt-2 border-b-8 border-amber-800 relative shadow-lg">
                  <div className="absolute top-0 w-full h-2 bg-amber-400 rounded-t-lg" />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
