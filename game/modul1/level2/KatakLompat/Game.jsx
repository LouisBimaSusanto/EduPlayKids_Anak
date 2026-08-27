"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_2_DATA } from '../data';

const EMOJI_MAP = {
  "Maju": "🏃", "Bola": "⚽", "Sapi": "🐄",
  "Muda": "👶", "Meja": "🪑", "Topi": "🧢",
  "Tari": "💃", "Buku": "📚", "Baju": "👕",
  "Bata": "🧱", "Kuku": "💅", "Kuda": "🐴",
  "Rapi": "✨"
};

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedPad, setSelectedPad] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_2_DATA.game2_KatakLompat[currentRound];

  useEffect(() => {
    if (!isSuccess && !selectedPad && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, selectedPad, speak]);

  const handleSelect = (option, index) => {
    if (selectedPad || isSuccess) return;

    setSelectedPad(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      speak(`Keren! Rima nya sama! ${option}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedPad(null);
          setIsSuccess(false);
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3000);
    } else {
      speak("Wah, bunyinya beda. Ayo cari yang lain!");
      setTimeout(() => {
        setSelectedPad(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      {/* Background River Element */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-900/80 to-transparent pointer-events-none" />

      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-purple-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Target Lilypads Area */}
      <div className="w-full flex-1 flex flex-row items-center justify-center gap-4 md:gap-16 z-20 mt-12">
        <AnimatePresence mode="popLayout">
          {roundData.options.map((opt, i) => {
            const isSelected = selectedPad === opt;
            const isWrong = isSelected && opt !== roundData.target;
            const isCorrect = isSelected && opt === roundData.target;

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: isSelected ? -20 : [0, 10, 0] }}
                transition={{ 
                  scale: { type: "spring", bounce: 0.5 },
                  y: { duration: 3, repeat: isSelected ? 0 : Infinity, ease: "easeInOut", delay: i * 0.5 }
                }}
                onClick={() => handleSelect(opt, i)}
                disabled={selectedPad !== null}
                className={`
                  relative flex flex-col items-center justify-center
                  w-32 h-32 md:w-48 md:h-48 rounded-full
                  bg-gradient-to-br from-emerald-400 to-green-600
                  border-b-12 border-b-green-800 border-4 border-emerald-200
                  shadow-[0_20px_30px_rgba(0,0,0,0.5)]
                  ${isWrong ? 'animate-[shake_0.5s_ease-in-out] opacity-50 grayscale' : 'hover:-translate-y-2'}
                  ${isCorrect ? 'shadow-[0_0_50px_#4ade80] border-white' : ''}
                  transition-all duration-300
                `}
              >
                {/* Lotus flower decoration */}
                <div className="absolute -top-4 -right-4 text-4xl drop-shadow-md">🌸</div>
                <span className="text-6xl md:text-8xl drop-shadow-lg">{EMOJI_MAP[opt] || "❓"}</span>
                <span className="mt-2 text-lg font-bold text-white drop-shadow-md bg-black/40 px-3 rounded-full">{opt}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Frog Starting Lilypad */}
      <div className="w-full h-64 flex items-end justify-center relative z-20 mb-8">
        <motion.div 
          animate={isSuccess ? { y: -300, scale: [1, 1.2, 1], opacity: 0 } : { y: [0, -10, 0] }}
          transition={{ 
            y: isSuccess ? { duration: 0.8, ease: "easeIn" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative flex flex-col items-center"
        >
          <span className="text-6xl md:text-[8rem] md:text-7xl md:text-[12rem] drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] z-30">🐸</span>
          <div className="w-48 h-16 md:w-64 md:h-24 bg-gradient-to-br from-emerald-500 to-green-700 rounded-[100%] border-b-8 border-b-green-900 border-2 border-emerald-300 absolute -bottom-4 -z-10 shadow-[0_30px_30px_rgba(0,0,0,0.6)]" />
        </motion.div>
      </div>

    </div>
  );
}
