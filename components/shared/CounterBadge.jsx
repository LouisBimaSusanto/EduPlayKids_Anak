'use client';

/**
 * ============================================================
 * CounterBadge — Badge Reward Reusable (Bintang / Api)
 * ============================================================
 * Satu komponen dipakai untuk SEMUA jenis counter reward.
 * Cukup ganti props untuk mengubah ikon & warna.
 *
 * Props:
 *   iconName     {string}   Kunci ikon dari config/icons.js
 *   value        {number}   Nilai yang ditampilkan
 *   accentColor  {string}   Warna ikon & border aktif
 *   borderColor  {string}   Override warna border (optional)
 *   onAdd        {function} Callback tombol "+" (opsional)
 *   className    {string}   Class wrapper tambahan
 *
 * Contoh:
 *   <CounterBadge iconName="starPoints" value={50} accentColor="#FFD700" onAdd={handleAddStars} />
 *   <CounterBadge iconName="streakFire" value={7}  accentColor="#FF6B35" borderColor="#CC3300" />
 * ============================================================
 */

import { motion } from 'framer-motion';
import { AppIcon } from './AppIcon';

export function CounterBadge({
  iconName,
  value = 0,
  accentColor = '#FFD700',
  borderColor,
  onAdd,
  className = '',
}) {
  const bc = borderColor || accentColor;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>

      {/* ── Badge Utama ─────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 rounded-full"
        style={{
          padding: '8px 14px',
          background: 'rgba(20, 8, 3, 0.88)',
          border: `2.5px solid ${bc}`,
          boxShadow: `0 4px 0 rgba(0,0,0,0.55), 0 0 14px ${accentColor}30`,
          minWidth: 82,
        }}
      >
        <AppIcon name={iconName} size={22} color={accentColor} />

        {/* Angka — animasi pop saat berubah */}
        <motion.span
          key={value}
          initial={{ scale: 1.35, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="font-black text-lg"
          style={{
            color: '#FFF5E0',
            minWidth: 28,
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {value}
        </motion.span>
      </div>

      {/* ── Tombol Tambah (+) ───────────────────────────────── */}
      {onAdd && (
        <motion.button
          onClick={onAdd}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 34,
            height: 34,
            background: accentColor,
            border: `2px solid ${bc}`,
            boxShadow: `0 3px 0 rgba(0,0,0,0.45)`,
            flexShrink: 0,
          }}
          whileTap={{ scale: 0.88, y: 2 }}
          aria-label={`Tambah ${iconName}`}
        >
          <AppIcon name="addButton" size={17} color="#3D1F0A" strokeWidth={3} />
        </motion.button>
      )}
    </div>
  );
}
