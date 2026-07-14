"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IntroVideoLvl3 } from "./level3/IntroVideoLvl3";
import { GameGelembungBunyi } from "./level3/GameGelembungBunyi";
import { GamePulauSama } from "./level3/GamePulauSama";
import { GamePenyusupLautan } from "./level3/GamePenyusupLautan";
import { GameJaringIkan } from "./level3/GameJaringIkan";
import { GameKapalSelam } from "./level3/GameKapalSelam";
import { useAudio } from "@/hooks/useAudio";

const LevelCompleteModal = ({ onCompleteLevel }) => {
  const { playAudio } = useAudio();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-[12rem] animate-[bounce_2s_infinite] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">🧜‍♀️</span>
      <h1 className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] mb-12 text-center">Menakjubkan!</h1>
      <button 
        onClick={onCompleteLevel} 
        className="
          bg-linear-to-tr from-cyan-400 to-teal-400 
          text-white font-black text-4xl 
          py-6 px-16 rounded-4xl 
          border-[6px] border-[#FFF]
          border-b-16 border-b-cyan-900 
          active:border-b-[6px] active:translate-y-2.5 
          shadow-[0_20px_40px_rgba(34,211,238,0.6),inset_0_5px_15px_rgba(255,255,255,0.6)]
          transition-all duration-100 ease-out
        "
      >
        Kembali ke Peta
      </button>
    </div>
  );
};

export function LevelThreeGameContainer({ initialStep = 0, onClose, onCompleteLevel }) {
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
        return <IntroVideoLvl3 key="step0" onComplete={handleGameComplete} />;
      case 1:
        return <GameGelembungBunyi key="step1" onComplete={handleGameComplete} />;
      case 2:
        return <GamePulauSama key="step2" onComplete={handleGameComplete} />;
      case 3:
        return <GamePenyusupLautan key="step3" onComplete={handleGameComplete} />;
      case 4:
        return <GameJaringIkan key="step4" onComplete={handleGameComplete} />;
      case 5:
        return <GameKapalSelam key="step5" onComplete={handleGameComplete} />;
      case 6:
        return <LevelCompleteModal key="step6" onCompleteLevel={() => onCompleteLevel(6)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl text-white font-bold mb-8">Game ini sedang dibangun Kiko! 🦊🔨</h1>
            <button onClick={handleGameComplete} className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-xl border-b-8 border-cyan-800 active:translate-y-2 active:border-b-0">Selesaikan Otomatis</button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-200 overflow-hidden bg-linear-to-b from-blue-900 via-cyan-700 to-teal-400">
      
      {/* Oceanic Background Elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.3)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Underwater Bubbles */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full border border-white/20 bg-white/5 animate-[float_5s_ease-in_infinite]"
          style={{
            width: `${Math.random() * 40 + 10}px`,
            height: `${Math.random() * 40 + 10}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 5 + 4}s`
          }}
        />
      ))}

      {/* Light Rays from above */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Close/Back Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-16 h-16 bg-blue-900 border-4 border-cyan-300 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(34,211,238,0.8)] active:scale-95 transition-transform text-white"
      >
        ❌
      </button>

      {/* Main Content Area with Transitions */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="w-full h-full"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
