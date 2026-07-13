"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ui/BottomNav";
import { useAudio } from "@/hooks/useAudio";

const TOTAL_NODES = 36;
const STAGES = [
  { stage: 1, name: "Tunas Harapan", emoji: "🌱", desc: "Perjalanan baru saja dimulai!" },
  { stage: 2, name: "Pohon Kecil", emoji: "🌿", desc: "Akar pengetahuan mulai menancap kuat." },
  { stage: 3, name: "Pohon Pengetahuan", emoji: "🌳", desc: "Cabang-cabang rima telah tumbuh." },
  { stage: 4, name: "Pohon Ajaib", emoji: "🌲", desc: "Buah-buah fonem bermunculan." },
  { stage: 5, name: "Pohon Emas", emoji: "✨🌳✨", desc: "Memancarkan cahaya magis!" },
  { stage: 6, name: "Yggdrasil Nusantara", emoji: "🌟🌲👑", desc: "Puncak keabadian fonem!" }
];

const MODULES_DATA = [
  { id: 1, name: "Modul 1: Fonem", theme: "emerald", bgColor: "from-green-600 to-emerald-900", isLocked: false, totalNodes: 36 },
  { id: 2, name: "Modul 2: Suku Kata", theme: "sakura", bgColor: "from-pink-600 to-rose-900", isLocked: true, totalNodes: 40 },
  { id: 3, name: "Modul 3: Kata Dasar", theme: "crystal", bgColor: "from-blue-600 to-indigo-900", isLocked: true, totalNodes: 40 },
  { id: 4, name: "Modul 4: Kalimat", theme: "fire", bgColor: "from-orange-600 to-red-900", isLocked: true, totalNodes: 50 },
  { id: 5, name: "Modul 5: Cerita", theme: "amethyst", bgColor: "from-purple-600 to-fuchsia-900", isLocked: true, totalNodes: 50 },
  { id: 6, name: "Modul 6: Misteri", theme: "shadow", bgColor: "from-slate-800 to-black", isLocked: true, totalNodes: 30 },
  { id: 7, name: "Modul 7: Angkasa", theme: "star", bgColor: "from-indigo-800 to-blue-950", isLocked: true, totalNodes: 40 },
  { id: 8, name: "Modul 8: Alam Bawah Laut", theme: "ocean", bgColor: "from-teal-600 to-cyan-900", isLocked: true, totalNodes: 40 },
  { id: 9, name: "Modul 9: Hutan Peri", theme: "fairy", bgColor: "from-lime-600 to-green-950", isLocked: true, totalNodes: 45 },
  { id: 10, name: "Modul 10: Legenda", theme: "gold", bgColor: "from-yellow-600 to-amber-900", isLocked: true, totalNodes: 60 }
];

