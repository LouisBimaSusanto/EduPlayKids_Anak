/**
 * ============================================================
 * DESIGN TOKEN — config/theme.js
 * ============================================================
 * Semua nilai warna, ukuran, dan durasi animasi terpusat di sini.
 * Ubah nilai di sini untuk mengubah tampilan seluruh aplikasi.
 * ============================================================
 */

export const THEME = {
  colors: {
    // ── Latar Belakang Langit Malam ─────────────────────────
    bgDeep:    '#0B0725',   // Langit paling gelap (atas)
    bgMid:     '#160D3A',   // Langit tengah
    bgSurface: '#1E1249',   // Langit bawah / permukaan
    bgBottom:  '#2A0F3D',   // Cakrawala bawah

    // ── Aksen Emas ──────────────────────────────────────────
    gold:      '#FFD700',
    goldDark:  '#B8860B',
    goldLight: '#FFE88A',
    amber:     '#F5A623',

    // ── Papan Kayu ──────────────────────────────────────────
    woodDark:    '#3A1A00',   // Bawah papan (bayangan)
    woodMid:     '#6B3A10',   // Tubuh papan
    woodLight:   '#9A5C28',   // Highlight papan
    woodBorder:  '#C07830',   // Border papan
    woodBoltBg:  '#C8A040',   // Baut dekoratif

    // ── Tipografi ────────────────────────────────────────────
    textWhite:   '#FFF5E0',
    textGold:    '#FFD700',
    textMuted:   'rgba(255,245,224,0.65)',

    // ── Elemen Dekoratif Langit ──────────────────────────────
    planetPurple: '#7B42C0',
    planetPurpleHighlight: '#9B6DFF',
    planetBlue:   '#2A72C0',
    planetBlueHighlight: '#5AAFF0',
    moonYellow:   '#FFE066',
    starWhite:    '#FFFFFF',
    cloudWhite:   'rgba(255,255,255,0.14)',
    railBrown:    '#A07848',
    railTie:      '#6B4520',

    // ── Tombol CTA ───────────────────────────────────────────
    ctaBg:       '#FFB800',
    ctaBgHover:  '#FFC933',
    ctaBorder:   '#C47D00',
    ctaShadow:   '#8A5500',
    ctaText:     '#3D1F0A',

    // ── Bottom Navigation ────────────────────────────────────
    navBg:       'rgba(12, 6, 38, 0.94)',
    navBorder:   'rgba(255, 215, 0, 0.28)',
    navActive:   '#FFD700',
    navInactive: 'rgba(255, 245, 224, 0.40)',
    navTreeBg:   'linear-gradient(135deg, #22c55e, #15803d)',
    navTreeGlow: 'rgba(34, 197, 94, 0.55)',
  },

  /**
   * Ukuran minimum touch target (WCAG + rekomendasi anak-anak = 48px)
   */
  touch: {
    min:    48,   // px — semua tombol harus ≥ ini
    icon:   56,   // px — tombol ikon header
    large:  72,   // px — tombol CTA utama (height minimal)
  },

  /**
   * Durasi animasi idle (semua Framer Motion di halaman utama)
   * Nilai panjang = animasi ringan, tidak mengganggu perhatian anak
   */
  animation: {
    twinkleDuration:  3.2,   // detik — kedipan bintang
    cloudDrift:       14,    // detik — awan bergeser
    planetFloat:      10,    // detik — planet melayang
    moonFloat:        8,     // detik — bulan melayang
    ctaBreath:        2.5,   // detik — napas tombol CTA
    trainWiggle:      4,     // detik — goyangan kereta
    mascotWiggle:     4,     // detik — goyangan maskot
  },
};
