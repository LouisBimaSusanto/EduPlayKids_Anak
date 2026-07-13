"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_4_DATA } from "./data";

const EMOJI_MAP = {
  "Ibu": "👩", "Baju": "👕", "Api": "🔥",
  "Topi": "🧢", "Air": "💧"
};

export function GameBrankasAjaib({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedVault, setSelectedVault] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_4_DATA.game5_BrankasAjaib[currentRound];

  useEffect(() => {
    if (!isSuccess && !isError && roundData && !selectedVault) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, isSuccess, isError, selectedVault, speak]);

  const handleSelect = (vaultType) => {
    if (selectedVault || isSuccess || isError) return;

    setSelectedVault(vaultType);
    playSound("bloop");

    if (vaultType === roundData.type) {
      setIsSuccess(true);
      playSound("magic"); // Vault opening sound ideal
      speak(`Benar! Bunyinya ada ${vaultType}!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSelectedVault(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      setIsError(true);
      speak(`Tetoot, bukan brankas yang itu. Coba dihitung lagi bunyinya.`);
      
      setTimeout(() => {
        setSelectedVault(null);
        setIsError(false);
      }, 2000);
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

      {/* Top: The Item dropping */}
      <div className="w-full h-64 flex items-center justify-center relative z-20 mt-16">
        <AnimatePresence mode="wait">
          {!isSuccess && (
            <motion.div
              key={`item-${currentRound}`}
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ 
                y: 100, 
                x: selectedVault === 3 ? -200 : 200,
                scale: 0,
                opacity: 0
              }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-40 h-40 md:w-56 md:h-56 bg-white/20 backdrop-blur-md rounded-[3rem] border-8 border-yellow-300 shadow-[0_0_50px_rgba(253,224,71,0.6)] flex items-center justify-center relative"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-white/50 rounded-full blur-[4px]" />
              <span className="text-[6rem] md:text-[8rem] drop-shadow-2xl">{EMOJI_MAP[roundData.image] || "❓"}</span>
              
              {/* Audio visualizer hint */}
              <div className="absolute -bottom-16 bg-black/40 px-6 py-2 rounded-full border-2 border-yellow-500/50 flex gap-2">
                {[...Array(roundData.type)].map((_, i) => (
                   <span key={i} className="text-2xl animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.2}s` }}>🎵</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: The Vaults */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-12 md:gap-32 pb-8 z-20">
        
        {/* Vault 3 */}
        <motion.button
          onClick={() => handleSelect(3)}
          disabled={selectedVault !== null}
          className={`
            relative w-56 h-64 md:w-80 md:h-80
            bg-gradient-to-tr from-yellow-700 via-amber-500 to-yellow-300
            rounded-t-full rounded-b-3xl border-[16px] border-amber-900 border-b-[24px]
            shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_10px_30px_rgba(255,255,255,0.4)]
            flex flex-col items-center justify-center
            transition-transform duration-300
            ${selectedVault === 3 && isError ? 'animate-[shake_0.5s_ease-in-out] grayscale' : 'hover:scale-105'}
            ${selectedVault === 3 && isSuccess ? 'shadow-[0_0_100px_#fde047]' : ''}
          `}
        >
          {/* Vault Door */}
          <motion.div 
            animate={{ rotateY: selectedVault === 3 && isSuccess ? -120 : 0 }}
            transition={{ duration: 1 }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-4 rounded-t-full rounded-b-xl border-8 border-amber-800 bg-gradient-to-br from-yellow-500 to-orange-600 flex flex-col items-center justify-center shadow-inner z-20"
          >
            {/* Dots */}
            <div className="flex gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-red-600 border-4 border-red-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]" />
              ))}
            </div>
            
            {/* Steering Wheel Handle */}
            <div className={`w-24 h-24 rounded-full border-[6px] border-amber-900 flex items-center justify-center relative ${selectedVault === 3 && isSuccess ? 'animate-spin' : ''}`}>
              <div className="w-4 h-full bg-amber-900 absolute" />
              <div className="w-full h-4 bg-amber-900 absolute" />
              <div className="w-8 h-8 bg-amber-800 rounded-full border-4 border-amber-950 z-10" />
            </div>
          </motion.div>

          {/* Treasure Inside (visible when door opens) */}
          <div className="absolute inset-8 bg-black rounded-t-full rounded-b-lg flex items-center justify-center z-10 overflow-hidden">
             {selectedVault === 3 && isSuccess && (
               <motion.span 
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1.5, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-[6rem]"
               >
                 ✨💰
               </motion.span>
             )}
          </div>
        </motion.button>

        {/* Vault 4 */}
        <motion.button
          onClick={() => handleSelect(4)}
          disabled={selectedVault !== null}
          className={`
            relative w-56 h-64 md:w-80 md:h-80
            bg-gradient-to-tr from-yellow-700 via-amber-500 to-yellow-300
            rounded-t-full rounded-b-3xl border-[16px] border-amber-900 border-b-[24px]
            shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_10px_30px_rgba(255,255,255,0.4)]
            flex flex-col items-center justify-center
            transition-transform duration-300
            ${selectedVault === 4 && isError ? 'animate-[shake_0.5s_ease-in-out] grayscale' : 'hover:scale-105'}
            ${selectedVault === 4 && isSuccess ? 'shadow-[0_0_100px_#fde047]' : ''}
          `}
        >
          {/* Vault Door */}
          <motion.div 
            animate={{ rotateY: selectedVault === 4 && isSuccess ? -120 : 0 }}
            transition={{ duration: 1 }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-4 rounded-t-full rounded-b-xl border-8 border-amber-800 bg-gradient-to-br from-yellow-500 to-orange-600 flex flex-col items-center justify-center shadow-inner z-20"
          >
            {/* Dots */}
            <div className="flex gap-2 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 border-4 border-red-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]" />
              ))}
            </div>
            
            {/* Steering Wheel Handle */}
            <div className={`w-24 h-24 rounded-full border-[6px] border-amber-900 flex items-center justify-center relative ${selectedVault === 4 && isSuccess ? 'animate-spin' : ''}`}>
              <div className="w-4 h-full bg-amber-900 absolute" />
              <div className="w-full h-4 bg-amber-900 absolute" />
              <div className="w-8 h-8 bg-amber-800 rounded-full border-4 border-amber-950 z-10" />
            </div>
          </motion.div>

          {/* Treasure Inside */}
          <div className="absolute inset-8 bg-black rounded-t-full rounded-b-lg flex items-center justify-center z-10 overflow-hidden">
             {selectedVault === 4 && isSuccess && (
               <motion.span 
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1.5, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-[6rem]"
               >
                 ✨💰
               </motion.span>
             )}
          </div>
        </motion.button>

      </div>
    </div>
  );
}
