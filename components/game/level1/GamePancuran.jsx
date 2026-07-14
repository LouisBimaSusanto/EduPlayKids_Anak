"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";

const ROUNDS = [
  { id: 1, word: "Sepeda", instruction: "Se ... Pe ... Da. Sepeda! Yang mana sepeda?", options: [{ id: "kamera", emoji: "📸" }, { id: "sepeda", emoji: "🚲", correct: true }, { id: "sepatu", emoji: "👞" }] },
  { id: 2, word: "Kereta", instruction: "Ke ... Re ... Ta. Kereta! Yang mana kereta?", options: [{ id: "pesawat", emoji: "✈️" }, { id: "perahu", emoji: "⛵" }, { id: "kereta", emoji: "🚂", correct: true }] },
  { id: 3, word: "Sepatu", instruction: "Se ... Pa ... Tu. Sepatu! Yang mana sepatu?", options: [{ id: "baju", emoji: "👕" }, { id: "celana", emoji: "👖" }, { id: "sepatu", emoji: "👞", correct: true }] },
  { id: 4, word: "Kamera", instruction: "Ka ... Me ... Ra. Kamera! Yang mana kamera?", options: [{ id: "kamera", emoji: "📸", correct: true }, { id: "telepon", emoji: "☎️" }, { id: "radio", emoji: "📻" }] },
  { id: 5, word: "Pepaya", instruction: "Pe ... Pa ... Ya. Pepaya! Yang mana pepaya?", options: [{ id: "pisang", emoji: "🍌" }, { id: "pepaya", emoji: "🍈", correct: true }, { id: "mangga", emoji: "🥭" }] }
];

export function GamePancuran({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useTTS();

  const roundData = ROUNDS[currentRound];

  useEffect(() => {
    // Mount instruction
    if (!isSuccess && roundData) {
      speak(roundData.instruction);
    }
  }, [currentRound, roundData, isSuccess, speak]);

  const handleSelect = (option) => {
    if (selectedItem || isSuccess) return;

    setSelectedItem(option.id);

    if (option.correct) {
      setIsSuccess(true);
      speak(`Wah, benar sekali! ${roundData.word}!`);
      
      setTimeout(() => {
        if (currentRound < ROUNDS.length - 1) {
          setCurrentRound(prev => prev + 1);
          setSelectedItem(null);
          setIsSuccess(false);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      speak("Hmm, sepertinya bukan itu.");
      setTimeout(() => {
        setSelectedItem(null);
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/20">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / {ROUNDS.length}
        </span>
      </div>

      {/* Top Area: Kiko & Cauldron */}
      <div className="w-full flex-1 flex flex-row items-end justify-center relative pb-8 md:pb-16 gap-4 md:gap-12">
        
        {/* Kiko the Fox */}
        <motion.div 
          animate={isSuccess ? { y: [0, -30, 0], rotate: [0, -10, 10, 0] } : { y: [0, -10, 0] }}
          transition={{ duration: isSuccess ? 0.5 : 2, repeat: isSuccess ? 4 : Infinity }}
          className="text-[10rem] md:text-[14rem] drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] z-20"
        >
          🦊
        </motion.div>

        {/* Bubbling Cauldron */}
        <div className="relative">
          {/* Bubbles */}
          <div className="absolute -top-20 left-0 right-0 flex justify-center gap-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -60], opacity: [0, 1, 0], scale: [0.5, 1.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="w-6 h-6 md:w-8 md:h-8 bg-[#00E5C8] rounded-full mix-blend-screen shadow-[0_0_10px_#00E5C8]"
              />
            ))}
          </div>

          <motion.div 
            animate={isSuccess ? { scale: [1, 1.2, 1], filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"] } : {}}
            transition={{ duration: 1, repeat: isSuccess ? 2 : 0 }}
            className="text-[12rem] md:text-[16rem] drop-shadow-[0_20px_40px_rgba(0,229,200,0.6)] z-30"
          >
            🍲
          </motion.div>

          {/* Magical Explosion on Success */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 3, 5] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-40 bg-[radial-gradient(circle,rgba(255,215,0,1)_0%,transparent_60%)] mix-blend-screen pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Area: 3 Glowing Drawers/Buttons */}
      <div className="w-full flex flex-row items-center justify-center gap-6 md:gap-12 pb-12 z-20">
        <AnimatePresence mode="popLayout">
          {!isSuccess && roundData.options.map((opt, i) => {
            const isSelected = selectedItem === opt.id;
            const isWrong = isSelected && !opt.correct;

            return (
              <motion.button 
                key={`${currentRound}-${opt.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: i * 0.1 }}
                onClick={() => handleSelect(opt)}
                disabled={selectedItem !== null || isSuccess}
                className={`
                  relative
                  bg-linear-to-tr from-[#8E2DE2] to-[#4A00E0] 
                  text-white font-black
                  w-32 h-32 md:w-48 md:h-48
                  flex items-center justify-center
                  rounded-4xl 
                  border-[6px] border-[#FFF]
                  border-b-16 border-b-[#2A0080] 
                  shadow-[0_20px_40px_rgba(142,45,226,0.6),inset_0_10px_20px_rgba(255,255,255,0.4)]
                  active:border-b-[6px] active:translate-y-2.5 
                  transition-all duration-300 ease-out
                  ${isWrong ? 'animate-[shake_0.5s_ease-in-out] bg-linear-to-tr from-red-500 to-rose-400 border-b-red-800' : 'hover:-translate-y-2'}
                `}
              >
                <span className="text-[5rem] md:text-[7rem] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  {opt.emoji}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
