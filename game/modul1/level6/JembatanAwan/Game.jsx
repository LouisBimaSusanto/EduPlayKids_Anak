"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_6_DATA } from '../data';

const EMOJI_MAP = {
  "Sapi": "🐄", "Buku": "📚", "Ibu": "👩",
  "Meja": "🪑", "Api": "🔥"
};

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, selecting, success, error
  const [selectedCloud, setSelectedCloud] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_6_DATA.game1_JembatanAwan[currentRound];

  useEffect(() => {
    if (gameState === "idle" && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
        setGameState("selecting");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, gameState, speak]);

  const handleSelect = (cloudValue) => {
    if (gameState !== "selecting") return;
    
    setSelectedCloud(cloudValue);
    playSound("bloop");

    if (cloudValue === roundData.target) {
      setGameState("success");
      playSound("magic");
      speak(`Benar! Ada ${cloudValue} bunyi! Jembatan terbuka!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setGameState("idle");
          setSelectedCloud(null);
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3500);
    } else {
      setGameState("error");
      speak(`Hmm, coba dengarkan lagi. Ada berapa bunyinya?`);
      
      setTimeout(() => {
        setGameState("selecting");
        setSelectedCloud(null);
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

      {/* Top: The Object in the sky */}
      <div className="w-full h-64 flex items-center justify-center relative z-20 mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`item-${currentRound}`}
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={gameState === "success" ? { y: -200, scale: 0, opacity: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="w-48 h-48 md:w-56 md:h-56 bg-white/40 backdrop-blur-md rounded-full border-8 border-yellow-200 shadow-[0_0_50px_rgba(255,255,255,0.8)] flex items-center justify-center relative"
          >
            <span className="text-[6rem] md:text-6xl md:text-[8rem] drop-shadow-2xl">{EMOJI_MAP[roundData.image] || "❓"}</span>
            
            {/* Play audio button overlay */}
            <button 
              onClick={() => speak(roundData.audio)}
              disabled={gameState !== "selecting"}
              className="absolute -bottom-8 bg-amber-500 text-white p-4 rounded-full shadow-lg border-4 border-yellow-300 hover:scale-110 active:scale-95 transition-transform"
            >
              🔊
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom: The Golden Clouds */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-8 md:gap-24 pb-12 z-20">
        {[3, 4].map((cloudValue) => {
          const isSelected = selectedCloud === cloudValue;
          const isCorrect = isSelected && gameState === "success";
          const isWrong = isSelected && gameState === "error";

          return (
            <motion.button
              key={`cloud-${cloudValue}`}
              onClick={() => handleSelect(cloudValue)}
              disabled={gameState !== "selecting"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative w-48 h-32 md:w-64 md:h-40
                bg-gradient-to-b from-white to-yellow-100
                rounded-full
                shadow-[0_20px_40px_rgba(0,0,0,0.3),_inset_0_-10px_20px_rgba(251,191,36,0.5)]
                flex flex-col items-center justify-center
                transition-all duration-300
                ${isWrong ? 'animate-[shake_0.5s_ease-in-out] bg-gradient-to-b from-red-100 to-red-300' : ''}
                ${isCorrect ? 'shadow-[0_0_100px_rgba(255,215,0,0.8)] z-50 ring-8 ring-yellow-400 ring-offset-4' : ''}
              `}
            >
              {/* Cloud bubbles to make it look fluffy */}
              <div className="absolute -top-8 -left-4 w-24 h-24 bg-white rounded-full mix-blend-overlay opacity-80" />
              <div className="absolute -top-12 right-4 w-32 h-32 bg-white rounded-full mix-blend-overlay opacity-80" />
              <div className="absolute -bottom-4 -left-2 w-16 h-16 bg-yellow-200 rounded-full mix-blend-overlay opacity-50" />

              {/* Dots representing sounds */}
              <div className="flex gap-3 z-10">
                {[...Array(cloudValue)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={isCorrect ? { y: [0, -20, 0] } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1, repeat: isCorrect ? Infinity : 0, repeatDelay: 1 }}
                    className={`
                      w-6 h-6 md:w-8 md:h-8 rounded-full 
                      ${isCorrect ? 'bg-amber-400 border-yellow-200' : 'bg-yellow-300 border-amber-400'}
                      border-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]
                    `} 
                  />
                ))}
              </div>
              
              <span className="absolute -bottom-16 text-3xl font-black text-amber-800 bg-white/50 px-4 py-1 rounded-full">{cloudValue} Bunyi</span>

            </motion.button>
          );
        })}
      </div>

    </div>
  );
}