export default function PohonKehidupanPage() {
  const { playSound } = useAudio();
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  useEffect(() => {
    const saved = localStorage.getItem("eduplay_max_unlocked");
    if (saved) {
      setMaxUnlocked(parseInt(saved, 10));
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleNext = () => {
    playSound("bloop");
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % MODULES_DATA.length);
  };

  const handlePrev = () => {
    playSound("bloop");
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + MODULES_DATA.length) % MODULES_DATA.length);
  };

  const activeModule = MODULES_DATA[activeIndex];

  // Logic for Module 1 Growth
  let currentStageIndex = 0;
  let currentStage = STAGES[0];
  let progressPercent = 0;

  if (!activeModule.isLocked) {
    currentStageIndex = Math.floor((maxUnlocked - 1) / (activeModule.totalNodes / 6));
    if (currentStageIndex < 0) currentStageIndex = 0;
    if (currentStageIndex > 5) currentStageIndex = 5;
    currentStage = STAGES[currentStageIndex];
    progressPercent = Math.min(100, Math.round(((maxUnlocked - 1) / activeModule.totalNodes) * 100));
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <main className={`min-h-screen pb-32 overflow-hidden flex flex-col items-center relative transition-colors duration-1000 bg-gradient-to-b ${activeModule.bgColor}`}>
      
      {/* Background Magical Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white opacity-40 animate-[float_4s_ease-in-out_infinite] transform-gpu"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: !activeModule.isLocked && currentStageIndex >= 4 ? '0 0 10px 2px rgba(255,215,0,0.8)' : '0 0 5px 1px rgba(255,255,255,0.5)'
            }}
          />
        ))}
        {/* Volumetric Light */}
        <div className="absolute top-0 inset-x-0 h-[60vh] bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay" />
      </div>

      <header className="w-full max-w-md mx-auto pt-12 px-6 relative z-10 text-center flex items-center justify-between">
        <button onClick={handlePrev} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center active:scale-95 transition-transform border-2 border-white/30">
          ◀
        </button>
        <motion.div 
          key={activeIndex}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-1"
        >
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-100 drop-shadow-lg leading-tight">
            Taman Botani
          </h1>
          <p className="text-white/80 font-bold mt-1 text-sm bg-black/30 rounded-full inline-block px-4 py-1">
            {activeModule.name}
          </p>
        </motion.div>
        <button onClick={handleNext} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center active:scale-95 transition-transform border-2 border-white/30">
          ▶
        </button>
      </header>

      {/* The Tree Carousel Container */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-20 mt-8 perspective-[1000px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex flex-col items-center justify-center w-64 h-64 md:w-80 md:h-80"
          >
            {activeModule.isLocked ? (
              // LOCKED MYSTERY SEED DOME
              <div className="relative flex items-end justify-center w-48 h-56 mt-12">
                {/* The Glass Dome */}
                <div className="absolute inset-0 w-full h-full rounded-t-[100px] border-4 border-white/30 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-[2px] shadow-[inset_0_20px_40px_rgba(255,255,255,0.3)] z-20 pointer-events-none">
                  {/* Lock Icon */}
                  <div className="w-full text-center mt-6">
                    <span className="text-4xl opacity-50 drop-shadow-md">🔒</span>
                  </div>
                </div>
                
                {/* The Mystery Seed */}
                <span className="text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10 grayscale brightness-50 opacity-80 animate-pulse mb-6">
                  🌱
                </span>

                {/* Dirt Base */}
                <div className="w-44 h-12 bg-gradient-to-b from-[#2A1506] to-black rounded-[100%] absolute -bottom-4 z-0 shadow-[0_20px_20px_rgba(0,0,0,0.9)]" />
              </div>
            ) : (
              // ACTIVE TREE (Module 1)
              <>
                {/* Glowing Aura for higher stages */}
                {currentStageIndex >= 3 && (
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-[50px] opacity-30 animate-[pulse_3s_ease-in-out_infinite] transform-gpu" />
                )}
                
                {/* The Main Emoji/Tree */}
                <span 
                  className={`text-[8rem] md:text-[10rem] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] z-10 mt-12 ${currentStageIndex >= 4 ? 'animate-[float_3s_ease-in-out_infinite]' : ''}`}
                >
                  {currentStage.emoji}
                </span>

                {/* Dirt Base */}
                <div className="w-32 h-8 bg-gradient-to-b from-[#4A2511] to-[#2A1506] rounded-[50%] absolute bottom-4 -z-10 shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status Panel */}
      <motion.div 
        key={`panel-${activeIndex}`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md mx-auto px-6 relative z-20"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 shadow-2xl text-center relative overflow-hidden">
          {activeModule.isLocked ? (
            <>
              <h2 className="text-2xl font-bold text-white/50 drop-shadow-md mb-2">Bibit Misterius</h2>
              <p className="text-white/40 text-sm mb-4">Selesaikan Modul {activeModule.id - 1} untuk membuka kubah kaca ini dan menumbuhkan pohon baru!</p>
              
              <div className="w-full bg-black/60 rounded-full h-6 border-2 border-white/10 relative overflow-hidden flex items-center justify-center">
                <span className="text-white/40 text-[10px] font-black tracking-widest">TERKUNCI</span>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{currentStage.name}</h2>
              <p className="text-white/90 text-sm mb-6">{currentStage.desc}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-black/40 rounded-full h-6 border-2 border-white/20 relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-300 relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]" />
                </motion.div>
              </div>
              <div className="mt-2 text-white/80 text-xs font-bold uppercase tracking-wider">
                Progres: {progressPercent}% (Node {Math.min(maxUnlocked - 1, activeModule.totalNodes)}/{activeModule.totalNodes})
              </div>
            </>
          )}
        </div>
      </motion.div>

      <BottomNav />
    </main>
  );
}
