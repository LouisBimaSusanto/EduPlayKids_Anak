"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_4_DATA } from "./data";

const EMOJI_MAP = {
  "Basi": "🤢", "Kuku": "💅", "Bata": "🧱",
  "Tari": "💃", "Bola": "⚽"
};

export function GameMesinMengganti({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [slotState, setSlotState] = useState("idle"); // idle, rolling, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_4_DATA.game4_MesinMengganti[currentRound];
  // Parse audio string like "Nasi. Ganti /n/ dengan /b/."
  const originalWord = roundData?.audio.split(".")[0];
  const oldPhoneme = roundData?.audio.match(/Ganti \/(.*?)\//)?.[1] || "?";
  const newPhoneme = roundData?.audio.match(/dengan \/(.*?)\//)?.[1] || "?";

  useEffect(() => {
    if (slotState === "idle" && roundData) {
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, slotState, speak]);

  const handlePullLever = () => {
    if (slotState !== "idle") return;
    
    setSlotState("rolling");
    playSound("bloop"); // Ideal: slot machine rolling sound
    
    setTimeout(() => {
      setSlotState("selecting");
      playSound("magic"); // Ding sound
    }, 2000);
  };

  const handleSelect = (option) => {
    if (slotState !== "selecting") return;
    
    setSelectedOption(option);
    
    if (option === roundData.target) {
      setSlotState("success");
      playSound("magic");
      speak(`Hebat! Menjadi ${option}!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setSlotState("idle");
          setSelectedOption(null);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      setSlotState("error");
      speak("Wah, bukan itu hasilnya. Coba lagi!");
      
      setTimeout(() => {
        setSlotState("selecting");
        setSelectedOption(null);
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

      {/* Top: The Magical Slot Machine */}
      <div className="w-full flex-1 flex items-center justify-center mt-12 relative z-20">
        
        <div className="relative flex flex-row items-center">
          
          {/* Main Machine Body */}
          <div className="w-80 h-48 md:w-96 md:h-64 bg-gradient-to-b from-red-700 to-red-900 rounded-[2rem] border-[12px] border-yellow-500 shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_10px_20px_rgba(255,255,255,0.2)] flex flex-row items-center justify-center p-4 gap-2 z-20 relative overflow-hidden">
            
            {/* Flashing Lights Border */}
            <div className="absolute inset-0 border-8 border-dashed border-yellow-300 animate-[spin_10s_linear_infinite] opacity-30 rounded-[1.5rem]" />

            {/* Phoneme Slot */}
            <div className="w-24 h-32 md:w-32 md:h-40 bg-white border-8 border-gray-300 rounded-xl flex items-center justify-center overflow-hidden shadow-inner relative">
              <AnimatePresence mode="wait">
                {slotState === "idle" && (
                  <motion.span key="old" exit={{ y: -100, opacity: 0 }} className="text-6xl md:text-8xl font-black text-red-600">/{oldPhoneme}/</motion.span>
                )}
                {slotState === "rolling" && (
                  <motion.div key="rolling" animate={{ y: [0, -100, 100, 0] }} transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }} className="flex flex-col gap-8">
                    <span className="text-6xl md:text-8xl font-black text-gray-400">/{oldPhoneme}/</span>
                    <span className="text-6xl md:text-8xl font-black text-gray-400">/{newPhoneme}/</span>
                    <span className="text-6xl md:text-8xl font-black text-gray-400">/?/</span>
                  </motion.div>
                )}
                {(slotState === "selecting" || slotState === "success" || slotState === "error") && (
                  <motion.span key="new" initial={{ y: 100 }} animate={{ y: 0 }} className="text-6xl md:text-8xl font-black text-green-500">/{newPhoneme}/</motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Rest of the word */}
            <div className="flex-1 flex items-center justify-start pl-4">
              <span className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase">
                {originalWord.slice(1)}
              </span>
            </div>
            
          </div>

          {/* Lever */}
          <div className="relative z-10 flex flex-col items-center ml-2">
            <div className="w-12 h-24 bg-gray-800 border-4 border-gray-900 rounded-r-xl" />
            <motion.button 
              animate={slotState === "rolling" ? { rotateX: 60, y: 40 } : { rotateX: 0, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              onClick={handlePullLever}
              disabled={slotState !== "idle"}
              className="absolute -top-16 w-16 h-32 origin-bottom flex flex-col items-center cursor-pointer disabled:opacity-80"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-16 h-16 bg-red-600 rounded-full border-4 border-red-800 shadow-[inset_0_5px_10px_rgba(255,255,255,0.4)] absolute top-0 z-20" />
              <div className="w-6 h-full bg-gradient-to-r from-gray-400 to-gray-500 border-x-2 border-gray-600 z-10 mt-8" />
            </motion.button>
          </div>

        </div>
      </div>

      {/* Bottom: Options Selection */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-12 pb-12 z-20">
        <AnimatePresence>
          {(slotState === "selecting" || slotState === "success" || slotState === "error") && (
            roundData.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isWrong = slotState === "error" && isSelected;
              const isCorrect = slotState === "success" && isSelected;

              return (
                <motion.button
                  key={`opt-${currentRound}-${opt}`}
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.1 : 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  onClick={() => handleSelect(opt)}
                  disabled={slotState !== "selecting"}
                  className={`
                    w-40 h-48 md:w-56 md:h-64
                    bg-gradient-to-t from-orange-800 to-amber-500
                    rounded-[2rem] border-b-[12px] border-b-orange-950 border-[4px] border-yellow-300
                    shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                    flex flex-col items-center justify-center gap-4
                    transition-all duration-300
                    ${isWrong ? 'animate-shake grayscale border-red-500' : 'hover:-translate-y-4'}
                    ${isCorrect ? 'bg-gradient-to-t from-green-600 to-emerald-400 border-b-green-900 border-green-200 shadow-[0_0_80px_#4ade80]' : ''}
                  `}
                >
                  <span className="text-6xl md:text-[6rem] drop-shadow-xl">{EMOJI_MAP[opt] || "❓"}</span>
                  <span className="font-black text-xl md:text-3xl text-white tracking-wider">{opt}</span>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
