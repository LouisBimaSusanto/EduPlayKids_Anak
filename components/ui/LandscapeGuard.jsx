"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pre-computed star positions (deterministic, avoids hydration mismatch)
const STAR_DATA = [
  { left: 5,  top: 10, size: 2, delay: 0.0, dur: 2.5 },
  { left: 15, top: 85, size: 1, delay: 0.4, dur: 3.0 },
  { left: 25, top: 30, size: 3, delay: 0.8, dur: 2.0 },
  { left: 35, top: 70, size: 1, delay: 1.2, dur: 3.5 },
  { left: 45, top: 20, size: 2, delay: 0.2, dur: 2.8 },
  { left: 55, top: 90, size: 1, delay: 0.6, dur: 2.2 },
  { left: 65, top: 45, size: 2, delay: 1.0, dur: 3.0 },
  { left: 75, top: 15, size: 3, delay: 0.3, dur: 2.5 },
  { left: 85, top: 75, size: 1, delay: 0.7, dur: 3.2 },
  { left: 92, top: 35, size: 2, delay: 1.1, dur: 2.0 },
  { left: 10, top: 55, size: 1, delay: 0.5, dur: 2.7 },
  { left: 50, top: 60, size: 2, delay: 0.9, dur: 3.5 },
  { left: 30, top: 5,  size: 1, delay: 1.3, dur: 2.3 },
  { left: 70, top: 95, size: 2, delay: 0.1, dur: 2.8 },
  { left: 88, top: 50, size: 3, delay: 0.4, dur: 3.1 },
];

export function LandscapeGuard() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);

    // Coba lock orientation ke landscape (berhasil di Android PWA / fullscreen)
    const tryLock = async () => {
      try {
        if (screen?.orientation?.lock) {
          await screen.orientation.lock("landscape");
        }
      } catch {
        // Tidak didukung di iOS / browser desktop — overlay akan menanganinya
      }
    };
    tryLock();

    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize",            check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize",            check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isPortrait && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 text-center px-8 select-none overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, #2D1B69 0%, #1B0F40 50%, #0D0720 100%)",
          }}
        >
          {/* ── Bintang latar ── */}
          {STAR_DATA.map((s, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
              animate={{ opacity: [0.15, 1, 0.15] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
            />
          ))}

          {/* ── Glow tengah ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-[#FFD700] opacity-[0.05] blur-3xl" />
          </div>

          {/* ── Animasi HP berputar ── */}
          <div className="relative flex items-center justify-center">
            {/* Orbit ring */}
            <motion.div
              className="absolute w-48 h-48 rounded-full border-2 border-dashed border-[#FFD700]/25"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            {/* Phone emoji rotating 0 → 90° */}
            <motion.div
              animate={{ rotate: [0, 0, 90, 90, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                times: [0, 0.15, 0.5, 0.85, 1],
                ease: "easeInOut",
              }}
              style={{ fontSize: "clamp(4.5rem, 18vw, 6.5rem)" }}
            >
              📱
            </motion.div>
          </div>

          {/* ── Indikator arah ── */}
          <div className="flex items-center gap-4 -mt-1">
            <motion.span
              className="text-[#FFD700] text-2xl"
              animate={{ x: [-6, 0, -6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              ←
            </motion.span>
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🔄
            </motion.span>
            <motion.span
              className="text-[#FFD700] text-2xl"
              animate={{ x: [6, 0, 6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>

          {/* ── Teks peringatan ── */}
          <div className="relative z-10 space-y-2">
            <motion.h2
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="font-black text-[#FFD700] tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)" }}
            >
              🌟 Putar Perangkatmu! 🌟
            </motion.h2>
            <p className="text-white/80 font-semibold" style={{ fontSize: "clamp(0.85rem, 3vw, 1.05rem)" }}>
              EduPlay Kids dimainkan dalam mode{" "}
              <span className="text-[#00E5C8] font-black">Horizontal</span>
            </p>
            <p className="text-white/50" style={{ fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)" }}>
              Silakan putar HP kamu ke samping ✨
            </p>
          </div>

          {/* ── Bintang dekorasi bawah ── */}
          <div className="flex gap-3">
            {["⭐", "🌟", "✨", "🌟", "⭐"].map((s, i) => (
              <motion.span
                key={i}
                style={{ fontSize: "clamp(1.1rem, 4vw, 1.4rem)" }}
                animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
