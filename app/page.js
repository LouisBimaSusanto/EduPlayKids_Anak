"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { BottomNav } from "@/components/ui/BottomNav";

const LevelOneGameContainer = dynamic(() => import("@/components/game/LevelOneGameContainer").then(mod => mod.LevelOneGameContainer), { ssr: false });
const LevelTwoGameContainer = dynamic(() => import("@/components/game/LevelTwoGameContainer").then(mod => mod.LevelTwoGameContainer), { ssr: false });
const LevelThreeGameContainer = dynamic(() => import("@/components/game/LevelThreeGameContainer").then(mod => mod.LevelThreeGameContainer), { ssr: false });
const LevelFourGameContainer = dynamic(() => import("@/components/game/LevelFourGameContainer").then(mod => mod.LevelFourGameContainer), { ssr: false });
const LevelFiveGameContainer = dynamic(() => import("@/components/game/LevelFiveGameContainer").then(mod => mod.LevelFiveGameContainer), { ssr: false });
const LevelSixGameContainer = dynamic(() => import("@/components/game/LevelSixGameContainer").then(mod => mod.LevelSixGameContainer), { ssr: false });
import { FirefliesBackground } from "@/components/ui/FirefliesBackground";
import { MagicTrail } from "@/components/ui/MagicTrail";
import { useTTS, useAudio } from "@/hooks/useAudio";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/backendApi";

const WORLDS = [
  { id: 1, title: "Dunia Suku Kata", color: "from-blue-300 to-purple-300", icon: "🚂", games: ["Kereta Suku Kata", "Balon Tepuk"] },
  { id: 2, title: "Negeri Rima", color: "from-purple-300 to-teal-300", icon: "🏠", games: ["Rumah Kembar", "Katak Melompat"] },
  { id: 3, title: "Lautan Fonem", color: "from-teal-300 to-emerald-300", icon: "🌊", games: ["Tangkap Kunang-Kunang"] },
  { id: 4, title: "Pulau Fonem Ajaib", color: "from-emerald-300 to-orange-300", icon: "⚙️", games: ["Mesin Merakit", "Mesin Membongkar"] },
  { id: 5, title: "Mega Festival Bunyi", color: "from-orange-300 to-fuchsia-300", icon: "🎆", games: ["Balon Suku Kata", "Meriam Rima"] },
  { id: 6, title: "Puncak Bintang Nusantara", color: "from-amber-300 to-yellow-300", icon: "👑", games: ["Gerbang Istana", "Peti Harta Karun"] }
];

// Scatter decorators for the "lush" environment
const DECORATIONS = ["🌲", "☁️", "⛰️", "🍄", "🌺", "✨", "🦜", "🌴"];

