"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IntroVideoLvl4 } from "./level4/IntroVideoLvl4";
import { GameMesinMerakit } from "./level4/GameMesinMerakit";
import { GameMesinMembongkar } from "./level4/GameMesinMembongkar";
import { GameTongkatPenghilang } from "./level4/GameTongkatPenghilang";
import { GameMesinMengganti } from "./level4/GameMesinMengganti";
import { GameBrankasAjaib } from "./level4/GameBrankasAjaib";
import { useAudio } from "@/hooks/useAudio";

const LevelCompleteModal = ({ onCompleteLevel }) => {
  const { playAudio } = useAudio();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-[12rem] animate-[bounce_1s_infinite] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">🏭</span>
      <h1 className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(251,146,60,0.8)] mb-12 text-center">Pabrik Selesai!</h1>
      <button 
        onClick={onCompleteLevel} 
        className="
          bg-gradient-to-tr from-yellow-500 to-orange-400 
          text-white font-black text-4xl 
          py-6 px-16 rounded-[2rem] 
          border-[6px] border-[#FFF]
          border-b-[16px] border-b-orange-900 
          active:border-b-[6px] active:translate-y-[10px] 
          shadow-[0_20px_40px_rgba(234,179,8,0.6),_inset_0_5px_15px_rgba(255,255,255,0.6)]
          transition-all duration-100 ease-out
        "
      >
        Kembali ke Peta
      </button>
    </div>
  );
};

export function LevelFourGameContainer({ initialStep = 0, onClose, onCompleteLevel }) {
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
        return <IntroVideoLvl4 key="step0" onComplete={handleGameComplete} />;
      case 1:
        return <GameMesinMerakit key="step1" onComplete={handleGameComplete} />;
      case 2:
        return <GameMesinMembongkar key="step2" onComplete={handleGameComplete} />;
      case 3:
        return <GameTongkatPenghilang key="step3" onComplete={handleGameComplete} />;
      case 4:
        return <GameMesinMengganti key="step4" onComplete={handleGameComplete} />;
      case 5:
        return <GameBrankasAjaib key="step5" onComplete={handleGameComplete} />;
      case 6:
        return <LevelCompleteModal key="step6" onCompleteLevel={() => onCompleteLevel(6)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl text-white font-bold mb-8">Mesin ini sedang diperbaiki Kiko! 🦊🔧</h1>
            <button onClick={handleGameComplete} className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl border-b-8 border-orange-800 active:translate-y-2 active:border-b-0">Selesaikan Otomatis</button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-gradient-to-b from-red-900 via-orange-600 to-yellow-400">
      
      {/* Machinery Background Elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_rgba(251,146,60,0.5)_0%,_transparent_70%)] pointer-events-none" />

      {/* Sparks/Embers flying up */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-yellow-300 blur-[2px] animate-[float_3s_ease-in_infinite]"
          style={{
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            bottom: `-20px`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            boxShadow: '0 0 10px rgba(253, 224, 71, 0.8)'
          }}
        />
      ))}

      {/* Huge Gears in background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 border-[40px] border-dashed border-red-950/20 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] border-[60px] border-dashed border-orange-900/20 rounded-full animate-[spin_30s_linear_infinite_reverse] pointer-events-none" />

      {/* Close/Back Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-16 h-16 bg-red-800 border-4 border-orange-300 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(251,146,60,0.8)] active:scale-95 transition-transform text-white"
      >
        ❌
      </button>

      {/* Main Content Area with Transitions */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, rotateX: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateX: -30 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-full h-full"
            style={{ perspective: 1000 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
