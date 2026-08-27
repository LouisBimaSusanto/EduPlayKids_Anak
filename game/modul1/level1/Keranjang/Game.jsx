"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";

const ROUNDS = [
  { id: 1, word: "Susu", emoji: "🍼", instruction: "Su ... Su. Susu! Ada berapa ketukan? Tarik ke keranjang yang benar!", targetDots: 2, correctOffset: -100 },
  { id: 2, word: "Kelinci", emoji: "🐰", instruction: "Ke ... lin ... ci. Kelinci! Berapa ketukan?", targetDots: 3, correctOffset: 100 },
  { id: 3, word: "Mata", emoji: "👀", instruction: "Ma ... Ta. Mata! Berapa ketukan?", targetDots: 2, correctOffset: -100 },
  { id: 4, word: "Sepeda", emoji: "🚲", instruction: "Se ... Pe ... Da. Sepeda! Berapa ketukan?", targetDots: 3, correctOffset: 100 },
  { id: 5, word: "Roti", emoji: "🍞", instruction: "Ro ... Ti. Roti! Berapa ketukan?", targetDots: 2, correctOffset: -100 }
];

export default function Game({ game, onComplete, onClose }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [dragState, setDragState] = useState("idle"); // idle, dragging, success, fail
  const { speak } = useTTS();

  const roundData = ROUNDS[currentRound];

  useEffect(() => {
    // Mount instruction
    if (dragState === "idle" && roundData) {
      speak(roundData.instruction);
    }
  }, [currentRound, roundData, dragState, speak]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    
    // Check if dragged to the correct side
    const isLeftCorrect = roundData.correctOffset < 0;
    const isRightCorrect = roundData.correctOffset > 0;
    
    const isDraggedLeft = offset < -100;
    const isDraggedRight = offset > 100;

    if ((isLeftCorrect && isDraggedLeft) || (isRightCorrect && isDraggedRight)) {
      setDragState("success");
      speak(`Pintar! ${roundData.word}! ${roundData.targetDots} ketukan!`);
      
      setTimeout(() => {
        if (currentRound < ROUNDS.length - 1) {
          setCurrentRound(prev => prev + 1);
          setDragState("idle");
        } else {
          onComplete({ completed: true, score: 100 });
        }
      }, 3000);
    } 
    // Wrong side
    else if ((isLeftCorrect && isDraggedRight) || (isRightCorrect && isDraggedLeft)) {
      setDragState("fail");
      speak(`Oh oh, coba hitung lagi! ${roundData.instruction}`);
      setTimeout(() => {
        setDragState("idle");
      }, 1500);
    }
  };

  if (!roundData) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between p-8 relative overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-600 to-emerald-400">
        
        {/* Progress Info */}
        <div className="absolute top-8 left-8 z-30 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/20">
          <span className="text-2xl font-black text-white">
            {currentRound + 1} / {ROUNDS.length}
          </span>
        </div>

        {/* Title / Helper Text */}
        <div className="w-full flex justify-center pt-8 z-30">
          <div className="bg-black/40 backdrop-blur-md px-8 py-4 rounded-full border-4 border-white/20">
            <span className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] uppercase tracking-widest">
              {roundData.word}
            </span>
          </div>
        </div>

      {/* Center Action Area */}
      <div className="flex-1 w-full flex flex-row items-center justify-between relative mt-8">
        
        {/* Left Basket (2 Dots) */}
        <div className="flex flex-col items-center z-10 w-1/3">
          <div className="relative group perspective-[1000px]">
             {/* 3D Basket */}
             <div className="text-7xl md:text-[14rem] drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]">🧺</div>
             {/* The 2 Dots Label */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-6 py-3 rounded-full border-4 border-[#8E2DE2] shadow-xl flex gap-2">
               <div className="w-8 h-8 rounded-full bg-[#8E2DE2]" />
               <div className="w-8 h-8 rounded-full bg-[#8E2DE2]" />
             </div>
             {/* Glowing drop target highlight */}
             <div className={`absolute inset-0 rounded-[4rem] transition-colors blur-xl ${dragState === "idle" ? 'bg-green-400/0 group-hover:bg-green-400/20' : ''}`} />
          </div>
        </div>

        {/* Center Conveyor Belt & Draggable Item */}
        <div className="flex flex-col items-center justify-center relative w-1/3 h-full z-20">
          
          {/* Conveyor Belt Background */}
          <div className="absolute bottom-1/4 w-[200%] h-16 bg-[#3D1F0A] rounded-full border-t-8 border-t-[#5C2E0F] border-b-8 border-b-[#1A0A00] shadow-[0_20px_30px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Belt lines moving */}
            <div className="w-[200%] h-full flex gap-8 animate-[track-flow_2s_linear_infinite] opacity-50">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-4 h-full bg-black/40" />
              ))}
            </div>
          </div>

          {/* Draggable Item */}
          <AnimatePresence mode="popLayout">
            {dragState !== "success" && (
              <motion.div
                key={`item-${currentRound}`}
                initial={{ scale: 0, opacity: 0, x: 200 }}
                animate={dragState === "fail" ? { x: [0, -20, 20, -20, 20, 0] } : { scale: 1, opacity: 1, x: 0, y: [0, -10, 0] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={dragState === "fail" ? { duration: 0.5 } : { x: { type: "spring", bounce: 0.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                drag="x"
                dragConstraints={{ left: -150, right: 150 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                className="text-7xl md:text-[12rem] cursor-grab drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] z-30 mb-16"
              >
                {roundData.emoji}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Magical sparkle if success */}
          {dragState === "success" && (
             <motion.div
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: [0, 1, 0], scale: [0.5, 3, 5] }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className={`absolute z-40 bg-[radial-gradient(circle,rgba(255,215,0,1)_0%,transparent_60%)] mix-blend-screen pointer-events-none w-64 h-64 ${roundData.correctOffset < 0 ? '-translate-x-full' : 'translate-x-full'}`}
             />
          )}

        </div>

        {/* Right Basket (3 Dots) */}
        <div className="flex flex-col items-center z-10 w-1/3">
          <div className="relative group perspective-[1000px]">
             {/* 3D Basket */}
             <div className="text-7xl md:text-[14rem] drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]">🧺</div>
             {/* The 3 Dots Label */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-6 py-3 rounded-full border-4 border-[#F5A623] shadow-xl flex gap-2">
               <div className="w-6 h-6 rounded-full bg-[#F5A623]" />
               <div className="w-6 h-6 rounded-full bg-[#F5A623]" />
               <div className="w-6 h-6 rounded-full bg-[#F5A623]" />
             </div>
             {/* Glowing drop target highlight */}
             <div className={`absolute inset-0 rounded-[4rem] transition-colors blur-xl ${dragState === "idle" ? 'bg-red-400/0 group-hover:bg-red-400/20' : ''}`} />
          </div>
        </div>

      </div>

      </div>
    </>
  );
}
