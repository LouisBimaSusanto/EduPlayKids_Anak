"use client";

import { useState, useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";
import { MascotGuide } from "@/components/ui/MascotGuide";

const ICONS = ["🦆", "🐄", "🐘", "🐕"];
const TARGET_ICON = "🦆";

export function MechanicKunangKunang({ onComplete }) {
  const { playSound } = useAudio();
  const [items, setItems] = useState([]);
  const [guideFinished, setGuideFinished] = useState(false);
  
  useEffect(() => {
    // Shuffle the items for the 2x2 grid
    const shuffled = [...ICONS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, []);

  const handleTap = (icon, e) => {
    // Simple Squash-and-Stretch CSS trigger via class toggle
    const el = e.currentTarget;
    el.classList.add("scale-y-75", "scale-x-110");
    setTimeout(() => {
      el.classList.remove("scale-y-75", "scale-x-110");
    }, 150);

    if (icon === TARGET_ICON) {
      playSound("success");
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    } else {
      playSound("fail");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full h-full relative">
      
      {/* 2x2 Whack-A-Mole Grid */}
      <div className="grid grid-cols-2 gap-8 md:gap-16 w-full max-w-lg">
        {items.map((icon, index) => (
          <button
            key={index}
            onPointerDown={(e) => handleTap(icon, e)}
            className="
              relative w-36 h-36 md:w-56 md:h-56 rounded-full mx-auto
              bg-gradient-to-b from-sky-300 to-blue-500
              border-8 border-white
              border-b-[20px] border-b-blue-700
              shadow-[0_15px_25px_rgba(0,0,0,0.3),_inset_0_8px_0_rgba(255,255,255,0.6)]
              active:border-b-[6px] active:translate-y-[14px] active:shadow-[0_5px_10px_rgba(0,0,0,0.3),_inset_0_3px_0_rgba(255,255,255,0.6)]
              transition-all duration-100 ease-out
              flex items-center justify-center
            "
          >
            {/* The Bug/Mole Icon */}
            <span className="text-6xl md:text-8xl drop-shadow-lg pointer-events-none">{icon}</span>
          </button>
        ))}
      </div>

      {/* Mascot Guide Overlay */}
      {!guideFinished && (
        <MascotGuide 
          instruction="Tangkap Bebek!" 
          onFinishSpeaking={() => setGuideFinished(true)} 
        />
      )}
    </div>
  );
}
