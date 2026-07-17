/**
 * ============================================================
 * SISTEM IKON TERPUSAT — config/icons.js
 * ============================================================
 * Untuk mengganti ikon, ubah nilainya di sini SAJA tanpa
 * menyentuh komponen apa pun.
 *
 * Format yang didukung:
 *   { type: 'lucide', name: 'Star' }
 *     → render komponen lucide-react berdasarkan nama
 *
 *   { type: 'emoji', value: '⭐' }
 *     → render emoji sebagai <span>
 *
 *   { type: 'image', src: '/assets/icons/star.svg', alt: 'Bintang' }
 *     → render <img> dari file lokal / URL eksternal
 * ============================================================
 */

export const ICONS = {
  // ── User & Maskot ──────────────────────────────────────────
  /** Avatar default anak. Ganti dengan { type: 'image', src: '...' } untuk foto nyata. */
  userAvatar: { type: 'emoji', value: '👦' },

  /** Maskot burung hantu. Ganti src jika ada asset khusus. */
  mascotOwl: { type: 'emoji', value: '🦉' },

  // ── Widget Reward ──────────────────────────────────────────
  /** Ikon bintang/poin di header. */
  starPoints: { type: 'lucide', name: 'Star' },

  /** Ikon api/streak harian di header. */
  streakFire: { type: 'lucide', name: 'Flame' },

  // ── Kontrol UI ─────────────────────────────────────────────
  /** Ikon lonceng notifikasi. */
  notificationBell: { type: 'lucide', name: 'Bell' },

  /** Tombol tambah (+) pada badge reward. */
  addButton: { type: 'lucide', name: 'Plus' },

  /** Panah di tombol CTA "Masuk ke Dunia". */
  ctaArrow: { type: 'lucide', name: 'ChevronRight' },

  // ── Bottom Navigation ──────────────────────────────────────
  /** Ikon tab Peta (halaman utama). */
  navMap: { type: 'lucide', name: 'Home' },

  /** Ikon tab Pohon Kehidupan. Emoji dipakai untuk keamanan versi lucide. */
  navTree: { type: 'emoji', value: '🌳' },

  /** Ikon tab Profil anak. */
  navProfile: { type: 'lucide', name: 'User' },

  // ── Dekorasi ───────────────────────────────────────────────
  /** Kereta kecil di atas papan judul. */
  trainDecor: { type: 'emoji', value: '🚂' },
};
