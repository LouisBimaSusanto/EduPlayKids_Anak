"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_5_DATA } from "./data";

const EMOJI_MAP = {
  "Topi": "🧢", "Sapi": "🐄", "Meja": "🪑",
  "Baju": "👕", "Buku": "📚", "Bola": "⚽",
  "Kuda": "🐴", "Tari": "💃", "Bata": "🧱",
  "Mata": "👁️", "Kuku": "💅", "Susu": "🍼"
};

export function GameRakitRoket({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [rocketState, setRocketState] = useState("idle"); // idle, dropping, assembled, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_5_DATA.game4_RakitRoket[currentRound];
  const letters = roundData?.audio.split(" ").filter(l => l.trim() !== "");

  useEffect(() => {
    if (rocketState === "idle" && roundData) {
      setRocketState("dropping");
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, rocketState, speak]);

  const handleAssemble = () => {
    if (rocketState !== "dropping") return;
    
    setRocketState("assembled");
    playSound("bloop"); // Metal clanking sound ideal
    
    setTimeout(() => {
      setRocketState("selecting");
      speak("Pilih yang mana?");
    }, 2000);
  };

  const handleSelect = (option) => {
    if (rocketState !== "selecting") return;
    
    setSelectedOption(option);
    
    if (option === roundData.target) {
      setRocketState("success");
      playSound("magic"); // Rocket launch sound ideal
      speak(`Hebat! ${option}! Roket Meluncur!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setRocketState("idle");
          setSelectedOption(null);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      setRocketState("error");
      speak("Wah, roketnya gagal meluncur. Coba yang lain!");
      
      setTimeout(() => {
        setRocketState("selecting");
        setSelectedOption(null);
      }, 2000);
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-indigo-900/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-fuchsia-400/50">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / 5
        </span>
      </div>

      {/* Top: The Rocket Assembly Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center mt-8 relative z-20">
        
        {/* Launch Pad Base */}
        <div className="absolute bottom-16 w-80 h-12 bg-slate-700 border-x-8 border-t-8 border-slate-900 rounded-t-2xl z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />

        <div className="relative h-64 w-full max-w-sm flex flex-col items-center justify-end z-20 mb-16 pb-4">
          <AnimatePresence>
            
            {/* Dropping Parts */}
            {rocketState === "dropping" && (
              <div className="flex flex-col-reverse gap-1 items-center">
                {letters.map((letter, i) => (
                  <motion.div 
                    key={`part-${i}`}
                    initial={{ y: -300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: (letters.length - i) * 0.3 }}
                    className={`
                      flex items-center justify-center border-4 border-fuchsia-900 shadow-lg bg-indigo-500
                      ${i === 0 ? 'w-24 h-24 rounded-t-full bg-gradient-to-t from-indigo-500 to-fuchsia-400' : 'w-28 h-16'}
                      ${i === letters.length - 1 ? 'w-32 h-16 rounded-b-xl border-b-8' : ''}
                    `}
                  >
                    <span className="text-3xl font-black text-white">{letter}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Assembled Rocket */}
            {(rocketState === "assembled" || rocketState === "selecting" || rocketState === "success" || rocketState === "error") && (
              <motion.div 
                initial={{ scale: 1.1 }}
                animate={rocketState === "success" ? { y: -800, scale: 0.5 } : { scale: 1 }}
                transition={rocketState === "success" ? { duration: 1.5, ease: "easeIn" } : { duration: 0.3 }}
                className={`flex flex-col items-center ${rocketState === "error" ? 'animate-shake' : ''}`}
              >
                <div className="w-24 h-24 rounded-t-full bg-gradient-to-t from-indigo-500 to-fuchsia-400 border-4 border-fuchsia-900 flex items-center justify-center">
                   <span className="text-3xl font-black text-white">{letters[0]}</span>
                </div>
                <div className="w-28 h-32 bg-indigo-500 border-x-4 border-fuchsia-900 flex flex-col items-center justify-center">
                   <span className="text-2xl font-black text-white">...</span>
                </div>
                <div className="w-32 h-16 bg-indigo-600 border-4 border-fuchsia-900 rounded-b-xl flex items-center justify-center relative">
                   <span className="text-3xl font-black text-white">{letters[letters.length - 1]}</span>
                   {/* Thrusters */}
                   <div className="absolute -bottom-8 -left-4 w-12 h-12 bg-slate-800 rounded-b-full border-4 border-slate-900" />
                   <div className="absolute -bottom-8 -right-4 w-12 h-12 bg-slate-800 rounded-b-full border-4 border-slate-900" />
                </div>
                
                {/* Fire Effect */}
                {rocketState === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    className="mt-6 text-[5rem] origin-top animate-[pulse_0.1s_infinite]"
                  >
                    🔥
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* The Giant Assemble Button */}
        <AnimatePresence>
          {rocketState === "dropping" && (
            <motion.button
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              onClick={handleAssemble}
              className="absolute bottom-0 w-64 h-20 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full border-[8px] border-indigo-900 shadow-[0_20px_30px_rgba(0,0,0,0.8),_inset_0_5px_15px_rgba(255,255,255,0.4)] flex items-center justify-center text-3xl font-black text-white hover:scale-105 active:scale-95 z-40 transition-transform tracking-widest"
            >
              GABUNG!
            </motion.button>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom: Options Selection */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-16 pb-12 z-20">
        <AnimatePresence>
          {(rocketState === "selecting" || rocketState === "success" || rocketState === "error") && (
            roundData.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isWrong = rocketState === "error" && isSelected;
              const isCorrect = rocketState === "success" && isSelected;

              return (
                <motion.button
                  key={`opt-${currentRound}-${opt}`}
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.2 : 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  onClick={() => handleSelect(opt)}
                  disabled={rocketState !== "selecting"}
                  className={`
                    w-40 h-40 md:w-56 md:h-56
                    bg-gradient-to-tr from-indigo-800 to-purple-600
                    rounded-[3rem] border-b-[12px] border-b-indigo-950 border-[4px] border-fuchsia-300
                    shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                    flex flex-col items-center justify-center
                    transition-all duration-300
                    ${isWrong ? 'animate-[shake_0.5s_ease-in-out] grayscale border-red-500' : 'hover:-translate-y-4'}
                    ${isCorrect ? 'bg-gradient-to-t from-fuchsia-500 to-purple-400 border-b-purple-900 shadow-[0_0_80px_rgba(217,70,239,1)] z-50' : ''}
                  `}
                >
                  <span className="text-6xl md:text-[6rem] drop-shadow-xl">{EMOJI_MAP[opt] || "❓"}</span>
                  <span className="mt-4 font-bold text-white bg-black/40 px-4 py-1 rounded-full">{opt}</span>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
