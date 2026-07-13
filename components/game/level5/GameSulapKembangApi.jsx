"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_5_DATA } from "./data";

const EMOJI_MAP = {
  "Kuku": "💅", "Suku": "🛖", "Duku": "🍈",
  "Bola": "⚽", "Kola": "🥤", "Mola": "🐟",
  "Bata": "🧱", "Rata": "📏", "Tata": "👩‍🍳",
  "Tari": "💃", "Cari": "🔍", "Mari": "🏃",
  "Basi": "🤢", "Sasi": "🌙", "Masi": "⏳"
};

export function GameSulapKembangApi({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, transforming, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_5_DATA.game5_SulapKembangApi[currentRound];
  // Parse: "Buku. Ganti /b/ dengan /k/."
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
      }, 3500); // Trigger transform after audio

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
      playSound("magic"); // Should be firework explosion!
      speak(`Luar Biasa! Berubah jadi ${option}!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setGameState("idle");
          setSelectedOption(null);
        } else {
          onComplete();
        }
      }, 4000); // Longer delay to enjoy fireworks
    } else {
      setGameState("error");
      speak("Wah, bukan itu sulapnya. Coba lagi!");
      
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
      <div className="absolute top-8 left-8 z-30 bg-indigo-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Top: The Magical Sky Transformation */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-20">
        
        <div className="relative bg-slate-900/80 backdrop-blur-md p-12 rounded-[4rem] border-[8px] border-indigo-500 shadow-[0_0_50px_rgba(192,132,252,0.6)] flex items-center gap-2">
          
          {/* First Letter Box */}
          <div className="w-24 h-32 md:w-32 md:h-40 bg-indigo-950 border-4 border-fuchsia-500 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(217,70,239,0.5)]">
            <AnimatePresence mode="wait">
              {(gameState === "idle" || gameState === "transforming") && (
                <motion.span 
                  key="old-phoneme"
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl md:text-[5rem] font-black text-white uppercase"
                >
                  {oldPhoneme}
                </motion.span>
              )}
              {(gameState === "selecting" || gameState === "success" || gameState === "error") && (
                <motion.span 
                  key="new-phoneme"
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="text-6xl md:text-[5rem] font-black text-fuchsia-400 uppercase"
                >
                  {newPhoneme}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Sparkle effect during transformation */}
            {gameState === "transforming" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 2 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white blur-[10px]"
              />
            )}
          </div>

          {/* Rest of the word */}
          <div className="flex items-center justify-center px-4">
            <span className="text-6xl md:text-[5rem] font-black text-slate-300 uppercase tracking-widest">
              {restOfWord}
            </span>
          </div>

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
                    bg-gradient-to-b from-indigo-800 to-indigo-950
                    rounded-[3rem] border-b-[12px] border-b-black border-[4px] border-indigo-400
                    shadow-[0_20px_40px_rgba(0,0,0,0.8)]
                    flex flex-col items-center justify-center gap-4
                    transition-all duration-300
                    ${isWrong ? 'animate-[shake_0.5s_ease-in-out] border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'hover:-translate-y-4'}
                    ${isCorrect ? 'border-fuchsia-400 shadow-[0_0_80px_rgba(217,70,239,1)] z-50' : ''}
                  `}
                >
                  <span className="text-6xl md:text-[6rem] drop-shadow-xl">{EMOJI_MAP[opt] || "❓"}</span>
                  <span className="font-black text-xl md:text-3xl text-white tracking-wider uppercase">{opt}</span>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* HUGE CSS FIREWORKS EFFECT FOR SUCCESS */}
      <AnimatePresence>
        {gameState === "success" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
             {/* Central Burst */}
             <div className="absolute top-1/4 left-1/4 text-[15rem] animate-[ping_1s_ease-out_forwards]">🎆</div>
             <div className="absolute top-1/3 right-1/4 text-[12rem] animate-[ping_1.2s_ease-out_forwards] animation-delay-200">🎇</div>
             <div className="absolute bottom-1/3 left-1/3 text-[18rem] animate-[ping_1.5s_ease-out_forwards] animation-delay-500">🎆</div>
             
             {/* Giant screen flash */}
             <motion.div 
               animate={{ opacity: [0, 0.5, 0] }}
               transition={{ duration: 0.5 }}
               className="absolute inset-0 bg-fuchsia-500 mix-blend-overlay"
             />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
