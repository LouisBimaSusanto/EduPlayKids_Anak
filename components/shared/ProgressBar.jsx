'use client';

/**
 * ============================================================
 * ProgressBar — Reusable XP / Level Progress Bar
 * ============================================================
 * Props:
 *   value       {number}  Nilai saat ini
 *   max         {number}  Nilai maksimum
 *   color       {string}  Warna fill bar (hex / rgb / CSS var)
 *   bgColor     {string}  Warna background bar
 *   height      {number}  Ketebalan bar dalam px
 *   className   {string}  Class wrapper tambahan
 * ============================================================
 */

import { motion } from 'framer-motion';

export function ProgressBar({
  value = 0,
  max = 100,
  color = '#FFD700',
  bgColor = 'rgba(255, 255, 255, 0.15)',
  height = 8,
  className = '',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor, height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progress: ${Math.round(pct)}%`}
    >
      <motion.div
        className="h-full rounded-full relative"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.34, 1.1, 0.64, 1], delay: 0.35 }}
      >
        {/* Kilap di ujung bar */}
        <span
          className="absolute right-0 top-0 bottom-0 w-3 rounded-full"
          style={{ background: 'rgba(255,255,255,0.5)', filter: 'blur(2px)' }}
        />
      </motion.div>
    </div>
  );
}
