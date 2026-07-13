"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IntroVideoLvl6 } from "./level6/IntroVideoLvl6";
import { GamePetiHartaKarun } from "./level6/GamePetiHartaKarun";
import { GrandFinaleModal } from "./level6/GrandFinaleModal";
import { GameJembatanAwan } from "./level6/GameJembatanAwan";
import { GameGerbangCahaya } from "./level6/GameGerbangCahaya";
import { GameCerminAjaib } from "./level6/GameCerminAjaib";
import { GamePenyihirKata } from "./level6/GamePenyihirKata";

export function LevelSixGameContainer({ initialStep = 0, onClose, onCompleteLevel }) {
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
        return <IntroVideoLvl6 key="step0" onComplete={handleGameComplete} />;
      case 1:
        return <GameJembatanAwan key="step1" onComplete={handleGameComplete} />;
      case 2:
        return <GameGerbangCahaya key="step2" onComplete={handleGameComplete} />;
      case 3:
        return <GameCerminAjaib key="step3" onComplete={handleGameComplete} />;
      case 4:
        return <GamePenyihirKata key="step4" onComplete={handleGameComplete} />;
      case 5:
        return <GamePetiHartaKarun key="step5" onComplete={handleGameComplete} />;
      case 6:
        return <GrandFinaleModal key="step6" onCompleteLevel={() => onCompleteLevel(6)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl text-amber-900 font-bold mb-8 drop-shadow-md text-center">Bagian Istana ini<br/>sedang dipoles oleh Kiko! 🦊✨</h1>
            <button onClick={handleGameComplete} className="px-12 py-6 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-black text-2xl rounded-full border-[4px] border-white border-b-[8px] border-b-amber-700 active:translate-y-2 active:border-b-[4px] shadow-xl">Lewati Ruangan</button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-gradient-to-b from-amber-400 via-orange-300 to-yellow-100">
      
      {/* Golden Palace Background Elements */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      {/* Light rays from top */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.8)_0%,_transparent_80%)] pointer-events-none" />

      {/* Floating Sparkles & Crowns */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={`sparkle-${i}`}
          className="absolute text-white animate-[pulse_2s_ease-in-out_infinite]"
          style={{
            fontSize: `${Math.random() * 2 + 1}rem`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            textShadow: '0 0 20px rgba(255, 255, 255, 0.9)'
          }}
        >
          {i % 5 === 0 ? "👑" : "✨"}
        </div>
      ))}

      {/* Close/Back Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-16 h-16 bg-white border-4 border-amber-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(255,255,255,1)] active:scale-95 transition-transform text-amber-900 font-black"
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
