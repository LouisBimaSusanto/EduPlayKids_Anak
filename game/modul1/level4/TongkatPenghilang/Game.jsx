"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_4_DATA } from '../data';

const EMOJI_MAP = {
  "Bola": "⚽", "Sapi": "🐄", "Batu": "🪨",
  "Kuda": "🐴", "Tari": "💃"
};

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isZapped, setIsZapped] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_4_DATA.game3_TongkatPenghilang[currentRound];
  // Extracting base word from audio string assuming format "Word. Hilangkan..."
  const baseWord = roundData?.audio.split(".")[0];
  const phonemeToRemove = roundData?.audio.match(/\/(.*?)\//)?.[0] || "/?/";

  useEffect(() => {
    if (!isSuccess && !selectedOption && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, selectedOption, speak]);

  const handleZap = () => {
    if (isZapped) return;
    setIsZapped(true);
    playSound("magic");
  };

  const handleSelect = (option) => {
    if (selectedOption || !isZapped) return;
    setSelectedOption(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      speak(`Benar sekali! Menjadi ${option}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedOption(null);
          setIsZapped(false);
          setIsSuccess(false);
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3500);
    } else {
      speak("Wah, bukan yang itu. Coba lagi!");
      setTimeout(() => {
        setSelectedOption(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-orange-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-yellow-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center mt-12 relative z-20">
        
        <div className="flex flex-row items-center justify-center gap-16 mb-16">
          {/* Kiko holding wand */}
          <div className="relative">
            <span className="text-7xl md:text-[10rem] drop-shadow-2xl">🦊</span>
            <motion.button 
              animate={isZapped ? { rotate: [0, -45, 0] } : { y: [0, -10, 0] }}
              transition={isZapped ? { duration: 0.5 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleZap}
              className="absolute -right-8 top-12 text-[6rem] drop-shadow-[0_0_20px_#fef08a] cursor-pointer hover:scale-110 active:scale-95 origin-bottom-left"
            >
              🪄
            </motion.button>
            {/* Instruction bubble before zapping */}
            {!isZapped && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-16 -right-16 bg-white px-4 py-2 rounded-2xl border-4 border-yellow-400 shadow-xl"
              >
                <span className="font-bold text-slate-800">Pukul hurufnya!</span>
              </motion.div>
            )}
          </div>

          {/* The Target Image and Floating Phoneme */}
          <div className="relative bg-black/20 p-8 rounded-full border-4 border-orange-500/50 flex flex-row items-center gap-4 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <span className="text-6xl md:text-[8rem] drop-shadow-lg">{EMOJI_MAP[baseWord] || "❓"}</span>
            
            <AnimatePresence>
              {!isZapped ? (
                <motion.div 
                  exit={{ scale: 3, opacity: 0, rotate: 180, x: 200, y: -200 }}
                  transition={{ duration: 0.8 }}
                  className="bg-red-500 border-4 border-white text-white font-black text-5xl px-4 py-2 rounded-xl shadow-[0_0_20px_#ef4444]"
                >
                  {phonemeToRemove}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [0, 1.5, 1] }}
                  className="text-6xl absolute right-12 top-0"
                >
                  ✨
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Options */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-12 pb-12 z-20">
        <AnimatePresence>
          {isZapped && roundData.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrect = isSelected && opt === roundData.target;
            const isWrong = isSelected && opt !== roundData.target;

            return (
              <motion.button
                key={`opt-${currentRound}-${opt}`}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.1 : 1 }}
                transition={{ type: "spring", delay: i * 0.1 }}
                onClick={() => handleSelect(opt)}
                disabled={selectedOption !== null}
                className={`
                  px-8 py-6 md:px-12 md:py-10
                  bg-gradient-to-t from-yellow-600 to-amber-400
                  rounded-3xl border-b-[12px] border-b-yellow-800 border-[4px] border-white
                  shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                  font-black text-4xl md:text-5xl text-white tracking-wider
                  transition-all duration-300
                  ${isWrong ? 'animate-shake bg-gradient-to-t from-red-600 to-red-400 border-b-red-900 border-red-200' : 'hover:-translate-y-2'}
                  ${isCorrect ? 'bg-gradient-to-t from-green-500 to-emerald-400 border-b-green-800 border-green-200 shadow-[0_0_50px_#4ade80]' : ''}
                `}
              >
                <span className="drop-shadow-md">{opt}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
