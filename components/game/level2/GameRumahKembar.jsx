"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_2_DATA } from "./data";

const EMOJI_MAP = {
  "Kola": "🥤", "Kuku": "💅", "Pola": "🧶",
  "Suku": "⛺", "Lola": "👧", "Bola": "⚽",
  "Buku": "📚"
};

export function GameRumahKembar({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_2_DATA.game3_RumahKembar[currentRound];

  useEffect(() => {
    if (!isSuccess && !selectedHouse && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, selectedHouse, speak]);

  const handleSelectHouse = (houseId) => {
    if (selectedHouse || isSuccess) return;

    setSelectedHouse(houseId);
    playSound("bloop");

    if (houseId === roundData.target) {
      setIsSuccess(true);
      speak(`Yey! Masuk rumah yang benar!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedHouse(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      speak("Wah, bukan rumah yang itu!");
      setTimeout(() => {
        setSelectedHouse(null);
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

      {/* Main Content */}
      <div className="flex-1 w-full max-w-5xl flex items-center justify-between z-20">
        
        {/* Left House */}
        <motion.button 
          onClick={() => handleSelectHouse(roundData.houses[0].id)}
          disabled={selectedHouse !== null}
          className={`
            relative w-48 h-64 md:w-72 md:h-96 
            bg-linear-to-t from-orange-600 to-amber-400
            rounded-t-full border-8 border-orange-900
            shadow-[0_20px_40px_rgba(0,0,0,0.5)]
            flex flex-col items-center justify-end pb-8
            hover:scale-105 transition-transform
            ${selectedHouse === roundData.houses[0].id && !isSuccess ? 'animate-shake opacity-70 grayscale' : ''}
            ${selectedHouse === roundData.houses[0].id && isSuccess ? 'shadow-[0_0_50px_#4ade80] border-green-400' : ''}
          `}
        >
          {/* House Roof */}
          <div className="absolute -top-12 -left-4 -right-4 h-32 bg-orange-800 rounded-t-full -z-10" />
          <div className="bg-orange-950/40 p-4 rounded-full mb-4 border-4 border-orange-900">
            <span className="text-5xl md:text-7xl">{EMOJI_MAP[roundData.houses[0].icon]}</span>
          </div>
          <div className="w-24 h-32 bg-orange-900 rounded-t-full border-4 border-black/20" />
        </motion.button>

        {/* Center: Kiko and the Item */}
        <div className="flex flex-col items-center justify-center relative w-64">
          <AnimatePresence mode="wait">
            {!isSuccess && (
              <motion.div
                key={`item-${currentRound}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ 
                  x: selectedHouse === roundData.houses[0].id ? -200 : 200,
                  y: -50,
                  scale: 0.5,
                  opacity: 0
                }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="absolute -top-32 w-32 h-32 md:w-48 md:h-48 bg-white/20 backdrop-blur-md border-4 border-fuchsia-300 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_#e879f9]"
              >
                <span className="text-6xl md:text-[6rem] drop-shadow-xl">{EMOJI_MAP[roundData.item] || "❓"}</span>
                <span className="text-xl font-bold text-white bg-black/40 px-3 py-1 rounded-full mt-2">{roundData.item}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Kiko Character */}
          <div className="mt-20">
            <span className="text-[8rem] md:text-[10rem] drop-shadow-2xl animate-[bounce_2s_infinite]">🦊</span>
          </div>
        </div>

        {/* Right House */}
        <motion.button 
          onClick={() => handleSelectHouse(roundData.houses[1].id)}
          disabled={selectedHouse !== null}
          className={`
            relative w-48 h-64 md:w-72 md:h-96 
            bg-linear-to-t from-blue-600 to-cyan-400
            rounded-t-full border-8 border-blue-900
            shadow-[0_20px_40px_rgba(0,0,0,0.5)]
            flex flex-col items-center justify-end pb-8
            hover:scale-105 transition-transform
            ${selectedHouse === roundData.houses[1].id && !isSuccess ? 'animate-shake opacity-70 grayscale' : ''}
            ${selectedHouse === roundData.houses[1].id && isSuccess ? 'shadow-[0_0_50px_#4ade80] border-green-400' : ''}
          `}
        >
          {/* House Roof */}
          <div className="absolute -top-12 -left-4 -right-4 h-32 bg-blue-800 rounded-t-full -z-10" />
          <div className="bg-blue-950/40 p-4 rounded-full mb-4 border-4 border-blue-900">
            <span className="text-5xl md:text-7xl">{EMOJI_MAP[roundData.houses[1].icon]}</span>
          </div>
          <div className="w-24 h-32 bg-blue-900 rounded-t-full border-4 border-black/20" />
        </motion.button>

      </div>
    </div>
  );
}
