"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_3_DATA } from "./data";

const EMOJI_MAP = {
  "Baju": "👕", "Sapi": "🐄", "Buku": "📚",
  "Susu": "🍼", "Bola": "⚽"
};

export function GameKapalSelam({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedSubmarine, setSelectedSubmarine] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_3_DATA.game5_KapalSelam[currentRound];

  useEffect(() => {
    if (!isSuccess && !selectedSubmarine && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, selectedSubmarine, speak]);

  const handleSelect = (shipId) => {
    if (selectedSubmarine || isSuccess) return;

    setSelectedSubmarine(shipId);
    playSound("bloop");

    if (shipId === roundData.target) {
      setIsSuccess(true);
      speak(`Yey! Masuk ke kapal yang benar!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedSubmarine(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      speak("Wah, sepertinya bukan kapal itu!");
      setTimeout(() => {
        setSelectedSubmarine(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-blue-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-cyan-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Top: Ara the Parrot in Diving Suit */}
      <div className="w-full flex flex-col items-center justify-center mt-4 relative z-20">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Diving Helmet */}
          <div className="absolute -top-4 w-40 h-40 border-[8px] border-amber-600 rounded-full bg-cyan-200/40 backdrop-blur-sm z-30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]">
            <div className="w-32 h-32 rounded-full border-4 border-amber-300" />
          </div>
          {/* Parrot */}
          <span className="text-[8rem] drop-shadow-2xl z-20 mt-4">🦜</span>
        </motion.div>

        {/* Dropped Item */}
        <div className="mt-8 h-48 w-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!isSuccess && (
              <motion.div
                key={`item-${currentRound}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ 
                  y: 200, // Drop down towards submarines
                  x: selectedSubmarine === roundData.ships[0].id ? -150 : 150, 
                  scale: 0.5, 
                  opacity: 0 
                }}
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-white/80 rounded-full w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center border-4 border-cyan-400 shadow-[0_0_30px_#22d3ee] z-10"
              >
                <span className="text-6xl md:text-7xl">{EMOJI_MAP[roundData.item] || "❓"}</span>
                <span className="text-lg font-bold text-slate-800">{roundData.item}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: Submarines */}
      <div className="flex-1 w-full max-w-4xl flex items-end justify-between px-8 pb-12 z-20">
        
        {/* Left Submarine */}
        <motion.button
          onClick={() => handleSelect(roundData.ships[0].id)}
          disabled={selectedSubmarine !== null}
          className={`
            relative w-48 h-32 md:w-64 md:h-40
            bg-gradient-to-b from-yellow-400 to-amber-600
            rounded-[4rem] border-8 border-yellow-700
            shadow-[0_20px_40px_rgba(0,0,0,0.6)]
            hover:scale-105 transition-transform
            flex items-center justify-center
            ${selectedSubmarine === roundData.ships[0].id && !isSuccess ? 'animate-[shake_0.5s_ease-in-out] grayscale opacity-80' : ''}
            ${selectedSubmarine === roundData.ships[0].id && isSuccess ? 'shadow-[0_0_80px_#4ade80] border-green-400 scale-110' : ''}
          `}
        >
          {/* Periscope */}
          <div className="absolute -top-12 left-8 w-6 h-16 bg-yellow-600 border-4 border-yellow-800 rounded-t-lg">
            <div className="w-10 h-6 bg-yellow-500 absolute -top-2 -right-4 rounded-full border-4 border-yellow-800" />
          </div>
          
          {/* Target Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 rounded-full border-4 border-cyan-800 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-20">
            <span className="text-4xl md:text-5xl font-black text-cyan-900">{roundData.ships[0].icon}</span>
          </div>

          {/* Propeller */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-300 rounded-full border-4 border-slate-600 animate-spin z-10" />
        </motion.button>

        {/* Right Submarine */}
        <motion.button
          onClick={() => handleSelect(roundData.ships[1].id)}
          disabled={selectedSubmarine !== null}
          className={`
            relative w-48 h-32 md:w-64 md:h-40
            bg-gradient-to-b from-red-500 to-rose-700
            rounded-[4rem] border-8 border-red-900
            shadow-[0_20px_40px_rgba(0,0,0,0.6)]
            hover:scale-105 transition-transform
            flex items-center justify-center
            ${selectedSubmarine === roundData.ships[1].id && !isSuccess ? 'animate-[shake_0.5s_ease-in-out] grayscale opacity-80' : ''}
            ${selectedSubmarine === roundData.ships[1].id && isSuccess ? 'shadow-[0_0_80px_#4ade80] border-green-400 scale-110' : ''}
          `}
        >
          {/* Periscope */}
          <div className="absolute -top-12 left-8 w-6 h-16 bg-red-700 border-4 border-red-900 rounded-t-lg">
            <div className="w-10 h-6 bg-red-600 absolute -top-2 -right-4 rounded-full border-4 border-red-900" />
          </div>
          
          {/* Target Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 rounded-full border-4 border-cyan-800 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-20">
            <span className="text-4xl md:text-5xl font-black text-cyan-900">{roundData.ships[1].icon}</span>
          </div>

          {/* Propeller */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-300 rounded-full border-4 border-slate-600 animate-spin z-10" />
        </motion.button>

      </div>
    </div>
  );
}
