'use client';

/**
 * ============================================================
 * BackgroundScene — Dekorasi Langit Malam
 * ============================================================
 * Semua elemen 2D flat. TIDAK ADA efek 3D, Three.js, atau
 * depth rendering. Animasi hanya idle ringan via Framer Motion.
 *
 * Elemen yang dirender:
 *  - Gradient langit malam
 *  - 28 bintang berkedip (twinkle, staggered)
 *  - Bulan sabit (melayang pelan)
 *  - Planet ungu berdering (kiri, melayang)
 *  - Planet biru kecil (kanan, melayang)
 *  - Bintang dekorasi besar (kiri bawah + kanan)
 *  - 2 awan tipis transparan (bergeser pelan)
 *  - Rel kereta SVG melengkung
 *  - Gradien tanah di bawah
 * ============================================================
 */

import { motion } from 'framer-motion';
import { THEME } from '@/config/theme';

/* ── Posisi bintang dibuat deterministik (bukan Math.random)
      agar tidak berubah tiap render / SSR ──────────────────── */
function generateStars(count) {
  return Array.from({ length: count }, (_, i) => {
    const h1 = ((i * 2654435761) >>> 0) % 10000 / 100;  // 0–99.99
    const h2 = ((i * 1134903170) >>> 0) % 10000 / 100;  // 0–99.99
    const h3 = ((i * 987654321)  >>> 0) % 100;          // 0–99
    return {
      id:       i,
      x:        h1,              // % dari kiri
      y:        h2 * 0.75,      // hanya 75% atas layar (langit)
      size:     1.4 + (h3 % 4) * 0.7,
      delay:    (h3 % 22) * 0.18,
      duration: THEME.animation.twinkleDuration + (h3 % 10) * 0.2,
    };
  });
}

const STARS = generateStars(28);

/* ── Komponen awan (SVG blob oval) ─────────────────────────── */
function CloudBlob({ width = 140, height = 52 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 140 52" fill="white" aria-hidden="true">
      <ellipse cx="70"  cy="36" rx="64"  ry="20" />
      <ellipse cx="44"  cy="30" rx="34"  ry="22" />
      <ellipse cx="96"  cy="28" rx="30"  ry="20" />
      <ellipse cx="70"  cy="24" rx="28"  ry="17" />
    </svg>
  );
}

