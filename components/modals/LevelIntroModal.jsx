"use client";

import { BouncyButton } from "../ui/BouncyButton";
import { Play, X } from "lucide-react";

export function LevelIntroModal({ isOpen, onClose, onCancel, character = "Ara", chapterTitle = "Story World", mission = "Let's find the matching shapes!" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 max-w-sm md:max-w-xl w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300 relative">
        
        {/* Close Button */}
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full active:scale-95 transition-transform"
          >
            <X className="w-8 h-8 text-gray-500" />
          </button>
        )}

        {/* Placeholder for Character Image */}
        <div className="w-32 h-32 md:w-48 md:h-48 bg-secondary rounded-full border-8 border-white shadow-lg mb-6 md:mb-10 flex items-center justify-center -mt-20 md:-mt-28">
          <span className="text-4xl font-bold text-white">{character[0]}</span>
        </div>

        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold mb-4 border-2 border-primary/20">
          {chapterTitle}
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Hello!</h2>
        <p className="text-xl md:text-3xl text-gray-600 mb-8 md:mb-12">{mission}</p>

        <BouncyButton 
          variant="primary" 
          size="lg" 
          className="w-full text-2xl md:text-3xl md:py-8 md:rounded-4xl" 
          onClick={onClose}
          sound="success"
        >
          <Play className="mr-2 h-8 w-8 md:h-12 md:w-12 fill-current" /> Let's Go!
        </BouncyButton>
      </div>
    </div>
  );
}
