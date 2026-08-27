"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_2_DATA } from '../data';

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_2_DATA.game5_SulapKiko[currentRound];

  useEffect(() => {
    if (!isSuccess && !selectedWord && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, selectedWord, speak]);

  const handleSelectWord = (option) => {
    if (selectedWord || isSuccess) return;

    setSelectedWord(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      playSound("magic"); // Assuming there's a magic sound, otherwise it falls back safely
      speak(`Sim salabim! Jadilah ${option}!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedWord(null);
          setIsSuccess(false);
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3500);
    } else {
      speak("Wah, sulapnya gagal. Coba kata lain!");
      setTimeout(() => {
        setSelectedWord(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-purple-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Top: Kiko the Magician */}
      <div className="w-full flex flex-col items-center justify-center mt-12 relative z-20">
        <div className="relative">
          {/* Magic Hat */}
          <motion.div 
            animate={isSuccess ? { rotate: [0, -20, 20, -10, 10, 0], y: -20 } : { y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: isSuccess ? 0 : Infinity, ease: "easeInOut" }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-30"
          >
            <span className="text-[6rem] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">🎩</span>
          </motion.div>
          {/* Kiko */}
          <span className="text-7xl md:text-[10rem] drop-shadow-2xl relative z-20">🦊</span>
        </div>
        
        {/* Magic Cauldron / Workbench */}
        <div className="w-64 h-24 bg-gradient-to-b from-purple-800 to-indigo-900 rounded-[100%] border-4 border-fuchsia-400 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_10px_20px_rgba(236,72,153,0.5)] -mt-8 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-fuchsia-500/20 rounded-[100%] animate-pulse-glow blur-[10px]" />
          
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1.5, opacity: 1, y: -80 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="absolute text-5xl font-black text-white drop-shadow-[0_0_20px_#e879f9] bg-fuchsia-600 px-6 py-2 rounded-full border-4 border-white z-40"
              >
                {roundData.target}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: Magic Word Options */}
      <div className="flex-1 w-full flex items-end justify-center gap-6 md:gap-12 pb-12 z-20">
        <AnimatePresence mode="popLayout">
          {roundData.options.map((opt, i) => {
            const isSelected = selectedWord === opt;
            const isWrong = isSelected && opt !== roundData.target;
            const isCorrect = isSelected && opt === roundData.target;

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.1 : 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: i * 0.1 }}
                onClick={() => handleSelectWord(opt)}
                disabled={selectedWord !== null}
                className={`
                  relative px-8 py-6 md:px-12 md:py-8
                  bg-gradient-to-tr from-indigo-600 to-fuchsia-500
                  text-white font-black text-3xl md:text-5xl tracking-widest
                  rounded-4xl 
                  border-4 border-[#FFF]
                  border-b-12 border-b-indigo-900 
                  shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_5px_15px_rgba(255,255,255,0.4)]
                  active:border-b-4 active:translate-y-2 
                  transition-all duration-300
                  ${isWrong ? 'animate-[shake_0.5s_ease-in-out] bg-gradient-to-tr from-red-600 to-rose-500 border-b-red-900' : 'hover:-translate-y-2'}
                  ${isCorrect ? 'bg-gradient-to-tr from-green-500 to-emerald-400 border-b-green-900 shadow-[0_0_50px_#4ade80]' : ''}
                `}
              >
                <span className="drop-shadow-md">{opt}</span>
                
                {/* Magic Sparkles on Correct */}
                <AnimatePresence>
                  {isCorrect && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 2, 1.5], opacity: [0, 1, 0] }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <span className="text-6xl animate-spin">✨</span>
                      <span className="text-6xl animate-ping absolute">🌟</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
