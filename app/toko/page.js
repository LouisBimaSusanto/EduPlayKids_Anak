"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";

const SHOP_ITEMS = [
  { id: "glasses", emoji: "🕶️", name: "Kacamata Hitam", price: 100, desc: "Sangat keren!" },
  { id: "hat", emoji: "🎩", name: "Topi Sulap", price: 250, desc: "Penuh keajaiban!" },
  { id: "crown", emoji: "👑", name: "Mahkota Emas", price: 500, desc: "Raja Nusantara!" },
  { id: "pirate", emoji: "🏴‍☠️", name: "Topi Bajak Laut", price: 300, desc: "Siap berlayar!" },
  { id: "flower", emoji: "🌺", name: "Bunga Tropis", price: 150, desc: "Cantik dan harum." }
];

const ACHIEVEMENTS = [
  { id: "streak3", icon: "🔥", name: "Piala Ketekunan", desc: "Main 3 Hari Berturut-turut", condition: (s) => s.streak >= 3 },
  { id: "lvl10", icon: "📖", name: "Piala Cendekiawan", desc: "Mencapai Node Level 10", condition: (s) => s.unlocked >= 10 },
  { id: "module1", icon: "🌳", name: "Piala Alam Semesta", desc: "Menamatkan Modul 1", condition: (s) => s.unlocked > 36 },
  { id: "rich", icon: "💎", name: "Piala Sultan", desc: "Memiliki Saldo 1000 Bintang", condition: (s) => s.wallet >= 1000 }
];

