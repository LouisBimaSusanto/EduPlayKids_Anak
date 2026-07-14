"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { MechanicBalonTepuk } from "@/components/games/MechanicBalonTepuk";
import { MechanicKunangKunang } from "@/components/games/MechanicKunangKunang";

// The Playlist Runner for World 1 & 3 based on the prompt
const PLAYLISTS = {
  1: [MechanicBalonTepuk, MechanicKunangKunang], // Demo playlist
  // fallback playlist
  default: [MechanicBalonTepuk]
};

export default function GameplayContainer({ params }) {
  const router = useRouter();
  const { playSound } = useAudio();
  const { speak } = useTTS();
  const resolvedParams = use(params);

  const playlistKey = resolvedParams.id <= 3 ? 1 : "default"; // Mock logic
  const activePlaylist = PLAYLISTS[playlistKey] || PLAYLISTS.default;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleMiniGameComplete = () => {
    const nextIndex = currentIndex + 1;
    const newProgress = (nextIndex / activePlaylist.length) * 100;
    setProgress(newProgress);

    if (nextIndex < activePlaylist.length) {
      setCurrentIndex(nextIndex);
    } else {
      playSound("success");
      speak("Wah hebat sekali! Kamu juara!");

      // Save progress to unlock next level
      const currentLevelId = parseInt(resolvedParams.id);
      const savedMax = parseInt(localStorage.getItem("eduplay_max_unlocked") || "1");
      if (currentLevelId >= savedMax) {
        localStorage.setItem("eduplay_max_unlocked", (currentLevelId + 1).toString());
      }

      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  const handleExit = () => {
    playSound("bloop");
    router.push("/");
  };

  const CurrentGame = activePlaylist[currentIndex];

  return (
    <main className="fixed inset-0 bg-linear-to-b from-sky-300 to-sky-100 flex flex-col overflow-hidden">

      {/* Top HUD Area */}
      <header className="p-6 flex items-center gap-6 z-10">
        <button
          onClick={handleExit}
          className="
            shrink-0 w-16 h-16 rounded-full 
            bg-red-500 border-4 border-white border-b-8 border-b-red-700
            flex items-center justify-center
            text-white font-black text-3xl
            active:border-b-4 active:translate-y-1 transition-all
            shadow-[0_4px_10px_rgba(0,0,0,0.2)]
          "
        >
          X
        </button>

        {/* Massive 3D Progress Bar */}
        <div className="flex-1 h-10 bg-white/50 backdrop-blur-md rounded-full border-4 border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] overflow-hidden relative">
          <div
            className="absolute top-0 left-0 bottom-0 bg-linear-to-r from-green-400 to-green-500 rounded-full transition-all duration-700 ease-out shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Gamification Buffet: Central Game Area */}
      <div className="flex-1 w-full flex flex-col relative z-0">
        {CurrentGame && (
          <CurrentGame onComplete={handleMiniGameComplete} />
        )}
      </div>

    </main>
  );
}
