'use client';

/**
 * ============================================================
 * WorldBoardCTA — Papan Judul Dunia + Tombol "Masuk ke Dunia"
 * ============================================================
 * Elemen visual utama halaman: papan kayu besar di tengah layar,
 * kereta dekorasi di atasnya, CTA button, dan dot indicator.
 *
 * Animasi:
 *  - Papan: fade+scale masuk saat mount
 *  - Kereta: wiggle X + float Y (idle loop)
 *  - CTA: breathing scale (idle loop)
 *  - CTA hover/tap: tekan ke bawah
 *
 * Styling papan kayu memakai CSS Modules (HomepageMapDunia.module.css).
 * ============================================================
 */

import { motion } from 'framer-motion';
import { AppIcon } from '@/components/shared/AppIcon';
import { THEME }   from '@/config/theme';
import styles      from '@/styles/HomepageMapDunia.module.css';

/**
 * @param {object}   props
 * @param {string}   props.worldLine1    Baris pertama judul (warna putih)
 * @param {string}   props.worldLine2    Baris kedua judul (warna emas)
 * @param {string}   props.ctaLabel      Teks tombol CTA
 * @param {number}   props.dotCount      Jumlah titik indikator (≥1 = tampil)
 * @param {number}   props.activeDot     Indeks titik aktif (0-based)
 * @param {function} props.onCTA         Callback tombol "Masuk ke Dunia"
 * @param {function} props.onDotChange   Callback saat titik diganti (idx) => void
 */
export function WorldBoardCTA({
  worldLine1   = 'Dunia',
  worldLine2   = 'Suku Kata',
  ctaLabel     = 'Masuk ke Dunia',
  dotCount     = 1,
  activeDot    = 0,
  onCTA,
  onDotChange,
}) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 24 }}>

      {/* ── Kereta Dekorasi (di atas papan) ─────────────────── */}
      <motion.div
        className="relative z-10"
        style={{ marginBottom: -20 }}
        animate={{ x: [-4, 4, -4], y: [0, -3, 0] }}
        transition={{
          duration: THEME.animation.trainWiggle,
          repeat:   Infinity,
          ease:     'easeInOut',
        }}
      >
        {/* Asap kereta kecil */}
        <motion.div
          className="absolute -top-3 left-3 w-4 h-4 rounded-full"
          style={{ background: 'rgba(255,255,255,0.25)', filter: 'blur(3px)' }}
          animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -top-1 left-8 w-3 h-3 rounded-full"
          style={{ background: 'rgba(255,255,255,0.2)', filter: 'blur(2px)' }}
          animate={{ y: [0, -6, 0], opacity: [0.3, 0.7, 0.3], scale: [0.7, 1.2, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />

        <AppIcon name="trainDecor" size={64} />
      </motion.div>

      {/* ── Papan Kayu Utama ─────────────────────────────────── */}
      <motion.div
        className={styles.woodBoard}
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        transition={{ duration: 0.55, ease: [0.34, 1.2, 0.64, 1], delay: 0.15 }}
      >
        {/* Baut di empat sudut papan */}
        <div className={styles.bolt} style={{ top: 14,  left: 14  }} />
        <div className={styles.bolt} style={{ top: 14,  right: 14 }} />
        <div className={styles.bolt} style={{ bottom: 14, left: 14  }} />
        <div className={styles.bolt} style={{ bottom: 14, right: 14 }} />

        {/* Teks judul dunia */}
        <div className="text-center py-8 px-12 relative z-10">
          {/* Baris 1 — putih */}
          <h1
            className="font-black leading-none"
            style={{
              fontSize:   'clamp(2rem, 5.5vw, 3.8rem)',
              color:      '#FFF5E0',
              textShadow: '0 3px 8px rgba(0,0,0,0.75), 0 0 22px rgba(255,220,120,0.25)',
              letterSpacing: '-0.01em',
            }}
          >
            {worldLine1}
          </h1>
          {/* Baris 2 — emas */}
          <h2
            className="font-black leading-tight"
            style={{
              fontSize:   'clamp(1.8rem, 5vw, 3.4rem)',
              color:      THEME.colors.gold,
              textShadow: '0 3px 10px rgba(0,0,0,0.85), 0 0 28px rgba(255,190,0,0.45)',
              letterSpacing: '-0.01em',
            }}
          >
            {worldLine2}
          </h2>
        </div>

        {/* Tanaman dekorasi di sudut bawah papan */}
        <div className="absolute" style={{ bottom: -14, left: 18,  fontSize: 28 }}>🌿</div>
        <div className="absolute" style={{ bottom: -14, right: 18, fontSize: 28 }}>🌿</div>
        <div className="absolute" style={{ bottom: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 24 }}>🍀</div>
      </motion.div>

      {/* ── Tombol CTA "Masuk ke Dunia" ──────────────────────── */}
      <motion.button
        onClick={onCTA}
        className={`flex items-center justify-center gap-3 font-black rounded-2xl ${styles.ctaButton}`}
        style={{
          minWidth:        'clamp(200px, 35vw, 260px)',
          height:          THEME.touch.large,
          fontSize:        'clamp(0.95rem, 2vw, 1.2rem)',
          paddingLeft:     28,
          paddingRight:    20,
          background:      THEME.colors.ctaBg,
          border:          `3px solid ${THEME.colors.ctaBorder}`,
          boxShadow:       `0 6px 0 ${THEME.colors.ctaShadow}, 0 0 24px rgba(255,184,0,0.38)`,
          color:           THEME.colors.ctaText,
          letterSpacing:   '0.02em',
        }}
        /* Napas halus saat idle */
        animate={{ scale: [1, 1.045, 1] }}
        transition={{
          duration: THEME.animation.ctaBreath,
          repeat:   Infinity,
          ease:     'easeInOut',
        }}
        /* Efek tekan ke bawah */
        whileTap={{ scale: 0.96, y: 5 }}
        aria-label={ctaLabel}
      >
        <span>{ctaLabel}</span>
        <AppIcon name="ctaArrow" size={26} color={THEME.colors.ctaText} strokeWidth={3} />
      </motion.button>

      {/* ── Dot Indicator Carousel ────────────────────────────── */}
      {dotCount > 1 && (
        <div className="flex items-center gap-2" role="tablist" aria-label="Pilih Dunia">
          {Array.from({ length: dotCount }, (_, i) => (
            <motion.button
              key={i}
              role="tab"
              aria-selected={i === activeDot}
              aria-label={`Dunia ${i + 1}`}
              onClick={() => onDotChange?.(i)}
              className="rounded-full"
              style={{
                width:      i === activeDot ? 26 : 10,
                height:     10,
                background: i === activeDot
                  ? THEME.colors.gold
                  : 'rgba(255,215,0,0.28)',
                border: 'none',
              }}
              animate={{ width: i === activeDot ? 26 : 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