export default function KiosTuanHantuPage() {
  const router = useRouter();
  const { playSound } = useAudio();

  const [activeTab, setActiveTab] = useState("shop"); // "shop" or "trophy"
  const [wallet, setWallet] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState(null);

  // States for achievement unlocks
  const [stats, setStats] = useState({ streak: 0, unlocked: 1, wallet: 0 });

  useEffect(() => {
    // Load Wallet
    const savedStars = localStorage.getItem("eduplay_wallet_stars");
    const currentWallet = savedStars ? parseInt(savedStars, 10) : 0;
    setWallet(currentWallet);

    // Load Inventory
    const savedInv = localStorage.getItem("eduplay_inventory");
    if (savedInv) setInventory(JSON.parse(savedInv));

    // Load Equipped
    const savedEq = localStorage.getItem("eduplay_equipped");
    if (savedEq) setEquipped(JSON.parse(savedEq));

    // Load Stats for Achievements
    const savedStreak = parseInt(localStorage.getItem("eduplay_streak") || "0", 10);
    const savedUnlocked = parseInt(localStorage.getItem("eduplay_max_unlocked") || "1", 10);
    setStats({ streak: savedStreak, unlocked: savedUnlocked, wallet: currentWallet });

  }, []);

  const handleBuy = (item) => {
    if (inventory.includes(item.id)) return; // Already bought

    if (wallet >= item.price) {
      playSound("bloop"); // TODO: add cha-ching sound
      const newWallet = wallet - item.price;
      const newInv = [...inventory, item.id];

      setWallet(newWallet);
      setInventory(newInv);

      localStorage.setItem("eduplay_wallet_stars", newWallet.toString());
      localStorage.setItem("eduplay_inventory", JSON.stringify(newInv));
    } else {
      playSound("fail");
    }
  };

  const handleEquip = (item) => {
    playSound("bloop");
    if (equipped?.id === item.id) {
      // Unequip
      setEquipped(null);
      localStorage.removeItem("eduplay_equipped");
    } else {
      // Equip
      setEquipped(item);
      localStorage.setItem("eduplay_equipped", JSON.stringify(item));
    }
  };

  return (
    <main className="min-h-screen bg-[#1B0F40] text-white flex flex-col relative overflow-hidden">

      {/* Mystical Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(138,43,226,0.3)_0%,transparent_70%)]" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-50 animate-[pulse_3s_ease-in-out_infinite]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <button
          onClick={() => { playSound("bloop"); router.back(); }}
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-2xl border-2 border-white/20 active:scale-95 transition-transform"
        >
          ⬅️
        </button>

        {/* Wallet Display */}
        <div className="px-6 py-2 bg-[#3D1F0A] border-4 border-[#FFD700] rounded-full shadow-lg flex items-center gap-3">
          <span className="text-3xl drop-shadow-[0_0_10px_#FFD700] animate-pulse">⭐</span>
          <span className="text-2xl font-black text-[#FFF5E0]">{wallet}</span>
        </div>
      </header>

      {/* Owl Mascot Area */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        <div className="w-32 h-32 bg-[#2A1506] rounded-full border-4 border-[#8A2BE2] shadow-[0_0_40px_rgba(138,43,226,0.6)] flex items-center justify-center text-[5rem] animate-[float_4s_infinite]">
          🦉
        </div>
        <h1 className="text-4xl font-black mt-4 drop-shadow-[0_4px_0_#000] text-transparent bg-clip-text bg-linear-to-b from-purple-200 to-purple-500">
          Kios Tuan Hantu
        </h1>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md mx-auto mt-8 px-6 relative z-10 flex gap-4">
        <button
          onClick={() => { playSound("bloop"); setActiveTab("shop"); }}
          className={`flex-1 py-3 rounded-2xl font-bold text-lg transition-all ${activeTab === "shop" ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)] border-2 border-purple-400" : "bg-black/40 text-white/50 border-2 border-transparent"}`}
        >
          🏪 Toko Kosmetik
        </button>
        <button
          onClick={() => { playSound("bloop"); setActiveTab("trophy"); }}
          className={`flex-1 py-3 rounded-2xl font-bold text-lg transition-all ${activeTab === "trophy" ? "bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.6)] border-2 border-yellow-400" : "bg-black/40 text-white/50 border-2 border-transparent"}`}
        >
          🏆 Ruang Trofi
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto p-6 relative z-10 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">
          {activeTab === "shop" ? (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 gap-4"
            >
              {SHOP_ITEMS.map((item) => {
                const isOwned = inventory.includes(item.id);
                const isEquipped = equipped?.id === item.id;
                const canAfford = wallet >= item.price;

                return (
                  <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/10 flex flex-col items-center text-center">
                    <div className="text-6xl mb-2 drop-shadow-lg">{item.emoji}</div>
                    <h3 className="font-bold text-lg">{item.name}</h3>

                    {!isOwned && (
                      <div className="flex items-center gap-1 text-yellow-400 font-bold mt-1">
                        ⭐ {item.price}
                      </div>
                    )}

                    <div className="mt-4 w-full">
                      {isOwned ? (
                        <button
                          onClick={() => handleEquip(item)}
                          className={`w-full py-2 rounded-xl font-bold transition-all ${isEquipped ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-white/20 text-white hover:bg-white/30"}`}
                        >
                          {isEquipped ? "DIPAKAI" : "PAKAI"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className={`w-full py-2 rounded-xl font-bold transition-all ${canAfford ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-gray-600/50 text-gray-400 cursor-not-allowed"}`}
                        >
                          BELI
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="trophy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = ach.condition(stats);

                return (
                  <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isUnlocked ? 'bg-linear-to-r from-yellow-900/50 to-amber-900/50 border-yellow-500/50 shadow-[0_0_20px_rgba(217,119,6,0.3)]' : 'bg-black/40 border-white/5 opacity-70'}`}>

                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-inner ${isUnlocked ? 'bg-yellow-500/20' : 'bg-black/50 grayscale'}`}>
                      {isUnlocked ? ach.icon : "❓"}
                    </div>

                    <div className="flex-1">
                      <h3 className={`font-bold text-xl ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {isUnlocked ? ach.name : "Piala Rahasia"}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">{ach.desc}</p>
                    </div>

                    {!isUnlocked && (
                      <div className="text-2xl opacity-30">🔒</div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
