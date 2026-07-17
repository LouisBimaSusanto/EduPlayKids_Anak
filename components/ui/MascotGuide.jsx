"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTTS } from "@/hooks/useAudio";

export function MascotGuide({ instruction, onFinishSpeaking }) {
  const { speak } = useTTS();
  const [isVisible, setIsVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Small delay to let the game render before mascot talks
    const timer = setTimeout(() => {
      setIsSpeaking(true);
      speak(instruction, () => {
        setIsSpeaking(false);
        // Wait a bit after finishing speaking, then slide away
        setTimeout(() => {
          setIsVisible(false);
          if (onFinishSpeaking) onFinishSpeaking();
        }, 800);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [instruction, speak, onFinishSpeaking]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%", x: -50, opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-28 left-4 md:left-12 z-100 flex items-end gap-4 pointer-events-none"
        >
          {/* The Mascot Character (A cute monkey/owl) */}
          <motion.div 
            animate={isSpeaking ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="w-32 h-32 md:w-48 md:h-48 bg-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative"
          >
            {/* Mascot Face */}
            <span className="text-7xl md:text-8xl drop-shadow-lg">🐵</span>
            
            {/* Speaking animation lines */}
            {isSpeaking && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute top-4 right-0 text-3xl"
              >
                🎵
              </motion.div>
            )}
          </motion.div>

          {/* Speech Bubble (Mostly for parents, kids just look at the mascot) */}
          <motion.div 
            initial={{ scale: 0, originBottomLeft: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="bg-white px-6 py-4 rounded-4xl rounded-bl-none border-4 border-gray-200 shadow-xl max-w-50 md:max-w-70"
          >
            <p className="text-xl md:text-2xl font-bold text-gray-700 leading-tight">
              {instruction}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
