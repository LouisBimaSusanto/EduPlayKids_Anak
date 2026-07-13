"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { LEVEL_4_DATA } from "./data";

const EMOJI_MAP = {
  "Baju": "👕", "Buku": "📚", "Topi": "🧢",
  "Sapi": "🐄", "Bola": "⚽", "Meja": "🪑",
  "Kuda": "🐴", "Tari": "💃"
};

export function GameMesinMerakit({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [machineState, setMachineState] = useState("idle"); // idle, dropping, assembling, selecting, success, error
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { speak } = useTTS();
  const { playSound } = useAudio();

  const roundData = LEVEL_4_DATA.game1_MesinMerakit[currentRound];
  const letters = roundData?.audio.split(" ").filter(l => l.trim() !== "");

  useEffect(() => {
    if (machineState === "idle" && roundData) {
      setMachineState("dropping");
      const timer = setTimeout(() => {
        speak(roundData.audio);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, roundData, machineState, speak]);

  const handleAssemble = () => {
    if (machineState !== "dropping") return;
    
    setMachineState("assembling");
    playSound("bloop"); // Ideally a mechanical sound
    
    setTimeout(() => {
      setMachineState("selecting");
      speak("Jadi apa ya?");
    }, 2000);
  };

  const handleSelect = (option) => {
    if (machineState !== "selecting") return;
    
    setSelectedOption(option);
    
    if (option === roundData.target) {
      setMachineState("success");
      playSound("magic");
      speak(`Benar! ${option}!`);
      
      setTimeout(() => {
        if (currentRound < 4) {
          setCurrentRound(prev => prev + 1);
          setMachineState("idle");
          setSelectedOption(null);
        } else {
          onComplete();
        }
      }, 3500);
    } else {
      setMachineState("error");
      speak("Ups, mesinnya salah rakit. Coba lagi!");
      
      setTimeout(() => {
        setMachineState("selecting");
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

      {/* Top: The Assembly Machine */}
      <div className="w-full flex-1 flex flex-col items-center justify-start mt-12 relative z-20">
        
        {/* Conveyor Belt Area */}
        <div className="relative w-full max-w-3xl h-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] border-8 border-gray-700 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden mt-8">
          
          {/* Conveyor Belt Texture (Moving) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50 animate-[slide_2s_linear_infinite]" />
          
          <AnimatePresence>
            {machineState === "dropping" && (
              <motion.div 
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex gap-4 z-20"
              >
                {letters.map((letter, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: -200 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", bounce: 0.5, delay: i * 0.3 + 0.5 }}
                    className="w-20 h-20 md:w-28 md:h-28 bg-orange-100 border-8 border-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <span className="text-4xl md:text-5xl font-black text-orange-900">{letter}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Assemble Animation (Smash effect) */}
            {machineState === "assembling" && (
              <motion.div 
                initial={{ y: -300 }}
                animate={{ y: 0 }}
                exit={{ y: -300 }}
                transition={{ type: "spring", bounce: 0.2 }}
                className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-slate-400 to-slate-600 border-b-8 border-slate-800 z-30 flex items-end justify-center pb-4 shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
              >
                <span className="text-4xl font-black text-slate-800 animate-pulse">⚙️ MERAKIT... ⚙️</span>
              </motion.div>
            )}

            {/* Result Appears */}
            {(machineState === "selecting" || machineState === "success" || machineState === "error") && (
               <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="z-20 flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-yellow-200 border-8 border-yellow-500 rounded-[2rem] shadow-[0_0_30px_rgba(234,179,8,0.8)]"
              >
                <span className="text-[5rem] animate-pulse">❓</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Giant Assemble Button */}
        <AnimatePresence>
          {machineState === "dropping" && (
            <motion.button
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              onClick={handleAssemble}
              className="absolute -bottom-16 w-48 h-48 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-[12px] border-red-900 shadow-[0_20px_30px_rgba(0,0,0,0.8),_inset_0_10px_20px_rgba(255,255,255,0.4)] flex items-center justify-center text-4xl font-black text-white hover:scale-105 active:scale-95 z-40 transition-transform"
            >
              RAKIT!
            </motion.button>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom: Options Selection */}
      <div className="w-full flex-1 flex flex-row items-end justify-center gap-6 md:gap-16 pb-12 z-20">
        <AnimatePresence>
          {(machineState === "selecting" || machineState === "success" || machineState === "error") && (
            roundData.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isWrong = machineState === "error" && isSelected;
              const isCorrect = machineState === "success" && isSelected;

              return (
                <motion.button
                  key={`opt-${currentRound}-${opt}`}
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: isCorrect ? 1.2 : 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  onClick={() => handleSelect(opt)}
                  disabled={machineState !== "selecting"}
                  className={`
                    w-40 h-40 md:w-56 md:h-56
                    bg-gradient-to-t from-orange-800 to-amber-600
                    rounded-[3rem] border-b-[12px] border-b-orange-950 border-[4px] border-amber-300
                    shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                    flex flex-col items-center justify-center
                    transition-all duration-300
                    ${isWrong ? 'animate-[shake_0.5s_ease-in-out] grayscale border-red-500' : 'hover:-translate-y-4'}
                    ${isCorrect ? 'bg-gradient-to-t from-green-600 to-emerald-400 border-b-green-900 shadow-[0_0_80px_#4ade80]' : ''}
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

      <style jsx global>{`
        @keyframes slide {
          from { background-position: 0 0; }
          to { background-position: 100px 0; }
        }
      `}</style>
    </div>
  );
}
