'use client';

import { motion, useMotionValue, animate } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { AppIcon } from '@/components/shared/AppIcon';
import { THEME }   from '@/config/theme';
import styles      from '@/styles/HomepageMapDunia.module.css';
import { TrainTrackPath } from './TrainTrackPath';
import { generateWorldTrackPath } from '@/lib/generateWorldTrackPath';

const TRACK_HEIGHT     = 250; // tinggi area rel (px) — beri ruang cukup utk zigzag naik-turun
const ZIGZAG_AMPLITUDE = 65;  // seberapa jauh rel naik/turun tiap papan

/**
 * @param {object}   props
 * @param {Array<{line1:string, line2:string}>} props.worlds   Daftar dunia (min. 1)
 * @param {string}   props.ctaLabel
 * @param {number}   props.activeDot     Index dunia aktif (controlled dari parent)
 * @param {function} props.onCTA
 * @param {function} props.onDotChange   (idx) => void — dipanggil saat snap ke dunia baru
 */
export function WorldBoardCTA({
  worlds       = [{ line1: 'Dunia', line2: 'Suku Kata' }],
  ctaLabel     = 'Masuk ke Dunia',
  activeDot    = 0,
  onCTA,
  onDotChange,
}) {
  const containerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const x = useMotionValue(0);

  const count = worlds.length;

  // Ukur lebar container secara dinamis (1 papan = 1 lebar container penuh)
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const measure = () => setItemWidth(el.offsetWidth);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sinkronkan posisi track kalau activeDot berubah dari luar (misal via tombol panah/dot)
  useEffect(() => {
    if (!itemWidth) return;
    animate(x, -activeDot * itemWidth, {
      type: 'spring',
      stiffness: 260,
      damping: 26,
    });
  }, [activeDot, itemWidth, x]);

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(count - 1, idx));
    onDotChange?.(clamped);
  }, [count, onDotChange]);

  const handleDragEnd = useCallback((_, info) => {
    if (!itemWidth) return;

    const { velocity } = info;

    // Posisi x saat ini saat dilepaskan
    const currentX = x.get();

    // Prediksi posisi akhir berdasar kecepatan geser (momentum swipe cepat)
    const projectedX = currentX + velocity.x * 0.15;

    let targetIndex = Math.round(-projectedX / itemWidth);
    targetIndex = Math.max(0, Math.min(count - 1, targetIndex));

    // Jalankan animasi snap instan untuk feedback responsif
    animate(x, -targetIndex * itemWidth, {
      type: 'spring',
      stiffness: 260,
      damping: 26,
    });

    // Kabari parent jika berganti dunia
    if (targetIndex !== activeDot) {
      onDotChange?.(targetIndex);
    }
  }, [activeDot, count, itemWidth, onDotChange, x]);

  // Path zigzag dihitung ulang tiap kali itemWidth/count berubah
  const trackPathD = generateWorldTrackPath(
    count,
    itemWidth,
    TRACK_HEIGHT / 2,
    ZIGZAG_AMPLITUDE
  );

  return (
    <div className="flex flex-col items-center w-full" style={{ gap: 24 }}>

      {/* ── Kereta Dekorasi (statis di tengah, tidak ikut geser) ── */}
      <motion.div
        className="relative z-20"
        style={{ marginBottom: -20 }}
        animate={{ x: [-4, 4, -4], y: [0, -3, 0] }}
        transition={{ duration: THEME.animation.trainWiggle, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Asap Kereta */}
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

      {/* ── Viewport track: potong overflow, isi digeser ───────── */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ overflow: 'hidden' }}
      >
        <motion.div
          className="flex relative items-center"
          style={{ x, cursor: 'grab', touchAction: 'pan-y', minHeight: TRACK_HEIGHT }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{
            left:  -(count - 1) * itemWidth,
            right: 0,
          }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
        >
          {/* ── Rel Kereta Zigzag: di belakang papan, ikut geser bersama track ── */}
          {count > 1 && itemWidth > 0 && (
            <TrainTrackPath
              d={trackPathD}
              pathWidth={count * itemWidth}
              pathHeight={TRACK_HEIGHT}
              railColor="#b0883b"
              tieColor="#5c2d16"
              opacity={0.85}
            />
          )}

          {worlds.map((world, i) => (
            <div
              key={i}
              className="flex justify-center shrink-0 relative z-10"
              style={{ width: itemWidth || '100%' }}
            >
              <div className={styles.woodBoard}>
                <div className={styles.bolt} style={{ top: 14,  left: 14  }} />
                <div className={styles.bolt} style={{ top: 14,  right: 14 }} />
                <div className={styles.bolt} style={{ bottom: 14, left: 14  }} />
                <div className={styles.bolt} style={{ bottom: 14, right: 14 }} />

                <div className="text-center py-8 px-12 relative z-10">
                  <h1
                    className="font-black leading-none"
                    style={{
                      fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
                      color: '#FFF5E0',
                      textShadow: '0 3px 8px rgba(0,0,0,0.75), 0 0 22px rgba(255,220,120,0.25)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {world.line1}
                  </h1>
                  <h2
                    className="font-black leading-tight"
                    style={{
                      fontSize: 'clamp(1.8rem, 5vw, 3.4rem)',
                      color: THEME.colors.gold,
                      textShadow: '0 3px 10px rgba(0,0,0,0.85), 0 0 28px rgba(255,190,0,0.45)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {world.line2}
                  </h2>
                </div>

                <div className="absolute" style={{ bottom: -14, left: 18,  fontSize: 28 }}>🌿</div>
                <div className="absolute" style={{ bottom: -14, right: 18, fontSize: 28 }}>🌿</div>
                <div className="absolute" style={{ bottom: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 24 }}>🍀</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Tombol CTA (statis di tengah, tidak ikut geser) ── */}
      <motion.button
        onClick={onCTA}
        className={`flex items-center justify-center gap-3 font-black rounded-2xl ${styles.ctaButton} z-20`}
        style={{
          minWidth: 'clamp(200px, 35vw, 260px)',
          height: THEME.touch.large,
          fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
          paddingLeft: 28,
          paddingRight: 20,
          background: THEME.colors.ctaBg,
          border: `3px solid ${THEME.colors.ctaBorder}`,
          boxShadow: `0 6px 0 ${THEME.colors.ctaShadow}, 0 0 24px rgba(255,184,0,0.38)`,
          color: THEME.colors.ctaText,
          letterSpacing: '0.02em',
        }}
        animate={{ scale: [1, 1.045, 1] }}
        transition={{ duration: THEME.animation.ctaBreath, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.96, y: 5 }}
        aria-label={ctaLabel}
      >
        <span>{ctaLabel}</span>
        <AppIcon name="ctaArrow" size={26} color={THEME.colors.ctaText} strokeWidth={3} />
      </motion.button>

      {/* ── Kontrol Navigasi (Dots + Panah) ────────────────────── */}
      {count > 1 && (
        <div className="flex items-center gap-4 z-20">
          <button
            onClick={() => goTo(activeDot - 1)}
            disabled={activeDot === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              opacity: activeDot === 0 ? 0.35 : 1,
              background: 'rgba(25, 12, 4, 0.65)',
              border: '1.5px solid rgba(255, 215, 0, 0.25)',
              cursor: activeDot === 0 ? 'not-allowed' : 'pointer',
            }}
            aria-label="Dunia sebelumnya"
          >
            <AppIcon name="chevronLeft" size={20} color={THEME.colors.gold} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeDot ? 24 : 10,
                  height: 10,
                  background: i === activeDot ? THEME.colors.gold : 'rgba(255,215,0,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label={`Dunia ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(activeDot + 1)}
            disabled={activeDot === count - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              opacity: activeDot === count - 1 ? 0.35 : 1,
              background: 'rgba(25, 12, 4, 0.65)',
              border: '1.5px solid rgba(255, 215, 0, 0.25)',
              cursor: activeDot === count - 1 ? 'not-allowed' : 'pointer',
            }}
            aria-label="Dunia berikutnya"
          >
            <AppIcon name="chevronRight" size={20} color={THEME.colors.gold} />
          </button>
        </div>
      )}
    </div>
  );
}