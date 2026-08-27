"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_6_DATA } from '../data';

const EMOJI_MAP = {
  "Kuda": "🐴", "Baju": "👕", "Topi": "🧢",
  "Tari": "💃", "Jari": "🖐️", "Lari": "🏃",
  "Mata": "👁️", "Bata": "🧱", "Rata": "📏",
  "Bola": "⚽", "Pola": "🎯", "Kola": "🥤",
  "Susu": "🍼", "Kuku": "💅", "Buku": "📚"
};

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_6_DATA.game2_GerbangCahaya[currentRound];
  const phonemes = roundData?.audio.split(" ").filter(p => p.trim() !== "");

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
      playSound("magic"); // Gate opening sound ideal
      speak(`Hebat! ${option}! Gerbang Terbuka!`);
      
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
      speak("Wah, kuncinya salah. Gerbang masih tertutup.");
      
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

      {/* Top: The Massive Golden Gate */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-20 mt-8">
        
        {/* Gate Architecture */}
        <div className="relative w-80 h-72 md:w-96 md:h-80 flex flex-col items-center justify-end overflow-hidden perspective-[1000px] transform-gpu">
          
          {/* Archway Frame */}
          <div className="absolute inset-0 border-[16px] border-amber-600 rounded-t-full z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-t from-transparent to-amber-700/20 pointer-events-none" />

          {/* Light Behind Gate */}
          <AnimatePresence>
            {gameState === "success" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white shadow-[0_0_100px_white] z-10"
              />
            )}
          </AnimatePresence>

          {/* Left Door */}
          <motion.div 
            animate={gameState === "success" ? { rotateY: -120 } : { rotateY: 0 }}
            transition={{ duration: 1.5, type: "spring" }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 w-1/2 h-full bg-gradient-to-br from-yellow-500 to-amber-700 border-r-4 border-amber-900 z-20 flex flex-col items-center justify-center p-4 rounded-tl-[10rem] will-change-transform"
          >
            {/* Ornaments */}
            <div className="w-16 h-16 rounded-full border-4 border-amber-300 bg-amber-600 mb-8 shadow-md" />
            <div className="w-16 h-16 rounded-full border-4 border-amber-300 bg-amber-600 shadow-md" />
            {/* Handle */}
            <div className="absolute right-2 top-1/2 w-4 h-12 bg-yellow-300 rounded-full shadow-md" />
          </motion.div>

          {/* Right Door */}
          <motion.div 
            animate={gameState === "success" ? { rotateY: 120 } : { rotateY: 0 }}
            transition={{ duration: 1.5, type: "spring" }}
            style={{ transformOrigin: "right" }}
            className="absolute right-0 w-1/2 h-full bg-gradient-to-bl from-yellow-500 to-amber-700 border-l-4 border-amber-900 z-20 flex flex-col items-center justify-center p-4 rounded-tr-[10rem] will-change-transform"
          >
            {/* Ornaments */}
            <div className="w-16 h-16 rounded-full border-4 border-amber-300 bg-amber-600 mb-8 shadow-md" />
            <div className="w-16 h-16 rounded-full border-4 border-amber-300 bg-amber-600 shadow-md" />
            {/* Handle */}
            <div className="absolute left-2 top-1/2 w-4 h-12 bg-yellow-300 rounded-full shadow-md" />
          </motion.div>

          {/* Magic Lock / Puzzle Display */}
          <AnimatePresence>
            {gameState !== "success" && (
              <motion.div 
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border-4 border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex gap-2 transform-gpu"
              >
                {phonemes.map((p, i) => (
                  <span key={i} className="text-3xl font-black text-amber-900">{p}</span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom: Options Selection */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-12 pb-12 z-20">
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
                  animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.1 : 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  onClick={() => handleSelect(opt)}
                  disabled={gameState !== "selecting"}
                  className={`
                    w-32 h-40 md:w-48 md:h-56
                    bg-gradient-to-t from-white to-yellow-50
                    rounded-2xl border-[6px] border-amber-300 border-b-[12px] border-b-amber-500
                    shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                    flex flex-col items-center justify-center gap-2
                    transition-all duration-300
                    ${isWrong ? 'animate-shake grayscale border-red-500 border-b-red-700 bg-red-100' : 'hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(251,191,36,0.6)]'}
                    ${isCorrect ? 'border-yellow-400 border-b-yellow-600 shadow-[0_0_60px_rgba(255,255,255,1)] z-50 ring-4 ring-white' : ''}
                  `}
                >
                  <span className="text-6xl md:text-[5rem] drop-shadow-lg">{EMOJI_MAP[opt] || "❓"}</span>
                  <span className="font-bold text-xl md:text-2xl text-amber-900">{opt}</span>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