export default function StoryWorldMap() {
  const router = useRouter();
  const { playSound } = useAudio();
  const { speak } = useTTS();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [showWelcomeMascot, setShowWelcomeMascot] = useState(false);
  const [streak, setStreak] = useState(0);
  const [walletStars, setWalletStars] = useState(0);
  const [equippedAccessory, setEquippedAccessory] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    
    // Fetch progression from Backend
    const fetchProgress = async () => {
      try {
        let targetChildId = user.id;

        // Auto-resolve jika memakai token Orang Tua
        if (user.role === "PARENT" || !targetChildId) {
          const childrenList = await api.children.getAll();
          const childrenData = childrenList.data || childrenList;
          if (Array.isArray(childrenData) && childrenData.length > 0) {
             targetChildId = childrenData[0].id;
          }
        }

        if (!targetChildId) {
          console.warn("Tidak ada profil anak yang terhubung.");
          return;
        }
        
        setActiveChildId(targetChildId);

        const progress = await api.progress.getByChildId(targetChildId);
        
        // Asumsi struktur response backend progress
        const progData = progress.data || progress;
        if (progData) {
          setMaxUnlocked(progData.maxUnlocked || 1);
          setWalletStars(progData.walletStars || 0);
          setStreak(progData.streak || 1);
        }
      } catch (err) {
        console.error("Gagal mengambil progres dari backend, fallback ke default/lokal", err);
        // Fallback
        const saved = localStorage.getItem("eduplay_max_unlocked");
        if (saved) setMaxUnlocked(parseInt(saved, 10));
        const savedStars = localStorage.getItem("eduplay_wallet_stars");
        if (savedStars) setWalletStars(parseInt(savedStars, 10));
      }
    };

    fetchProgress();

    const savedAccessory = localStorage.getItem("eduplay_equipped");
    if (savedAccessory) setEquippedAccessory(JSON.parse(savedAccessory));

  }, [isLoading, isAuthenticated, user]);

  const saveProgressToBackend = async (newMaxUnlocked, starsEarned) => {
    if (!activeChildId) return;
    
    try {
      const currentWalletStars = walletStars + starsEarned;
      
      // Update state lokal
      if (newMaxUnlocked > maxUnlocked) setMaxUnlocked(newMaxUnlocked);
      setWalletStars(currentWalletStars);

      // Simpan ke Backend
      await api.children.update(activeChildId, {
        maxUnlocked: newMaxUnlocked > maxUnlocked ? newMaxUnlocked : maxUnlocked,
        walletStars: currentWalletStars
      });

      // Catat Game Session
      await api.gameSessions.recordSession({
        childId: activeChildId,
        levelId: activeLevelId,
        starsEarned: starsEarned,
        completedAt: new Date().toISOString()
      });

    } catch (err) {
      console.error("Gagal menyimpan progres ke backend:", err);
      // Fallback lokal
      if (newMaxUnlocked > maxUnlocked) localStorage.setItem("eduplay_max_unlocked", newMaxUnlocked.toString());
      localStorage.setItem("eduplay_wallet_stars", (walletStars + starsEarned).toString());
    }
  };

  const handleNodeClick = (globalLevelId) => {
    if (globalLevelId > maxUnlocked) {
      playSound("fail"); // Locked node sound
      return;
    }

    playSound("bloop");

    if (globalLevelId <= 36) {
      setActiveLevelId(globalLevelId);
    } else {
      speak("Ayo main!");
      setTimeout(() => {
        router.push(`/level/${globalLevelId}`);
      }, 1000);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-32 cursor-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><text y=\'24\' font-size=\'24\'>✨</text></svg>'),_auto]">
      
      {/* Magic Cursor/Touch Trail System */}
      <MagicTrail />

      {/* Extremely Rich Archipelago Map Background */}
      {!activeLevelId && (
        <>
          <div className="absolute inset-0 pointer-events-none -z-20 bg-gradient-to-t from-[#F5A623] via-[#8E2DE2] to-[#1B0F40]">
        
        {/* Volumetric light rays cutting from top right */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,215,0,0.3)_0%,_transparent_60%)] mix-blend-overlay" />
        
        {/* Bioluminescent ground glow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,229,200,0.2)_0%,_transparent_70%)] mix-blend-screen" />
        
        {/* Shooting Stars (Meteor Shower) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div 
              key={`meteor-${i}`}
              className="absolute bg-white rounded-full shadow-[0_0_15px_4px_rgba(255,255,255,0.8)]"
              style={{
                top: `${(i * 17) % 40}%`,
                left: `${50 + ((i * 23) % 50)}%`,
                width: '4px',
                height: '4px',
                animation: `meteor ${((i * 11) % 6) + 4}s linear infinite`,
                animationDelay: `${(i * 7) % 8}s`
              }}
            >
              <div className="meteor-tail" />
            </div>
          ))}
        </div>

        {/* Fireflies Particle System */}
        <FirefliesBackground />
      </div>

      {/* Floating Game HUD (Teak Wood & Gold) */}
      <header className="fixed top-0 w-full z-50 px-4 py-4 pointer-events-none">
        <div className="max-w-3xl mx-auto flex justify-between items-center pointer-events-auto">
          
          {/* Left: Avatar Button (Chunky Wooden Frame) */}
          <button 
            onClick={() => {
              playSound("bloop");
              router.push("/profil");
            }}
            className="
            relative w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] 
            bg-[#FFF5E0] flex items-center justify-center text-4xl 
            border-4 border-[#FFD700] border-b-[8px] border-b-[#D4AF37] 
            shadow-[0_8px_20px_rgba(0,0,0,0.5)] 
            active:border-b-[4px] active:translate-y-1 transition-all
          ">
            👦
            {equippedAccessory && (
              <span className="absolute -top-4 text-3xl drop-shadow-md animate-[bounce_2s_infinite]">
                {equippedAccessory.emoji}
              </span>
            )}
          </button>

          {/* Center: Wallet & Streak Pills */}
          <div className="flex gap-2 md:gap-4">
            {/* Star Wallet Pill */}
            <div className="
              px-4 py-2 md:px-6 md:py-3 rounded-full 
              bg-[#3D1F0A] 
              border-4 border-[#FFD700] border-b-[8px] border-b-[#B8860B] 
              shadow-[0_8px_20px_rgba(0,0,0,0.5)]
              flex items-center gap-2
            ">
              <span className="text-2xl md:text-3xl drop-shadow-[0_0_10px_#FFD700] animate-[pulse_2s_ease-in-out_infinite]">⭐</span>
              <span className="text-xl md:text-2xl font-black text-[#FFF5E0] drop-shadow-[0_3px_0_#000]">{walletStars}</span>
            </div>

            {/* Daily Streak Pill (Fire) */}
            <div className="
              px-4 py-2 md:px-6 md:py-3 rounded-full 
              bg-[#3D1F0A] 
              border-4 border-[#FF4500] border-b-[8px] border-b-[#8B0000] 
              shadow-[0_8px_20px_rgba(0,0,0,0.5)]
              flex items-center gap-2
            ">
              <span className={`text-2xl md:text-3xl drop-shadow-[0_0_15px_#FF4500] ${streak > 0 ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'grayscale opacity-50'}`}>🔥</span>
              <span className="text-xl md:text-2xl font-black text-[#FFF5E0] drop-shadow-[0_3px_0_#000]">{streak}</span>
            </div>
          </div>

          {/* Right: Parent Hub (Golden Key/Owl) */}
          <button 
            onClick={() => {
              playSound("bloop");
              router.push("/toko");
            }}
            className="
            w-16 h-16 md:w-20 md:h-20 rounded-full 
            bg-[#3D1F0A] flex items-center justify-center text-3xl md:text-4xl
            border-4 border-[#FFD700] border-b-[8px] border-b-[#B8860B] 
            shadow-[0_8px_20px_rgba(0,0,0,0.5)] 
            active:border-b-[4px] active:translate-y-1 transition-all
          ">
            🦉
          </button>

        </div>
      </header>

      {/* World Map Container */}
      <div className="relative w-full max-w-3xl mx-auto mt-8 flex flex-col items-center">

        {WORLDS.map((world, worldIndex) => (
          <div key={world.id} className={`relative w-full flex flex-col items-center ${
            worldIndex === 0 ? 'pt-32 pb-48' : 
            worldIndex === WORLDS.length - 1 ? 'pt-48 pb-64' : 'py-48'
          }`}>
            
            {/* Beautiful, Masked Parallel Train Tracks (No moving orbs, pure vector elegance) */}
            <svg viewBox="0 0 100 100" className="absolute top-0 bottom-0 left-0 w-full h-full -z-10 pointer-events-none" preserveAspectRatio="none">
              <defs>
                {/* Mask to hollow out the center of the path, creating true parallel rails */}
                <mask id={`rail-mask-${world.id}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                    stroke="black" strokeWidth="12" strokeLinecap="butt" fill="transparent" vectorEffect="non-scaling-stroke" />
                </mask>

                {/* Mask for the glowing inner core of the parallel rails */}
                <mask id={`rail-core-mask-${world.id}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                    stroke="black" strokeWidth="14" strokeLinecap="butt" fill="transparent" vectorEffect="non-scaling-stroke" />
                </mask>
              </defs>

              {/* 1. Track Base Shadow */}
              <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                stroke="#4A1C00" strokeWidth="26" strokeLinecap="round" fill="transparent" vectorEffect="non-scaling-stroke" 
                className="translate-y-[8px] opacity-40 blur-[4px]" />

              {/* 2. Thick Caramel Wooden Sleepers (Planks) */}
              <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                stroke="#C87A3E" strokeWidth="28" strokeLinecap="butt" strokeDasharray="6 22" fill="transparent" vectorEffect="non-scaling-stroke" 
                className="drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)]" />

              {/* 3. The True Parallel Golden Rails! (Masked) */}
              <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                stroke="#FFB300" strokeWidth="20" strokeLinecap="butt" fill="transparent" vectorEffect="non-scaling-stroke" 
                mask={`url(#rail-mask-${world.id})`} 
                className="drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />

              {/* 4. The Bright Parallel Rail Cores (Masked) */}
              <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                stroke="#FFF5E0" strokeWidth="16" strokeLinecap="butt" fill="transparent" vectorEffect="non-scaling-stroke" 
                mask={`url(#rail-core-mask-${world.id})`} />

              {/* 5. Magical Sparkle Pulse along the track (Subtle dashed glow) */}
              <path d="M 50,0 C 50,10 80,10 80,25 C 80,40 20,35 20,50 C 20,65 80,60 80,75 C 80,90 50,90 50,100" 
                stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 40" fill="transparent" vectorEffect="non-scaling-stroke" 
                className="animate-[track-flow_6s_linear_infinite] drop-shadow-[0_0_10px_#FFF] opacity-80" />
            </svg>

            {/* World Title Signboard (Dark Teak Wood) */}
            <div className="relative bg-[#3D1F0A] border-4 border-[#FFD700] border-b-[12px] border-b-[#2A1506] rounded-[1rem] px-8 py-6 mb-32 md:mb-48 shadow-[0_25px_50px_rgba(0,0,0,0.8)] text-center transform -rotate-2 w-11/12 max-w-sm z-10 flex flex-col items-center justify-center">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-[float_4s_infinite]">🚂</div>
              <h2 className="text-4xl md:text-5xl font-black text-shimmer drop-shadow-[0_4px_0_#000] tracking-wider mt-4">
                {world.title}
              </h2>
            </div>

            {/* Scattered Decorations (Lush Environment) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {[...Array(6)].map((_, i) => {
                const seed = world.id * 10 + i;
                const top = 15 + ((seed * 29) % 70);
                const left = i % 2 === 0 ? 5 + ((seed * 13) % 10) : 75 + ((seed * 17) % 15);
                const delay = ((seed * 7) % 20) / 10;
                const decoIndex = (seed * 31) % DECORATIONS.length;
                
                return (
                  <div 
                    key={i} 
                    className="absolute text-5xl md:text-7xl drop-shadow-2xl animate-pulse"
                    style={{ 
                      top: `${top}%`, 
                      left: `${left}%`,
                      animationDelay: `${delay}s`
                    }}
                  >
                    {DECORATIONS[decoIndex]}
                  </div>
                );
              })}
            </div>

            {/* 6 Massive 3D Nodes per World */}
            <div className="flex flex-col gap-32 md:gap-40 items-center relative z-10 w-full">
              {[0, 1, 2, 3, 4, 5].map((nodeIndex) => {
                const isLeft = nodeIndex % 2 !== 0;
                const globalLevelId = (world.id - 1) * 6 + (nodeIndex + 1);
                const isLocked = globalLevelId > maxUnlocked;
                const isActive = globalLevelId === maxUnlocked;
                const maxStars = nodeIndex === 0 ? 1 : 5;
                const stars = isLocked ? 0 : isActive ? 0 : maxStars;
                
                return (
                  <div key={`${world.id}-${nodeIndex}`} className={`group relative flex flex-col items-center ${isLeft ? '-translate-x-16 md:-translate-x-24' : 'translate-x-16 md:translate-x-24'} perspective-[1000px]`}>
                    
                    {/* Soft Magical Aura behind the Active Node */}
                    {isActive && (
                      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-110">
                        {/* Core soft bloom */}
                        <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-[#FFD700] rounded-full blur-[40px] opacity-40 animate-[pulse_3s_infinite]" />
                        {/* Outer gentle warmth */}
                        <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-[radial-gradient(circle,_rgba(255,166,35,0.4)_0%,_transparent_60%)] mix-blend-screen animate-[pulse_4s_infinite]" />
                        {/* Floating magical ring (very soft) */}
                        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] border-[4px] border-[#FFF5E0] rounded-full opacity-30 blur-[2px] animate-[pulse_2s_infinite]" />
                      </div>
                    )}

                    <button
                      onClick={() => handleNodeClick(globalLevelId)}
                      className={`
                        relative rounded-[2rem] 
                        border-[6px] border-[#FFD700] 
                        transition-all duration-300 ease-out transform group-hover:-translate-y-4 group-hover:scale-105 group-hover:rotate-x-12 group-hover:shadow-[0_40px_50px_rgba(0,0,0,0.8)]
                        flex items-center justify-center z-10
                        ${isLocked 
                          ? "w-28 h-28 md:w-32 md:h-32 bg-[#1A2E26] border-b-[16px] border-b-[#0A1410] opacity-95 cursor-not-allowed grayscale-[40%] shadow-[0_15px_30px_rgba(0,0,0,0.8),_inset_0_4px_10px_rgba(0,0,0,0.5)] group-hover:rotate-x-0 group-hover:translate-y-0 group-hover:scale-100" 
                          : isActive 
                            ? "w-44 h-44 md:w-56 md:h-56 bg-gradient-to-tr from-[#F5A623] via-[#FFD700] to-[#FFE58F] border-b-[24px] border-b-[#B8860B] active:border-b-[6px] active:translate-y-[18px] animate-pulse-glow"
                            : "w-36 h-36 md:w-44 md:h-44 bg-gradient-to-tr from-[#00E5C8] to-[#00FFD1] border-b-[20px] border-b-[#008A79] active:border-b-[6px] active:translate-y-[14px] shadow-[0_20px_40px_rgba(0,229,200,0.4),_inset_0_5px_15px_rgba(255,255,255,0.6)]"
                        }
                      `}
                    >
                      {/* Node Icons based on state */}
                      {isLocked ? (
                        <span className="text-6xl md:text-7xl drop-shadow-[0_8px_5px_rgba(0,0,0,0.8)] opacity-80">⛩️</span>
                      ) : isActive ? (
                        <span className="text-[6rem] md:text-[8rem] drop-shadow-[0_0_30px_#FFF]">
                          {nodeIndex === 0 ? "▶️" : "🏮"}
                        </span>
                      ) : (
                        <span className="text-6xl md:text-7xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
                          {nodeIndex === 0 ? "▶️" : "⭐"}
                        </span>
                      )}

                      {/* Ara the Nuri (Parrot) on the Active Node */}
                      {isActive && (
                        <div className="absolute -top-32 md:-top-40 right-[-30px] origin-bottom animate-[bounce_1.5s_infinite] z-20">
                          <span className="text-[6rem] md:text-[9rem] drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]">🦜</span>
                        </div>
                      )}

                      {/* Mini Star Counter Badge */}
                      <div className="absolute -bottom-8 bg-[#3D1F0A] border-2 border-[#FFD700] rounded-full px-4 py-1 text-white font-black text-xl shadow-lg">
                        {`${stars}/${maxStars}`}
                      </div>
                    </button>

                    {/* Floating Dirt Island Base below the button */}
                    <div className="w-20 h-16 md:w-28 md:h-24 bg-gradient-to-b from-[#2A1506] to-[#0A0502] rounded-b-[3rem] shadow-[0_40px_40px_rgba(0,0,0,0.9)] -mt-6 z-0" />
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
        </>
      )}

      {/* Level 1 Playlist Engine Overlay (Dunia Suku Kata) */}
      {activeLevelId >= 1 && activeLevelId <= 6 && (
        <LevelOneGameContainer 
          key={activeLevelId}
          initialStep={activeLevelId - 1}
          onClose={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 2, 0);
          }} 
          onCompleteLevel={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 2, 50);
            speak("Hore! Kamu mendapat 50 bintang!");
          }}
        />
      )}

      {/* Level 2 Playlist Engine Overlay (Negeri Rima) */}
      {activeLevelId >= 7 && activeLevelId <= 12 && (
        <LevelTwoGameContainer 
          key={activeLevelId}
          initialStep={activeLevelId - 7}
          onClose={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 8, 0);
          }} 
          onCompleteLevel={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 8, 50);
            speak("Hore! Kamu mendapat 50 bintang!");
          }}
        />
      )}

      {/* Level 3 Playlist Engine Overlay (Lautan Fonem) */}
      {activeLevelId >= 13 && activeLevelId <= 18 && (
        <LevelThreeGameContainer 
          key={activeLevelId}
          initialStep={activeLevelId - 13}
          onClose={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 14, 0);
          }} 
          onCompleteLevel={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 14, 50);
            speak("Hore! Kamu mendapat 50 bintang!");
          }}
        />
      )}

      {/* Level 4 Playlist Engine Overlay (Pulau Fonem Ajaib) */}
      {activeLevelId >= 19 && activeLevelId <= 24 && (
        <LevelFourGameContainer 
          key={activeLevelId}
          initialStep={activeLevelId - 19}
          onClose={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 20, 0);
          }} 
          onCompleteLevel={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 20, 50);
            speak("Hore! Kamu mendapat 50 bintang!");
          }}
        />
      )}

      {/* Level 5 Playlist Engine Overlay (Mega Festival Bunyi) */}
      {activeLevelId >= 25 && activeLevelId <= 30 && (
        <LevelFiveGameContainer 
          key={activeLevelId}
          initialStep={activeLevelId - 25}
          onClose={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 26, 0);
          }} 
          onCompleteLevel={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 26, 50);
            speak("Kamu berhasil menamatkan Festival!");
          }}
        />
      )}

      {/* Level 6 Playlist Engine Overlay (Puncak Bintang Nusantara) */}
      {activeLevelId >= 31 && activeLevelId <= 36 && (
        <LevelSixGameContainer 
          key={activeLevelId}
          initialStep={activeLevelId - 31}
          onClose={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 32, 0);
          }} 
          onCompleteLevel={(reachedStep) => {
            setActiveLevelId(null);
            saveProgressToBackend(reachedStep + 32, 50);
            speak("Hore! Bintangmu bertambah!");
          }}
        />
      )}

      {/* Persistent Bottom Navigation */}
      {!activeLevelId && <BottomNav />}
    </main>
  );
}
