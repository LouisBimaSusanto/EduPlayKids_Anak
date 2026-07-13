"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_3_DATA } from "./data";

export function GameGelembungBunyi({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [poppedBubble, setPoppedBubble] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_3_DATA.game1_GelembungBunyi[currentRound];

  useEffect(() => {
    if (!isSuccess && !isError && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, speak]);

  const handleSelect = (option) => {
    if (isSuccess || isError || poppedBubble) return;

    setPoppedBubble(option);
    playSound("bloop");

    if (option === roundData.target) {
      setIsSuccess(true);
      speak(`Benar! Bunyi ${option}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setPoppedBubble(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3000);
    } else {
      setIsError(true);
      speak("Wah, bunyinya beda. Coba gelembung lain!");
      setTimeout(() => {
        setPoppedBubble(null);
        setIsError(false);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background aquatic elements */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-teal-900/60 to-transparent pointer-events-none" />
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-blue-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-cyan-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="flex-1 flex flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {roundData.options.map((opt, i) => {
            const isPopped = poppedBubble === opt;
            const isCorrect = isPopped && opt === roundData.target;
            const isWrong = isPopped && opt !== roundData.target;

            return (
              <motion.button
                key={`${currentRound}-${opt}`}
                initial={{ y: 200, opacity: 0, scale: 0.5 }}
                animate={isPopped ? { scale: 1.5, opacity: 0 } : { y: [0, -20, 0], opacity: 1, scale: 1 }}
                transition={isPopped ? { duration: 0.3 } : { y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 } }}
                onClick={() => handleSelect(opt)}
                disabled={poppedBubble !== null}
                className={`
                  relative flex flex-col items-center justify-center
                  w-40 h-40 md:w-56 md:h-56
                  rounded-full
                  bg-gradient-to-tr from-cyan-500/40 to-blue-300/40
                  backdrop-blur-sm
                  border-4 border-cyan-200/60
                  shadow-[0_0_30px_rgba(34,211,238,0.4),_inset_0_0_40px_rgba(255,255,255,0.4)]
                  ${isWrong ? 'border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : ''}
                `}
              >
                {/* Bubble Highlights */}
                <div className="absolute top-4 right-6 w-8 h-8 bg-white/70 rounded-full blur-[2px]" />
                <div className="absolute bottom-6 left-8 w-16 h-4 bg-white/30 rounded-full blur-[4px] -rotate-45" />
                
                {!isPopped && (
                  <span className="text-6xl md:text-[6rem] font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    {opt}
                  </span>
                )}

                {/* Pop Effect */}
                {isCorrect && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-cyan-100 rounded-full animate-ping opacity-50" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating small background bubbles */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={`bg-bubble-${i}`}
          className="absolute rounded-full border border-white/30 bg-white/10 animate-[float_4s_linear_infinite]"
          style={{
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-20px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 4 + 3}s`
          }}
        />
      ))}
    </div>
  );
}
