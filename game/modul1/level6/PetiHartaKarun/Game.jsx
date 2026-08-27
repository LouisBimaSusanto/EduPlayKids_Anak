"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_6_DATA } from '../data';

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, selecting, success, error, final_explosion
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_6_DATA.game5_PetiHartaKarun[currentRound];
  // Parse: "Bola. Hilangkan /b/."
  const originalWord = roundData?.audio.split(".")[0];
  const oldPhoneme = roundData?.audio.match(/Hilangkan \/(.*?)\//)?.[1] || "?";

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
      if (currentRound === 4) {
        setGameState("final_explosion");
        playSound("magic"); // Mega win sound
        speak(`Luar Biasa! ${option}! Harta Karun Terbuka!`);
        
        setTimeout(() => {
          onComplete({ completed: true, score: 100 }); // Move to Grand Finale Modal
        }, 5000);
      } else {
        setGameState("success");
        playSound("bloop"); // Unlock chain sound
        speak(`Benar! Tinggal ${option}! Rantai terlepas!`);
        
        setTimeout(() => {
          setCurrentRound(prev => prev + 1);
          setGameState("idle");
          setSelectedOption(null);
        }, 3000);
      }
    } else {
      setGameState("error");
      speak("Wah, bukan itu sisa bunyinya. Coba lagi!");
      
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

      {/* Top: The Locked Treasure Chest */}
      <div className="w-full flex-1 flex flex-col items-center justify-center mt-12 relative z-20">
        
        {/* The Chest */}
        <div className="relative">
          <motion.div 
            animate={gameState === "error" ? { x: [-10, 10, -10, 10, 0] } : { y: [0, -10, 0] }}
            transition={gameState === "error" ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`
              w-64 h-56 md:w-80 md:h-64 
              bg-gradient-to-b from-amber-500 to-yellow-700 
              rounded-2xl border-8 border-yellow-800 
              shadow-[0_30px_50px_rgba(0,0,0,0.6)]
              relative flex flex-col items-center justify-end overflow-hidden transform-gpu will-change-transform
            `}
          >
            {/* Chest Lid Line */}
            <div className="absolute top-1/3 w-full border-b-8 border-yellow-900 shadow-md" />
            
            {/* Chest Lock */}
            <div className="absolute top-[25%] w-16 h-20 bg-yellow-400 border-4 border-yellow-900 rounded-b-xl shadow-lg flex items-center justify-center">
              <div className="w-4 h-6 bg-yellow-900 rounded-full" />
            </div>

            {/* Chains wrapping the chest based on remaining rounds */}
            <AnimatePresence>
               {currentRound < 4 && gameState !== "final_explosion" && (
                 <motion.div 
                   key={`chain-${currentRound}`}
                   exit={{ opacity: 0, scale: 1.5, rotate: 15 }}
                   className="absolute inset-0 pointer-events-none z-10 border-4 border-slate-400/80 rounded-xl"
                   style={{
                     backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(148, 163, 184, 0.8) 20px, rgba(148, 163, 184, 0.8) 40px)"
                   }}
                 />
               )}
            </AnimatePresence>

            {/* Glowing Aura if completely unlocked */}
            {gameState === "final_explosion" && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="absolute inset-0 bg-yellow-200/50 mix-blend-overlay z-20 shadow-[inset_0_0_100px_white]"
               />
            )}
            
            {/* Open Chest Lid (Mocked by shifting top half) */}
            <AnimatePresence>
              {gameState === "final_explosion" && (
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: -100, rotateX: 60 }}
                  transition={{ duration: 1, type: "spring" }}
                  className="absolute top-0 w-full h-1/3 bg-amber-600 border-b-8 border-yellow-900 origin-top flex items-center justify-center z-30"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                   {/* Dazzling light escaping */}
                   <div className="w-full h-full bg-gradient-to-t from-white to-transparent opacity-80" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Treasures popping out */}
            {gameState === "final_explosion" && (
              <motion.div 
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1.5, y: -50 }}
                transition={{ delay: 0.5, duration: 1, type: "spring" }}
                className="absolute text-[6rem] z-20"
              >
                💎👑✨
              </motion.div>
            )}

          </motion.div>
        </div>

        {/* Display The Question Word */}
        <div className="mt-12 bg-white/80 backdrop-blur-md px-12 py-4 rounded-full border-4 border-amber-500 shadow-[0_0_30px_rgba(255,255,255,0.8)] flex items-center gap-4">
           <span className="text-4xl font-black text-amber-900 line-through decoration-red-500 decoration-8 opacity-50">/{oldPhoneme}/</span>
           <span className="text-5xl font-black text-amber-900 uppercase">{originalWord}</span>
        </div>

      </div>

      {/* Bottom: Options Selection */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-16 pb-12 z-20">
        <AnimatePresence>
          {(gameState === "selecting" || gameState === "success" || gameState === "error") && (
            roundData.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isWrong = gameState === "error" && isSelected;
              const isCorrect = (gameState === "success" || gameState === "final_explosion") && isSelected;

              return (
                <motion.button
                  key={`opt-${currentRound}-${opt}`}
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.2 : 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  onClick={() => handleSelect(opt)}
                  disabled={gameState !== "selecting"}
                  className={`
                    w-40 h-40 md:w-56 md:h-56
                    bg-gradient-to-tr from-amber-600 to-yellow-300
                    rounded-[2rem] border-b-[12px] border-b-amber-800 border-[4px] border-white
                    shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                    flex flex-col items-center justify-center
                    transition-all duration-300
                    ${isWrong ? 'animate-shake grayscale border-red-500' : 'hover:-translate-y-4'}
                    ${isCorrect ? 'border-white shadow-[0_0_80px_rgba(255,255,255,1)] z-50 bg-gradient-to-tr from-yellow-300 to-white' : ''}
                  `}
                >
                  <span className="font-black text-4xl md:text-5xl text-amber-900 tracking-wider uppercase">{opt}</span>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* EXTREME CSS CONFETTI ON FINAL EXPLOSION */}
      <AnimatePresence>
        {gameState === "final_explosion" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
             {/* Central Burst Glow */}
             <div className="absolute inset-0 bg-white mix-blend-overlay animate-[ping_2s_ease-out_forwards]" />
             
             {/* Confetti Particles */}
             {[...Array(50)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ x: 0, y: 0, scale: 0 }}
                 animate={{ 
                   x: (Math.random() - 0.5) * 1000, 
                   y: (Math.random() - 0.5) * 1000 - 200,
                   scale: Math.random() + 0.5,
                   rotate: Math.random() * 360
                 }}
                 transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
                 className="absolute w-4 h-8 bg-amber-400 border border-yellow-600"
                 style={{ backgroundColor: ['#FFD700', '#FFA500', '#FF69B4', '#00FFFF', '#32CD32'][Math.floor(Math.random() * 5)] }}
               />
             ))}
             
             {/* Extra Stars */}
             {[...Array(20)].map((_, i) => (
               <motion.div
                 key={`star-${i}`}
                 initial={{ x: 0, y: 0, scale: 0 }}
                 animate={{ 
                   x: (Math.random() - 0.5) * 1200, 
                   y: (Math.random() - 0.5) * 1200 - 100,
                   scale: Math.random() * 2 + 1,
                   rotate: Math.random() * 720
                 }}
                 transition={{ duration: 3 + Math.random() * 2, ease: "easeOut" }}
                 className="absolute text-yellow-300 drop-shadow-[0_0_10px_white]"
               >
                 ⭐
               </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
