"use client";

import { BouncyButton } from "../ui/BouncyButton";
import { Star } from "lucide-react";

export function SuccessModal({ isOpen, onNext, stars = 3 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-success/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 max-w-sm md:max-w-2xl w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-75 duration-500 delay-100">
        
        <h2 className="text-4xl md:text-6xl font-black text-primary mb-6 md:mb-10 drop-shadow-sm">Awesome!</h2>

        <div className="flex gap-2 md:gap-6 mb-8 md:mb-12 justify-center">
          {[...Array(3)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-16 h-16 md:w-28 md:h-28 ${i < stars ? "fill-primary text-primary animate-bounce delay-" + (i * 100) : "fill-gray-200 text-gray-200"}`} 
            />
          ))}
        </div>

        <BouncyButton 
          variant="secondary" 
          size="lg" 
          className="w-full text-2xl md:text-4xl md:py-8 md:rounded-4xl" 
          onClick={onNext}
          sound="success"
        >
          Next Level
        </BouncyButton>
      </div>
    </div>
  );
}
