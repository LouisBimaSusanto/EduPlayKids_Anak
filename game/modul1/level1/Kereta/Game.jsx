"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";

const ROUNDS = [
  { id: 1, word: "Baju", targetEmoji: "👕", instruction: "Ba ... Ju. Baju! Yang mana baju?", options: [{ id: "buku", emoji: "📚" }, { id: "baju", emoji: "👕", correct: true }, { id: "bola", emoji: "⚽" }] },
  { id: 2, word: "Topi", targetEmoji: "🧢", instruction: "To ... Pi. Topi! Yang mana topi?", options: [{ id: "sepatu", emoji: "👞" }, { id: "topi", emoji: "🧢", correct: true }, { id: "kacamata", emoji: "🕶️" }] },
  { id: 3, word: "Buku", targetEmoji: "📚", instruction: "Bu ... Ku. Buku! Yang mana buku?", options: [{ id: "buku", emoji: "📚", correct: true }, { id: "pensil", emoji: "✏️" }, { id: "tas", emoji: "🎒" }] },
  { id: 4, word: "Bola", targetEmoji: "⚽", instruction: "Bo ... La. Bola! Yang mana bola?", options: [{ id: "boneka", emoji: "🧸" }, { id: "mobil", emoji: "🚗" }, { id: "bola", emoji: "⚽", correct: true }] },
  { id: 5, word: "Roti", targetEmoji: "🍞", instruction: "Ro ... Ti. Roti! Yang mana roti?", options: [{ id: "roti", emoji: "🍞", correct: true }, { id: "susu", emoji: "🍼" }, { id: "keju", emoji: "🧀" }] }
];

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();

  const roundData = ROUNDS[currentRound];

  useEffect(() => {
    // Mount instruction
    if (!isSuccess && roundData) {
      // Delay instruction slightly to allow train to enter
      const timer = setTimeout(() => {
        speak(roundData.instruction);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, speak]);

  const handleSelect = (option) => {
    if (selectedItem || isSuccess) return;

    setSelectedItem(option.id);

    if (option.correct) {
      setIsSuccess(true);
      speak(`Pintar! Itu ${roundData.word}!`);
      
      setTimeout(() => {
        speak("Kereta berangkat! Tuuuut tuuuut!");
        
        setTimeout(() => {
          if (currentRound < ROUNDS.length - 1) {
            setCurrentRound(prev => prev + 1);
            setSelectedItem(null);
            setIsSuccess(false);
          } else {
            onComplete({ completed: true, score: 100 });
          }
        }, 3000); // Wait for train to exit
      }, 2000); // Wait for item to jump in
    } else {
      speak("Oh oh, coba lagi!");
      setTimeout(() => {
        setSelectedItem(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-600 to-emerald-400">
        
        {/* Progress Info */}
        <div className="absolute top-8 left-8 z-30 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/20">
          <span className="text-2xl font-black text-white">
            {currentRound + 1} / {ROUNDS.length}
          </span>
        </div>

      {/* Top Area: Train & Empty Box */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`train-${currentRound}`}
            initial={{ x: -1500 }}
            animate={isSuccess ? { x: 1500 } : { x: 0 }}
            exit={{ x: 1500 }}
            transition={{ 
              duration: isSuccess ? 2 : 1, 
              ease: isSuccess ? "easeIn" : "easeOut", 
              delay: isSuccess ? 2.5 : 0 
            }}
            className="relative flex items-center"
          >
            <span className="text-7xl md:text-[18rem] drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] z-20">
              🚂
            </span>
            {/* Cargo Box */}
            <div className="w-64 h-64 border-[12px] border-dashed border-[#FFD700] rounded-[3rem] bg-black/40 shadow-[inset_0_0_50px_rgba(255,215,0,0.3)] ml-4 flex items-center justify-center relative overflow-hidden">
               {/* Drop target highlight */}
               <div className="absolute inset-0 bg-[#FFD700]/20 animate-[pulse-glow_2s_infinite]" />
               
               {/* Show the selected item inside the box if correct */}
               <AnimatePresence>
                 {isSuccess && (
                   <motion.span 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ type: "spring", bounce: 0.6 }}
                     className="text-7xl md:text-[10rem] drop-shadow-xl z-30"
                   >
                     {roundData.targetEmoji}
                   </motion.span>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Area: Massive 3D Option Buttons */}
      <div className="w-full flex flex-row items-center justify-center gap-12 pb-12 z-20 shrink-0">
        <AnimatePresence mode="popLayout">
          {!isSuccess && roundData.options.map((opt, i) => {
            const isSelected = selectedItem === opt.id;
            const isWrong = isSelected && !opt.correct;

            return (
              <motion.button 
                key={`${currentRound}-${opt.id}`}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.4, delay: i * 0.1 }}
                onClick={() => handleSelect(opt)}
                disabled={selectedItem !== null || isSuccess}
                className={`
                  relative
                  bg-gradient-to-tr from-blue-500 to-cyan-300 
                  text-white font-black
                  p-12
                  rounded-[3rem] 
                  border-[6px] border-[#FFF]
                  border-b-[20px] border-b-blue-800 
                  shadow-[0_10px_20px_rgba(0,0,255,0.4),inset_0_5px_10px_rgba(255,255,255,0.6)]
                  active:border-b-[6px] active:translate-y-3.5 
                  transition-all duration-300 ease-out
                  ${isWrong ? 'animate-[shake_0.5s_ease-in-out] bg-gradient-to-tr from-red-500 to-rose-400 border-b-red-800' : 'hover:-translate-y-2'}
                `}
              >
                <span className="text-8xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                  {opt.emoji}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      </div>
    </>
  );
}
