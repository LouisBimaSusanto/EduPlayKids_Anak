"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IntroVideoLvl2 } from "./level2/IntroVideoLvl2";
import { GameKembarRima } from "./level2/GameKembarRima";
import { GameKatakLompat } from "./level2/GameKatakLompat";
import { GameRumahKembar } from "./level2/GameRumahKembar";
import { GamePintuOnset } from "./level2/GamePintuOnset";
import { GameSulapKiko } from "./level2/GameSulapKiko";
import { useAudio } from "@/hooks/useAudio";

const LevelCompleteModal = ({ onCompleteLevel }) => {
  const { playAudio } = useAudio();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-[12rem] animate-[bounce_1s_infinite] mb-8">🔮</span>
      <h1 className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] mb-12 text-center">Luar Biasa!</h1>
      <button 
        onClick={onCompleteLevel} 
        className="
          bg-gradient-to-tr from-fuchsia-400 to-purple-500 
          text-white font-black text-4xl 
          py-6 px-16 rounded-[2rem] 
          border-[6px] border-[#FFF]
          border-b-[16px] border-b-purple-900 
          active:border-b-[6px] active:translate-y-[10px] 
          shadow-[0_20px_40px_rgba(236,72,153,0.6),_inset_0_5px_15px_rgba(255,255,255,0.6)]
          transition-all duration-100 ease-out
        "
      >
        Kembali ke Peta
      </button>
    </div>
  );
};

export function LevelTwoGameContainer({ initialStep = 0, onClose, onCompleteLevel }) {
  // 1 Node = 1 Game philosophy
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
        return <IntroVideoLvl2 key="step0" onComplete={handleGameComplete} />;
      case 1:
        return <GameKembarRima key="step1" onComplete={handleGameComplete} />;
      case 2:
        return <GameKatakLompat key="step2" onComplete={handleGameComplete} />;
      case 3:
        return <GameRumahKembar key="step3" onComplete={handleGameComplete} />;
      case 4:
        return <GamePintuOnset key="step4" onComplete={handleGameComplete} />;
      case 5:
        return <GameSulapKiko key="step5" onComplete={handleGameComplete} />;
      case 6:
        return <LevelCompleteModal key="step6" onCompleteLevel={() => onCompleteLevel(6)} />;
      default:
        // Temporary fallback for unimplemented games
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl text-white font-bold mb-8">Game ini sedang dibangun Kiko! 🦊🔨</h1>
            <button onClick={handleGameComplete} className="px-8 py-4 bg-purple-500 text-white font-bold rounded-xl border-b-8 border-purple-800 active:translate-y-2 active:border-b-0">Selesaikan Otomatis</button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-gradient-to-b from-violet-900 via-purple-600 to-fuchsia-400">
      
      {/* Magical Purple Background Elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.3)_0%,_transparent_70%)] pointer-events-none" />

      {/* Floating Orbs */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white/20 blur-[10px] animate-[float_4s_ease-in-out_infinite]"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Close/Back Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-16 h-16 bg-fuchsia-900 border-4 border-fuchsia-300 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(236,72,153,0.8)] active:scale-95 transition-transform text-white"
      >
        ❌
      </button>

      {/* Main Content Area with Transitions */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -100 }}
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
