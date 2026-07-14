"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroVideo } from "./level1/IntroVideo";
import { GameBatuLoncatan } from "./level1/GameBatuLoncatan";
import { GameKereta } from "./level1/GameKereta";
import { GamePaluEs } from "./level1/GamePaluEs";
import { GamePancuran } from "./level1/GamePancuran";
import { GameKeranjang } from "./level1/GameKeranjang";
import { useAudio } from "@/hooks/useAudio";

// Placeholders for remaining steps
const LevelCompleteModal = ({ onCompleteLevel }) => {
  const { playAudio } = useAudio();
  
  // Play a celebratory sound on mount if we had one, for now just basic UI
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-[12rem] animate-bounce mb-8">🎉</span>
      <h1 className="text-6xl font-black text-white drop-shadow-lg mb-12 text-center">Horeee! Selesai!</h1>
      <button 
        onClick={onCompleteLevel} 
        className="
          bg-linear-to-tr from-[#00E5C8] to-[#00FFD1] 
          text-[#004D40] font-black text-4xl 
          py-6 px-16 rounded-4xl 
          border-[6px] border-[#FFF]
          border-b-16 border-b-[#008A79] 
          active:border-b-[6px] active:translate-y-2.5 
          shadow-[0_20px_40px_rgba(0,229,200,0.4),inset_0_5px_15px_rgba(255,255,255,0.6)]
          transition-all duration-100 ease-out
        "
      >
        Kembali ke Peta
      </button>
    </div>
  );
};

export function LevelOneGameContainer({ initialStep = 0, onClose, onCompleteLevel }) {
  // Step 0: Intro Video
  // Step 1: Game 1
  // Step 2: Game 2
  // ...
  // Step 6: Level Complete
  // Since each node represents exactly ONE game, we don't need internal state transitions.
  // The step is strictly determined by the initialStep prop passed from the active node.
  const currentStep = initialStep;

  const handleClose = () => {
    onClose(currentStep);
  };

  const handleGameComplete = () => {
    onCompleteLevel(currentStep);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <IntroVideo key="step0" onComplete={handleGameComplete} />;
      case 1:
        return <GameBatuLoncatan key="step1" onComplete={handleGameComplete} />;
      case 2:
        return <GameKereta key="step2" onComplete={handleGameComplete} />;
      case 3:
        return <GamePaluEs key="step3" onComplete={handleGameComplete} />;
      case 4:
        return <GamePancuran key="step4" onComplete={handleGameComplete} />;
      case 5:
        return <GameKeranjang key="step5" onComplete={handleGameComplete} />;
      case 6:
        return <LevelCompleteModal key="step6" onCompleteLevel={() => onCompleteLevel(6)} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-200 overflow-hidden bg-linear-to-t from-indigo-900 via-purple-600 to-emerald-400">
      
      {/* Magical Background Elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* Progress Bar (Optional, for visual feedback) */}
      {currentStep > 0 && currentStep < 6 && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2/3 max-w-md h-6 bg-black/30 rounded-full border-4 border-white/20 p-1 z-50">
          <motion.div 
            className="h-full bg-linear-to-r from-yellow-400 to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Close/Back Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg active:scale-95 transition-transform"
      >
        ❌
      </button>

      {/* Main Content Area with Transitions */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, x: -100 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-full h-full"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
