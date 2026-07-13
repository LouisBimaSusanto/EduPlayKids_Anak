"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_6_DATA } from "./data";

const EMOJI_MAP = {
  "Maju": "🚶‍♂️", "Laju": "🚀", "Saju": "🧊",
  "Muda": "🌱", "Suda": "✅", "Buda": "🧘",
  "Jari": "🖐️", "Mari": "🏃", "Lari": "🏃‍♂️",
  "Mata": "👁️", "Rata": "📏", "Tata": "👩‍🍳",
  "Bola": "⚽", "Kola": "🥤", "Jola": "🐟"
};

export function GamePenyihirKata({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, transforming, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_6_DATA.game4_PenyihirKata[currentRound];
  // Parse: "Baju. Ganti /b/ dengan /m/."
  const originalWord = roundData?.audio.split(".")[0];
  const oldPhoneme = roundData?.audio.match(/Ganti \/(.*?)\//)?.[1] || "?";
  const newPhoneme = roundData?.audio.match(/dengan \/(.*?)\//)?.[1] || "?";
  const restOfWord = originalWord ? originalWord.slice(1).toLowerCase() : "";

  useEffect(() => {
    if (gameState === "idle" && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      
      const transformTimer = setTimeout(() => {
        setGameState("transforming");
        playSound("magic");
      }, 3500);

      return () => {
        clearTimeout(timer);
        clearTimeout(transformTimer);
      };
    }
  }, [currentRound, roundData, gameState, speak]);

  useEffect(() => {
    if (gameState === "transforming") {
      const timer = setTimeout(() => {
        setGameState("selecting");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleSelect = (option) => {
    if (gameState !== "selecting") return;
    
    setSelectedOption(option);
    
    if (option === roundData.target) {
      setGameState("success");
      playSound("magic"); // Twinkle sound
      speak(`Ajaib! Menjadi ${option}!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setGameState("idle");
          setSelectedOption(null);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      setGameState("error");
      speak("Wah, mantranya salah. Coba lagi!");
      
      setTimeout(() => {
        setGameState("selecting");
        setSelectedOption(null);
      }, 2000);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-amber-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-yellow-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Top: The Magic Spell Book */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-20 mt-12">
        
        <div className="relative w-full max-w-2xl aspect-[2/1] perspective-[1500px]">
          <motion.div 
            animate={gameState === "success" ? { scale: 1.1, rotateX: 10 } : { scale: 1, rotateX: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex"
            style={{ transformStyle: 'preserve-3d' }}
          >
             {/* Left Page */}
             <div className="w-1/2 h-full bg-[#f4e4bc] border-8 border-amber-900 rounded-l-3xl shadow-[inset_-20px_0_30px_rgba(0,0,0,0.1),_0_30px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative transform origin-right">
               {/* Binding line */}
               <div className="absolute right-0 h-full w-4 bg-gradient-to-r from-transparent to-black/20" />
               <span className="text-8xl drop-shadow-lg opacity-50 absolute top-4 left-4">✨</span>
               
               {/* Content: Old Word */}
               <div className="flex items-center gap-1 z-10 p-4">
                  <div className="w-20 h-24 bg-amber-950/20 rounded-xl flex items-center justify-center border-2 border-amber-900/50 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {(gameState === "idle" || gameState === "transforming") && (
                        <motion.span 
                          key="old-phoneme"
                          exit={{ y: -50, opacity: 0, scale: 0.5 }}
                          className="text-[4rem] font-black text-amber-900 uppercase"
                        >
                          {oldPhoneme}
                        </motion.span>
                      )}
                      {(gameState === "selecting" || gameState === "success" || gameState === "error") && (
                        <motion.span 
                          key="new-phoneme"
                          initial={{ y: 50, opacity: 0, scale: 0.5 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          className="text-[4rem] font-black text-fuchsia-700 uppercase"
                        >
                          {newPhoneme}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Magic Sparkles */}
                    {gameState === "transforming" && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-yellow-200/80 mix-blend-overlay flex items-center justify-center"
                      >
                         <span className="text-4xl animate-[spin_1s_linear_infinite]">✨</span>
                      </motion.div>
                    )}
                  </div>
                  
                  <span className="text-[4rem] font-black text-amber-900 uppercase tracking-widest">{restOfWord}</span>
               </div>
               
             </div>

             {/* Right Page */}
             <div className="w-1/2 h-full bg-[#fdf3d8] border-8 border-l-0 border-amber-900 rounded-r-3xl shadow-[inset_20px_0_30px_rgba(0,0,0,0.05),_0_30px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative origin-left">
               <div className="absolute left-0 h-full w-4 bg-gradient-to-l from-transparent to-black/20" />
               <span className="text-8xl drop-shadow-lg opacity-50 absolute bottom-4 right-4">🪄</span>
               
               {/* Content: Arrow and Result Indicator */}
               <div className="flex flex-col items-center">
                 <motion.div 
                   animate={gameState === "transforming" ? { x: [0, 20, 0] } : {}}
                   transition={{ duration: 0.5, repeat: gameState === "transforming" ? Infinity : 0 }}
                   className="text-6xl text-amber-600 font-black mb-4"
                 >
                   ➔
                 </motion.div>
                 
                 <div className="w-40 h-40 border-8 border-dashed border-amber-400/50 rounded-2xl flex items-center justify-center bg-white/50">
                    <AnimatePresence>
                      {gameState === "success" && (
                        <motion.span 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring" }}
                          className="text-[6rem] drop-shadow-2xl"
                        >
                          {EMOJI_MAP[roundData.target]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {(gameState === "selecting" || gameState === "error") && (
                      <span className="text-6xl text-amber-300 font-bold">?</span>
                    )}
                 </div>
               </div>
             </div>

             {/* Book Cover edges */}
             <div className="absolute -bottom-4 w-full h-4 bg-amber-950 rounded-b-xl z-[-1]" />
          </motion.div>
        </div>
      </div>

      {/* Bottom: Options Selection */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-16 pb-12 z-20">
        <AnimatePresence>
          {(gameState === "selecting" || gameState === "success" || gameState === "error") && (
            roundData.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isWrong = gameState === "error" && isSelected;
              const isCorrect = gameState === "success" && isSelected;

              return (
                <motion.button
                  key={`opt-${currentRound}-${opt}`}
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.2 : 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  onClick={() => handleSelect(opt)}
                  disabled={gameState !== "selecting"}
                  className={`
                    w-40 h-48 md:w-56 md:h-64
                    bg-gradient-to-b from-purple-800 to-indigo-950
                    rounded-[3rem] border-b-[12px] border-b-black border-[4px] border-fuchsia-400
                    shadow-[0_20px_40px_rgba(0,0,0,0.8)]
                    flex flex-col items-center justify-center gap-4
                    transition-all duration-300
                    ${isWrong ? 'animate-[shake_0.5s_ease-in-out] border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] bg-red-900' : 'hover:-translate-y-4'}
                    ${isCorrect ? 'border-yellow-400 shadow-[0_0_80px_rgba(255,215,0,1)] z-50 bg-gradient-to-b from-yellow-500 to-amber-700' : ''}
                  `}
                >
                  <span className="text-6xl md:text-[6rem] drop-shadow-xl">{EMOJI_MAP[opt] || "❓"}</span>
                  <span className="font-black text-2xl md:text-3xl text-white tracking-wider uppercase">{opt}</span>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
