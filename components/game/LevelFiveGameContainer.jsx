"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IntroVideoLvl5 } from "./level5/IntroVideoLvl5";
import { GameBalonSukuKata } from "./level5/GameBalonSukuKata";
import { GameMeriamRima } from "./level5/GameMeriamRima";
import { GameTangkapFonem } from "./level5/GameTangkapFonem";
import { GameRakitRoket } from "./level5/GameRakitRoket";
import { GameSulapKembangApi } from "./level5/GameSulapKembangApi";
import { useAudio } from "@/hooks/useAudio";

const LevelCompleteModal = ({ onCompleteLevel }) => {
  const { playAudio } = useAudio();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-[12rem] animate-[bounce_1s_infinite] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">🎇</span>
      <h1 className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(217,70,239,0.8)] mb-12 text-center">FESTIVAL SELESAI!</h1>
      <button 
        onClick={onCompleteLevel} 
        className="
          bg-gradient-to-tr from-fuchsia-600 to-purple-500 
          text-white font-black text-4xl 
          py-6 px-16 rounded-full 
          border-[6px] border-[#FFF]
          border-b-[16px] border-b-purple-900 
          active:border-b-[6px] active:translate-y-[10px] 
          shadow-[0_20px_50px_rgba(192,132,252,0.8),_inset_0_5px_15px_rgba(255,255,255,0.6)]
          transition-all duration-100 ease-out
        "
      >
        Tamat!
      </button>
    </div>
  );
};

export function LevelFiveGameContainer({ initialStep = 0, onClose, onCompleteLevel }) {
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
        return <IntroVideoLvl5 key="step0" onComplete={handleGameComplete} />;
      case 1:
        return <GameBalonSukuKata key="step1" onComplete={handleGameComplete} />;
      case 2:
        return <GameMeriamRima key="step2" onComplete={handleGameComplete} />;
      case 3:
        return <GameTangkapFonem key="step3" onComplete={handleGameComplete} />;
      case 4:
        return <GameRakitRoket key="step4" onComplete={handleGameComplete} />;
      case 5:
        return <GameSulapKembangApi key="step5" onComplete={handleGameComplete} />;
      case 6:
        return <LevelCompleteModal key="step6" onCompleteLevel={() => onCompleteLevel(6)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl text-white font-bold mb-8">Stan Festival ini sedang dibangun Kiko! 🦊🎪</h1>
            <button onClick={handleGameComplete} className="px-8 py-4 bg-fuchsia-600 text-white font-bold rounded-xl border-b-8 border-fuchsia-900 active:translate-y-2 active:border-b-0">Lewati</button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-900 to-fuchsia-900">
      
      {/* Night Sky Background Elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(15,23,42,0.8)_100%)] pointer-events-none" />

      {/* Floating Stars */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={`star-${i}`}
          className="absolute text-yellow-200 animate-[pulse_2s_ease-in-out_infinite]"
          style={{
            fontSize: `${Math.random() * 1.5 + 0.5}rem`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            textShadow: '0 0 10px rgba(253, 224, 71, 0.8)'
          }}
        >
          ✦
        </div>
      ))}

      {/* Close/Back Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-16 h-16 bg-indigo-950 border-4 border-fuchsia-400 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(217,70,239,0.8)] active:scale-95 transition-transform text-white"
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
