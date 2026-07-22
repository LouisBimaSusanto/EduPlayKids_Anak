'use client';

/**
 * ============================================================
 * AppIcon — Wrapper Ikon Universal
 * ============================================================
 * Membaca konfigurasi dari config/icons.js dan merender ikon
 * sesuai tipe (lucide, emoji, atau image).
 *
 * Penggunaan:
 *   <AppIcon name="starPoints" size={24} color="#FFD700" />
 *   <AppIcon name="userAvatar" size={40} />
 *
 * Untuk mengganti ikon ke versi custom:
 *   1. Edit config/icons.js (ganti type ke 'image' + isi src)
 *   2. Tidak perlu mengubah komponen ini sama sekali.
 * ============================================================
 */

import {
  Star, Flame, Bell, Plus, ChevronRight, ChevronLeft,
  Home, User, HelpCircle,
} from 'lucide-react';
import { ICONS } from '@/config/icons';

/**
 * Peta nama → komponen lucide-react.
 * Tambahkan entri baru di sini jika config/icons.js menggunakan
 * nama lucide yang belum terdaftar.
 */
const LUCIDE_MAP = {
  Star,
  Flame,
  Bell,
  Plus,
  ChevronRight,
  ChevronLeft,
  Home,
  User,
};

/**
 * @param {object} props
 * @param {string}  props.name        - Kunci dari ICONS di config/icons.js
 * @param {number}  [props.size=24]   - Ukuran dalam px
 * @param {string}  [props.color]     - Warna ikon (untuk lucide)
 * @param {number}  [props.strokeWidth=2] - Ketebalan garis (untuk lucide)
 * @param {string}  [props.className] - Class CSS tambahan
 * @param {string}  [props.style]     - Style inline tambahan
 */
export function AppIcon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  style,
}) {
  const config = ICONS[name];

  // Fallback jika nama ikon tidak ditemukan di config
  if (!config) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[AppIcon] Ikon "${name}" tidak ditemukan di config/icons.js`);
    }
    return (
      <HelpCircle
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        style={style}
      />
    );
  }

  // ── Tipe: lucide ──────────────────────────────────────────
  if (config.type === 'lucide') {
    const LucideComp = LUCIDE_MAP[config.name];
    if (!LucideComp) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[AppIcon] Lucide icon "${config.name}" belum ada di LUCIDE_MAP. Tambahkan importnya di AppIcon.jsx.`);
      }
      return <HelpCircle size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} />;
    }
    return (
      <LucideComp
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        style={style}
      />
    );
  }

  // ── Tipe: emoji ───────────────────────────────────────────
  if (config.type === 'emoji') {
    return (
      <span
        role="img"
        aria-label={name}
        className={className}
        style={{
          fontSize: size,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          ...style,
        }}
      >
        {config.value}
      </span>
    );
  }

  // ── Tipe: image ───────────────────────────────────────────
  if (config.type === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={config.src}
        alt={config.alt || name}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain', display: 'inline-block', ...style }}
        loading="lazy"
      />
    );
  }

  return null;
}
