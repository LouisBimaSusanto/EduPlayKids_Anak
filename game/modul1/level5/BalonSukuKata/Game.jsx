"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_5_DATA } from '../data';

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_5_DATA.game1_BalonSukuKata[currentRound];
  const word = roundData?.audio.replace(/-/g, "");

  useEffect(() => {
    if (!isSuccess && !isError && roundData && tapCount === 0) {
      const timer = setTimeout(() => {
        speak(`Berapa suku kata dari ${word}?`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, tapCount, word, speak]);

  const handleTap = () => {
    if (isSuccess || isError) return;
    setTapCount(prev => prev + 1);
    playSound("bloop");
  };

  useEffect(() => {
    if (tapCount > 0 && !isSuccess && !isError) {
      const timeout = setTimeout(() => {
        validateTaps();
      }, 1500); // 1.5s after last tap
      return () => clearTimeout(timeout);
    }
  }, [tapCount, isSuccess, isError]);

  const validateTaps = () => {
    if (tapCount === roundData.target) {
      setIsSuccess(true);
      playSound("magic"); // Fireworks sound!
      speak(`Luar Biasa! Benar ada ${tapCount}`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setTapCount(0);
          setIsSuccess(false);
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3500);
    } else {
      setIsError(true);
      speak(`Kurang tepat. Bunyinya ada ${roundData.target}. Ayo coba balon lain!`);
      
      setTimeout(() => {
        setTapCount(0);
        setIsError(false);
      }, 3000);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-indigo-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-20">
        
        {/* Hot Air Balloon */}
        <motion.div
          animate={isSuccess ? { y: -500, opacity: 0, scale: 0.5 } : { y: [0, -20, 0] }}
          transition={isSuccess ? { duration: 1.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Balloon Target */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
            disabled={isSuccess || isError}
            className={`
              relative w-64 h-80 md:w-80 md:h-96 
              bg-gradient-to-tr from-fuchsia-600 via-purple-500 to-indigo-400 
              rounded-full rounded-b-3xl
              border-8 border-indigo-900 shadow-[0_30px_50px_rgba(0,0,0,0.6),_inset_0_-20px_40px_rgba(0,0,0,0.4)]
              flex flex-col items-center justify-center
              ${isError ? 'bg-gradient-to-tr from-red-600 to-rose-400 border-red-900 animate-shake' : ''}
              ${isSuccess ? 'shadow-[0_0_100px_rgba(217,70,239,1)]' : ''}
            `}
          >
            {/* Balloon Stripes */}
            <div className="absolute inset-0 rounded-full rounded-b-3xl border-[4px] border-white/20" style={{ borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%', width: '60%', margin: '0 auto' }} />

            {/* Content inside balloon */}
            <span className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-4 tracking-wider uppercase">
              {word}
            </span>
            
            {/* Tap indicator */}
            {tapCount > 0 && (
              <div className="absolute bg-white/90 text-indigo-900 font-black text-5xl w-24 h-24 rounded-full flex items-center justify-center border-4 border-fuchsia-500 shadow-xl">
                {tapCount}
              </div>
            )}
          </motion.button>

          {/* Ropes */}
          <div className="flex justify-between w-24 h-16 relative -mt-4 z-10">
            <div className="w-1.5 h-full bg-amber-800 rotate-[15deg] origin-top" />
            <div className="w-1.5 h-full bg-amber-800 -rotate-[15deg] origin-top" />
          </div>

          {/* Basket */}
          <div className="w-24 h-20 bg-amber-700 border-4 border-amber-900 rounded-b-xl flex items-center justify-center z-20 shadow-xl relative">
            <div className="absolute inset-x-0 top-2 h-1 bg-amber-900" />
            <div className="absolute inset-x-0 top-6 h-1 bg-amber-900" />
            <div className="absolute inset-x-0 top-10 h-1 bg-amber-900" />
            <span className="text-4xl drop-shadow-md z-30">🦝</span> {/* A raccoon passenger */}
          </div>
          
        </motion.div>

      </div>
      
      {/* Decorative fireworks when success */}
      {isSuccess && (
        <>
          <div className="absolute top-20 right-32 text-6xl md:text-[8rem] animate-[ping_1s_ease-out] z-0">🎇</div>
          <div className="absolute top-40 left-32 text-[6rem] animate-[ping_1.5s_ease-out] z-0">🎆</div>
        </>
      )}

    </div>
  );
}
