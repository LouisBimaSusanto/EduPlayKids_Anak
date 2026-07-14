"use client";

import { useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { MascotGuide } from "@/components/ui/MascotGuide";

export function MechanicBalonTepuk({ onComplete }) {
  const { playSound } = useAudio();
  const [guideFinished, setGuideFinished] = useState(false);
  
  const [balloons, setBalloons] = useState([
    { id: 1, color: "bg-red-400", floatClass: "animate-[float_3s_ease-in-out_infinite]" },
    { id: 2, color: "bg-blue-400", floatClass: "animate-[float_4s_ease-in-out_infinite_0.5s]" },
    { id: 3, color: "bg-green-400", floatClass: "animate-[float_3.5s_ease-in-out_infinite_1s]" },
  ]);

  const handleDrumTap = () => {
    if (balloons.length === 0) return;
    
    playSound("bloop");

    // Pop the last balloon
    setBalloons(prev => {
      const newBalloons = [...prev];
      newBalloons.pop();
      return newBalloons;
    });

    if (balloons.length === 1) { // 1 left means it will be 0 now
      playSound("success");
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 w-full h-full relative">
      
      {/* Floating Balloons Area */}
      <div className="flex-1 w-full flex justify-center items-end pb-20 gap-8 md:gap-16 relative">
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-40px) rotate(5deg); }
          }
        `}</style>
        
        {balloons.map((b) => (
          <div key={b.id} className={`relative flex flex-col items-center ${b.floatClass}`}>
            <div className={`
              w-24 h-32 md:w-32 md:h-40 ${b.color} rounded-[50%] 
              shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),inset_10px_10px_20px_rgba(255,255,255,0.4)]
            `} />
            <div className="w-1 h-16 bg-gray-300 mt-2" />
          </div>
        ))}
      </div>

      {/* Massive 3D Drum Button */}
      <div className="mb-12">
        <button
          onPointerDown={handleDrumTap}
          className="
            relative w-64 h-64 md:w-80 md:h-80 rounded-full 
            bg-linear-to-b from-yellow-300 to-orange-400
            border-8 border-white
            border-b-24 border-b-orange-600
            shadow-[0_20px_30px_rgba(0,0,0,0.3),inset_0_10px_0_rgba(255,255,255,0.5)]
            active:border-b-8 active:translate-y-4 active:shadow-[0_10px_15px_rgba(0,0,0,0.3),inset_0_5px_0_rgba(255,255,255,0.5)]
            transition-all duration-75 ease-out
            flex items-center justify-center
          "
        >
          <span className="text-8xl md:text-9xl drop-shadow-xl">🥁</span>
        </button>
      </div>

      {/* Mascot Guide Overlay */}
      {!guideFinished && (
        <MascotGuide 
          instruction="Pukul drum untuk memecahkan balon!" 
          onFinishSpeaking={() => setGuideFinished(true)} 
        />
      )}
    </div>
  );
}
