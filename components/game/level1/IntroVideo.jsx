"use client";

import { useTTS } from "@/hooks/useAudio";

export function IntroVideo({ onComplete }) {
  const { speak } = useTTS();

  const handleStart = () => {
    speak("Ayo kita mulai!");
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      
      {/* Massive 3D TV Container for the Video */}
      <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-[3rem] border-[12px] border-[#FFD700] border-b-[24px] border-b-[#B8860B] shadow-[0_40px_80px_rgba(0,0,0,0.8),_inset_0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden relative mb-12 flex-shrink-0 animate-[float_4s_infinite]">
        <iframe
          className="w-full h-full pointer-events-none"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=dQw4w9WgXcQ"
          title="Video Intro"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Invisible overlay to prevent clicking the video directly */}
        <div className="absolute inset-0 bg-transparent z-10" />
      </div>

      {/* Massive 3D Glowing Button */}
      <div className="relative z-20 flex justify-center w-full max-w-md">
        <button 
          onClick={handleStart}
          className="
            w-full bg-gradient-to-tr from-[#00E5C8] to-[#00FFD1] 
            text-[#004D40] font-black text-5xl md:text-7xl 
            py-8 px-12 
            rounded-[3rem] 
            border-[8px] border-[#FFF]
            border-b-[24px] border-b-[#008A79] 
            shadow-[0_20px_40px_rgba(0,229,200,0.6),_inset_0_5px_15px_rgba(255,255,255,0.8)]
            active:border-b-[8px] active:translate-y-[16px] 
            active:shadow-[0_10px_20px_rgba(0,229,200,0.6),_inset_0_5px_15px_rgba(255,255,255,0.8)]
            transition-all duration-100 ease-out
            animate-bounce
          "
        >
          MULAI MAIN 🚀
        </button>
      </div>
    </div>
  );
}
