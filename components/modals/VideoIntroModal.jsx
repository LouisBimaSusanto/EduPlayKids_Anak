"use client";

import { useTTS } from "@/hooks/useAudio";

export function VideoIntroModal({ isOpen, onStart }) {
  const { speak } = useTTS();

  if (!isOpen) return null;

  const handleStart = () => {
    speak("Ayo kita mulai!");
    if (onStart) onStart();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4">
      
      {/* Nice 3D TV Container for the Video */}
      <div className="w-full max-w-3xl aspect-video bg-gray-800 rounded-[2rem] border-8 border-yellow-400 shadow-[0_0_50px_rgba(255,255,0,0.3)] overflow-hidden relative mb-8 flex-shrink-0">
        <iframe
          className="w-full h-full pointer-events-none"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=dQw4w9WgXcQ"
          title="Video Intro"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Invisible overlay to prevent clicking the video directly */}
        <div className="absolute inset-0 bg-transparent z-10"></div>
      </div>

      {/* Massive 3D Bouncing Button below the video */}
      <div className="relative z-20 flex justify-center">
        <button 
          onClick={handleStart}
          className="
            bg-gradient-to-b from-green-400 to-green-500 
            text-white font-black text-4xl md:text-6xl 
            py-6 md:py-8 px-12 md:px-20 
            rounded-full 
            border-4 border-white
            border-b-[12px] border-b-green-700 
            shadow-[0_15px_30px_rgba(0,0,0,0.5),_inset_0_6px_0_rgba(255,255,255,0.4)]
            active:border-b-[4px] active:translate-y-[8px] active:shadow-[0_5px_10px_rgba(0,0,0,0.5),_inset_0_2px_0_rgba(255,255,255,0.4)]
            transition-all duration-100 ease-out
            animate-bounce
          "
        >
          Mulai Main! 🚀
        </button>
      </div>
    </div>
  );
}