/* ── Rel kereta SVG melengkung ──────────────────────────────── */
function RailwayTrack() {
  // Dua rel paralel yang melengkung dengan bantalan (sleepers)
  const topRailD   = 'M-20 38 Q200 12 640 40 Q1080 68 1300 30';
  const botRailD   = 'M-20 52 Q200 26 640 54 Q1080 82 1300 44';

  // Posisi bantalan secara manual mengikuti kurva (x, y perkiraan di kurva)
  const sleepers = [
    { x: 20,   y: 36 }, { x: 84,  y: 27 }, { x: 148, y: 22 }, { x: 212, y: 19 },
    { x: 276,  y: 17 }, { x: 340, y: 20 }, { x: 404, y: 24 }, { x: 468, y: 29 },
    { x: 532,  y: 35 }, { x: 596, y: 39 }, { x: 660, y: 43 }, { x: 724, y: 48 },
    { x: 788,  y: 52 }, { x: 852, y: 54 }, { x: 916, y: 55 }, { x: 980, y: 53 },
    { x: 1044, y: 49 }, { x: 1108,y: 43 }, { x: 1172,y: 36 }, { x: 1236,y: 28 },
  ];

  return (
    <svg
      width="100%"
      height="90"
      viewBox="0 0 1280 90"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {/* Bantalan kayu */}
      {sleepers.map((s, i) => (
        <rect
          key={i}
          x={s.x - 2}
          y={s.y + 4}
          width={50}
          height={11}
          rx={2}
          fill={THEME.colors.railTie}
          opacity={0.9}
        />
      ))}
      {/* Rel atas */}
      <path d={topRailD} stroke={THEME.colors.railBrown} strokeWidth="5.5" strokeLinecap="round" />
      {/* Rel bawah */}
      <path d={botRailD} stroke={THEME.colors.railBrown} strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Komponen utama ─────────────────────────────────────────── */
export function BackgroundScene() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ── Gradient Langit Malam ───────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            ${THEME.colors.bgDeep} 0%,
            ${THEME.colors.bgMid} 40%,
            ${THEME.colors.bgSurface} 70%,
            ${THEME.colors.bgBottom} 100%)`,
        }}
      />

      {/* ── Bintang (28 titik berkedip) ─────────────────────── */}
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

      {/* ── Bulan Sabit (kanan atas) ────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ top: '6%', right: '7%' }}
        animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: THEME.animation.moonFloat, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
          {/* Cahaya glow bulan */}
          <circle cx="44" cy="44" r="44" fill="rgba(255,224,102,0.08)" />
          {/* Bentuk bulan sabit */}
          <path
            d="M58 44C58 59.46 46.46 72 31 72C26.2 72 21.7 70.7 17.8 68.4C23.8 75.2 32.4 79.5 42 79.5C59.7 79.5 74 65.2 74 47.5C74 34.8 67.2 23.7 57 18C57.6 26.5 58 35 58 44Z"
            fill={THEME.colors.moonYellow}
          />
          {/* Kilap kecil di bulan */}
          <ellipse cx="36" cy="30" rx="6" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-30 36 30)" />
        </svg>
      </motion.div>

      {/* ── Planet Besar Berdering (kiri tengah) ────────────── */}
      <motion.div
        className="absolute"
        style={{ top: '22%', left: '3%' }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: THEME.animation.planetFloat, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="110" height="76" viewBox="0 0 110 76" fill="none">
          {/* Cincin belakang */}
          <ellipse cx="55" cy="44" rx="52" ry="13" fill="none"
            stroke="rgba(155,109,255,0.35)" strokeWidth="9" />
          {/* Badan planet */}
          <circle cx="55" cy="38" r="30" fill="url(#planetPurple)" />
          {/* Kilap planet */}
          <ellipse cx="44" cy="28" rx="10" ry="6" fill="rgba(255,255,255,0.18)"
            transform="rotate(-20 44 28)" />
          {/* Cincin depan (setengah atas) */}
          <ellipse cx="55" cy="44" rx="52" ry="13" fill="none"
            stroke="rgba(180,140,255,0.55)" strokeWidth="5"
            strokeDasharray="130 30" strokeDashoffset="16" />
          <defs>
            <radialGradient id="planetPurple" cx="35%" cy="32%">
              <stop offset="0%" stopColor={THEME.colors.planetPurpleHighlight} />
              <stop offset="100%" stopColor={THEME.colors.planetPurple} />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ── Planet Kecil Biru (kanan atas) ──────────────────── */}
      <motion.div
        className="absolute"
        style={{ top: '14%', right: '21%' }}
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="25" r="24" fill="url(#planetBlue)" />
          <ellipse cx="25" cy="18" rx="11" ry="4.5" fill="rgba(255,255,255,0.15)"
            transform="rotate(-15 25 18)" />
          <defs>
            <radialGradient id="planetBlue" cx="35%" cy="30%">
              <stop offset="0%" stopColor={THEME.colors.planetBlueHighlight} />
              <stop offset="100%" stopColor={THEME.colors.planetBlue} />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ── Bintang Dekorasi Besar Kiri ─────────────────────── */}
      <motion.div
        className="absolute text-4xl"
        style={{ bottom: '38%', left: '8%' }}
        animate={{ rotate: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        ⭐
      </motion.div>

      {/* ── Bintang Dekorasi Besar Kanan ────────────────────── */}
      <motion.div
        className="absolute text-3xl"
        style={{ bottom: '28%', right: '6%' }}
        animate={{ rotate: [0, -18, 0], scale: [0.9, 1.2, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        ⭐
      </motion.div>

      {/* ── Awan Kiri (bergeser sangat pelan) ───────────────── */}
      <motion.div
        className="absolute"
        style={{ bottom: '34%', left: '-4%', opacity: 0.22 }}
        animate={{ x: [0, 18, 0] }}
        transition={{ duration: THEME.animation.cloudDrift, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CloudBlob width={170} height={58} />
      </motion.div>

      {/* ── Awan Kanan (bergeser berlawanan arah) ───────────── */}
      <motion.div
        className="absolute"
        style={{ bottom: '26%', right: '-2%', opacity: 0.16 }}
        animate={{ x: [0, -14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      >
        <CloudBlob width={130} height={46} />
      </motion.div>

      {/* ── Rel Kereta (bawah) ──────────────────────────────── */}
      <div
        className="absolute left-0 right-0 w-full"
        style={{ bottom: '12%', height: 90 }}
      >
        <RailwayTrack />
      </div>

      {/* ── Gradien Tanah / Ground ──────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '14%',
          background: 'linear-gradient(0deg, rgba(8,22,8,0.85) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
