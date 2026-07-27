'use client';

import { motion } from 'framer-motion';
import { THEME } from '@/config/theme';

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => {
    const h1 = ((i * 2654435761) >>> 0) % 10000 / 100;
    const h2 = ((i * 1134903170) >>> 0) % 10000 / 100;
    const h3 = ((i * 987654321)  >>> 0) % 100;
    return {
      id:       i,
      x:        h1,
      y:        h2 * 0.9,
      size:     1.5 + (h3 % 4) * 0.8,
      delay:    (h3 % 22) * 0.18,
      duration: THEME.animation.twinkleDuration + (h3 % 10) * 0.2,
    };
  });
}

const STARS = generateStars(45);

const BottomClouds = () => (
  <svg width="100%" height="250" viewBox="0 0 1200 250" preserveAspectRatio="none" style={{ position: 'absolute', bottom: -5, left: 0, right: 0, width: '100%', minWidth: 1000 }}>
    {/* Lapis Belakang */}
    <path d="M0,250 L1200,250 L1200,100 Q1100,20 1000,100 Q850,-20 700,100 Q550,-10 400,100 Q250,20 100,90 Q50,60 0,100 Z" fill="#3B1C75" opacity="0.4"/>
    {/* Lapis Tengah */}
    <path d="M0,250 L1200,250 L1200,140 Q1120,70 980,140 Q860,30 720,130 Q600,60 480,130 Q360,50 200,120 Q100,70 0,120 Z" fill="#2B1055" opacity="0.7"/>
    {/* Lapis Depan */}
    <path d="M0,250 L1200,250 L1200,180 Q1150,120 1050,170 Q950,90 850,170 Q750,110 600,170 Q450,110 300,170 Q150,120 0,160 Z" fill="#150630" />
  </svg>
);

export function BackgroundScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true" style={{ background: '#09051C' }}>
      {/* ── Gradient Langit Malam ───────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #09051C 0%, #15093A 40%, #200D50 70%, #2C136A 100%)`,
        }}
      />

      {/* ── Bintang ─────────────────────── */}
      {STARS.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left:     `${star.x}%`,
            top:      `${star.y}%`,
            width:    star.size,
            height:   star.size,
            background: THEME.colors.starWhite,
            boxShadow: `0 0 ${star.size * 2.5}px rgba(255,255,255,0.75)`,
          }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.3, 0.7] }}
          transition={{
            duration: star.duration,
            delay:    star.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}

      {/* ── Bulan Sabit (Kiri Atas) ────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ top: '8%', left: '8%' }}
        animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: THEME.animation.moonFloat, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="100" height="100" viewBox="0 0 88 88" fill="none">
          {/* Glow */}
          <circle cx="44" cy="44" r="44" fill="rgba(255,224,102,0.06)" />
          {/* Bulan sabit */}
          <path
            d="M58 44C58 59.46 46.46 72 31 72C26.2 72 21.7 70.7 17.8 68.4C23.8 75.2 32.4 79.5 42 79.5C59.7 79.5 74 65.2 74 47.5C74 34.8 67.2 23.7 57 18C57.6 26.5 58 35 58 44Z"
            fill="#FFE885"
          />
        </svg>
      </motion.div>

      {/* ── Bintang Besar Dekoratif ─────────────────────── */}
      <motion.div
        className="absolute text-3xl"
        style={{ top: '25%', right: '28%' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute text-2xl"
        style={{ top: '45%', left: '20%' }}
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        ✨
      </motion.div>

      {/* ── Awan Bawah ──────────────────────────────── */}
      <BottomClouds />
    </div>
  );
}
