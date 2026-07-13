"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui/BottomNav";

const BADGES = [
  { id: 1, name: "Penjelajah Kereta", icon: "🚂", requirement: 6, color: "from-blue-400 to-indigo-600" },
  { id: 2, name: "Penjaga Rima", icon: "🏠", requirement: 12, color: "from-purple-400 to-pink-600" },
  { id: 3, name: "Penyelam Fonem", icon: "🌊", requirement: 18, color: "from-teal-400 to-emerald-600" },
  { id: 4, name: "Teknisi Suara", icon: "⚙️", requirement: 24, color: "from-emerald-400 to-green-600" },
  { id: 5, name: "Ahli Kembang Api", icon: "🎆", requirement: 30, color: "from-orange-400 to-red-600" },
  { id: 6, name: "Kesatria Bintang", icon: "👑", requirement: 36, color: "from-yellow-400 to-amber-600" },
];

export default function ProfilPage() {
  const [stats, setStats] = useState({
    maxUnlocked: 1,
    streak: 0,
    totalStars: 0
  });
  const [equippedAccessory, setEquippedAccessory] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const maxUnlocked = parseInt(localStorage.getItem("eduplay_max_unlocked") || "1", 10);
    const streak = parseInt(localStorage.getItem("eduplay_streak") || "0", 10);
    
    setStats({
      maxUnlocked,
      streak,
      totalStars: Math.max(0, (maxUnlocked - 1) * 3)
    });

    const savedEq = localStorage.getItem("eduplay_equipped");
    if (savedEq) setEquippedAccessory(JSON.parse(savedEq));

    setMounted(true);
  }, []);

  if (!mounted) return null;

  const completedNodes = Math.max(0, stats.maxUnlocked - 1);

  return (
    <main className="min-h-screen pb-32 overflow-hidden bg-[#1B0F40] relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-fuchsia-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
      </div>

      <header className="w-full pt-12 px-6 relative z-10 text-center mb-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 drop-shadow-lg"
        >
          Paspor Petualang
        </motion.h1>
      </header>

      {/* Profile ID Card */}
      <div className="max-w-sm mx-auto px-6 relative z-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-700 rounded-[2rem] p-6 border-4 border-purple-400 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Card Shine Effect */}
          <div className="absolute top-0 right-0 w-[200%] h-full bg-gradient-to-bl from-white/20 to-transparent -translate-y-1/2 rotate-45 pointer-events-none" />

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl">
              👦
              {equippedAccessory && (
                <span className="absolute -top-6 text-4xl drop-shadow-md animate-[bounce_2s_infinite]">
                  {equippedAccessory.emoji}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white drop-shadow-md">Petualang</h2>
              <p className="text-purple-200 font-bold text-sm">Gelar: {completedNodes >= 36 ? 'Kesatria Fonem' : 'Murid Pemula'}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-between mt-8 gap-2">
            <div className="flex-1 bg-black/30 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-3xl drop-shadow-[0_0_10px_#FFD700]">⭐</span>
              <span className="text-xl font-black text-white">{stats.totalStars}</span>
              <span className="text-[10px] text-purple-200 uppercase font-bold">Bintang</span>
            </div>
            <div className="flex-1 bg-black/30 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-3xl drop-shadow-[0_0_15px_#FF4500] animate-[pulse_2s_infinite]">🔥</span>
              <span className="text-xl font-black text-white">{stats.streak}</span>
              <span className="text-[10px] text-purple-200 uppercase font-bold">Streak</span>
            </div>
            <div className="flex-1 bg-black/30 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-3xl drop-shadow-[0_0_10px_#00E5C8]">🗺️</span>
              <span className="text-xl font-black text-white">{completedNodes}/36</span>
              <span className="text-[10px] text-purple-200 uppercase font-bold">Misi</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges Collection */}
      <div className="max-w-sm mx-auto px-6 mt-8 relative z-20">
        <h3 className="text-white font-bold mb-4 text-lg">Lencana Kehormatan</h3>
        <div className="grid grid-cols-3 gap-4">
          {BADGES.map((badge, index) => {
            const isUnlocked = completedNodes >= badge.requirement;
            return (
              <motion.div
                key={badge.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  aspect-square rounded-[1.5rem] flex flex-col items-center justify-center p-2 relative
                  ${isUnlocked 
                    ? `bg-gradient-to-br ${badge.color} border-2 border-white/50 shadow-[0_10px_20px_rgba(0,0,0,0.3)]` 
                    : 'bg-white/5 border-2 border-white/10 grayscale opacity-40'}
                `}
              >
                <span className="text-4xl drop-shadow-md">{badge.icon}</span>
                {isUnlocked && (
                  <div className="absolute inset-0 bg-white/20 mix-blend-overlay rounded-[1.5rem]" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
