"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTTS } from "@/hooks/useAudio";

const ROUNDS = [
  { id: 1, name: "Ara", emoji: "🦜", targetTaps: 2, instruction: "A... ra. Dua ketukan! Tekan daun dua kali." },
  { id: 2, name: "Kiko", emoji: "🦊", targetTaps: 2, instruction: "Ki... ko. Dua ketukan! Bantu Kiko menyeberang." },
  { id: 3, name: "Monyet", emoji: "🐒", targetTaps: 2, instruction: "Mo... nyet. Dua ketukan!" },
  { id: 4, name: "Harimau", emoji: "🐯", targetTaps: 3, instruction: "Ha... ri... mau. Tiga ketukan! Tekan tiga kali." },
  { id: 5, name: "Kelinci", emoji: "🐰", targetTaps: 3, instruction: "Ke... lin... ci. Tiga ketukan!" },
];

export function GameBatuLoncatan({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [taps, setTaps] = useState(0);
  const [isCrossing, setIsCrossing] = useState(false);
  const { speak } = useTTS();

  const roundData = ROUNDS[currentRound];

  useEffect(() => {
    // Mount instruction for the specific round
    if (!isCrossing && roundData) {
      speak(roundData.instruction);
    }
  }, [currentRound, roundData, isCrossing, speak]);

  const handleTap = () => {
    if (taps < roundData.targetTaps && !isCrossing) {
      const newTaps = taps + 1;
      setTaps(newTaps);
      
      if (newTaps === roundData.targetTaps) {
        setIsCrossing(true);
        speak(`Hore! ${roundData.name} berhasil menyeberang!`);
        
        setTimeout(() => {
          if (currentRound < ROUNDS.length - 1) {
            setCurrentRound(prev => prev + 1);
            setTaps(0);
            setIsCrossing(false);
          } else {
            onComplete();
          }
        }, 3000);
      } else {
        speak(newTaps.toString());
      }
    }
  };

  if (!roundData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 relative">
      
      {/* Progress Info */}
      <div className="absolute top-8 left-8 z-30 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/20">
        <span className="text-2xl font-black text-white">
          {currentRound + 1} / {ROUNDS.length}
        </span>
      </div>

      {/* Background River Element */}
      <div className="absolute inset-x-0 top-1/3 bottom-1/3 bg-gradient-to-b from-[#00E5C8]/20 via-[#00E5C8]/40 to-[#00E5C8]/20 backdrop-blur-sm -z-10 animate-[pulse-glow_4s_infinite] flex items-center justify-center gap-8 md:gap-16">
        {/* Render the Lilypads on the river */}
        <AnimatePresence>
          {Array.from({ length: roundData.targetTaps }).map((_, i) => (
            <motion.div
              key={`${currentRound}-${i}`}
              initial={{ opacity: 0, scale: 0, y: 50 }}
              animate={taps > i ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="text-[8rem] md:text-[12rem] drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
            >
              🍃
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Area: Character */}
      <div className="w-full flex justify-start items-end flex-1 relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`char-${currentRound}`}
            initial={{ x: -200, opacity: 0 }}
            animate={
              isCrossing 
                ? { x: 500, y: [0, -50, 0, -50, 0, -50, 0], opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }
                : { x: taps * 80, y: taps > 0 ? [0, -30, 0] : 0, opacity: 1 }
            }
            exit={{ x: 800, opacity: 0 }}
            transition={{ 
              x: { type: "spring", bounce: 0.4 },
              y: { duration: 0.5, ease: "easeInOut" }
            }}
            className="absolute left-10 bottom-0 text-[12rem] md:text-[16rem] drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] z-20"
          >
            {roundData.emoji}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Area: Massive 3D Interaction Button */}
      <div className="w-full flex justify-center pb-12 z-20 relative">
        {/* Confetti overlay for successful round */}
        <AnimatePresence>
          {isCrossing && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute bottom-20 z-10 bg-[radial-gradient(circle,_rgba(0,255,128,0.8)_0%,_transparent_70%)] mix-blend-screen pointer-events-none w-64 h-64"
            />
          )}
        </AnimatePresence>

        <button 
          onClick={handleTap}
          disabled={taps >= roundData.targetTaps || isCrossing}
          className={`
            bg-gradient-to-tr from-green-500 to-emerald-300 
            text-white font-black text-6xl md:text-8xl 
            py-8 px-16 md:py-12 md:px-24
            rounded-[4rem] 
            border-[8px] border-[#FFF]
            border-b-[24px] border-b-green-700 
            shadow-[0_20px_40px_rgba(0,255,0,0.4),_inset_0_10px_20px_rgba(255,255,255,0.6)]
            active:border-b-[8px] active:translate-y-[16px] 
            active:shadow-[0_10px_20px_rgba(0,255,0,0.4),_inset_0_5px_10px_rgba(255,255,255,0.6)]
            transition-all duration-100 ease-out z-20
            ${(taps < roundData.targetTaps && !isCrossing) ? 'animate-[bounce_2s_infinite]' : 'opacity-50 grayscale cursor-not-allowed transform translate-y-[16px] border-b-[8px]'}
          `}
        >
          🍃 TAP!
        </button>
      </div>

    </div>
  );
}
