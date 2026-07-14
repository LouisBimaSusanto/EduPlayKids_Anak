"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_2_DATA } from "./data";

export function GamePintuOnset({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_2_DATA.game4_PintuOnset[currentRound];

  useEffect(() => {
    if (!isSuccess && !selectedDoor && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, selectedDoor, speak]);

  const handleSelectDoor = (option) => {
    if (selectedDoor || isSuccess) return;

    setSelectedDoor(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      speak(`Benar! ${option}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedDoor(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      speak("Pintu tidak terbuka, coba lagi!");
      setTimeout(() => {
        setSelectedDoor(null);
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

      <div className="flex-1 w-full flex items-center justify-center gap-8 md:gap-16 z-20">
        <AnimatePresence mode="popLayout">
          {roundData.options.map((opt, i) => {
            const isSelected = selectedDoor === opt;
            const isWrong = isSelected && opt !== roundData.target;
            const isCorrect = isSelected && opt === roundData.target;

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: i * 0.1 }}
                onClick={() => handleSelectDoor(opt)}
                disabled={selectedDoor !== null}
                className={`
                  relative flex flex-col items-center justify-center
                  w-48 h-80 md:w-64 md:h-96
                  bg-linear-to-b from-[#3D1F0A] to-[#1A0B02]
                  border-12 border-[#8B4513] border-b-0
                  rounded-t-full
                  shadow-[0_20px_40px_rgba(0,0,0,0.8)]
                  transition-all duration-500
                  ${isWrong ? 'animate-shake' : 'hover:scale-105'}
                `}
              >
                {/* Door Frame Inner Glow */}
                <div className={`absolute inset-0 rounded-t-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] ${isCorrect ? 'bg-green-400/20 shadow-[inset_0_0_50px_#4ade80]' : ''}`} />
                
                {/* Magical Keyhole or Icon */}
                <div className={`
                  w-24 h-24 md:w-32 md:h-32 rounded-full 
                  border-4 border-[#FFD700] bg-[#FFF5E0] 
                  flex items-center justify-center
                  shadow-[0_0_30px_rgba(255,215,0,0.5)]
                  ${isCorrect ? 'animate-pulse bg-green-200 border-green-500 shadow-[0_0_50px_#4ade80]' : ''}
                  ${isWrong ? 'bg-red-200 border-red-500 shadow-[0_0_30px_#ef4444]' : ''}
                `}>
                  <span className="text-4xl md:text-6xl font-black text-[#8B4513] drop-shadow-md">{opt}</span>
                </div>

                {/* Door Handle */}
                <div className="absolute right-4 top-1/2 w-6 h-6 rounded-full bg-[#FFD700] shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />

                {/* Open Door Animation Overlay */}
                <AnimatePresence>
                  {isCorrect && (
                    <motion.div
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute inset-0 bg-linear-to-b from-[#3D1F0A] to-[#1A0B02] rounded-t-full origin-left flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FFD700] bg-[#FFF5E0] flex items-center justify-center">
                        <span className="text-4xl md:text-6xl font-black text-[#8B4513]">{opt}</span>
                      </div>
                      <div className="absolute right-4 top-1/2 w-6 h-6 rounded-full bg-[#FFD700]" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Treasure/Light Behind Door */}
                {isCorrect && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute inset-0 bg-linear-to-t from-yellow-200 to-white opacity-80 rounded-t-full flex items-center justify-center -z-10"
                  >
                     <span className="text-7xl">✨</span>
                  </motion.div>
                )}

              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
