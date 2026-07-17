'use client';

/**
 * ============================================================
 * HomepageMapDunia — Komponen Utama Homepage
 * ============================================================
 * Hanya bertugas menyusun (compose) sub-komponen:
 *   BackgroundScene → HeaderBar → WorldBoardCTA → BottomNavigation
 *
 * Semua data datang dari parent (app/page.js) via props.
 * Tidak ada state lokal, tidak ada fetch data di sini.
 * ============================================================
 */

import { BackgroundScene }  from './BackgroundScene';
import { HeaderBar }        from './HeaderBar';
import { WorldBoardCTA }    from './WorldBoardCTA';
import { BottomNavigation } from './BottomNavigation';

/**
 * @param {object}   props
 *
 * Header props:
 * @param {string}   props.userName
 * @param {number}   props.userLevel
 * @param {number}   props.levelProgress
 * @param {number}   props.levelMax
 * @param {number}   props.walletStars
 * @param {number}   props.streakCount
 * @param {boolean}  props.hasNotification
 * @param {function} props.onAvatarClick
 * @param {function} props.onMascotClick
 * @param {function} props.onNotificationClick
 * @param {function} props.onAddStars
 * @param {function} props.onAddStreak
 *
 * World board props:
 * @param {string}   props.worldLine1       Judul baris 1 (putih)
 * @param {string}   props.worldLine2       Judul baris 2 (emas)
 * @param {string}   props.ctaLabel         Teks tombol CTA
 * @param {number}   props.dotCount         Jumlah dunia / dot indicator
 * @param {number}   props.activeDot        Indeks dunia aktif
 * @param {function} props.onCTA            Callback "Masuk ke Dunia"
 * @param {function} props.onDotChange      Callback ganti dunia (idx) => void
 */
export function HomepageMapDunia({
  // ── Header ──────────────────────────────────────────────
  userName            = 'Anak',
  userLevel           = 1,
  levelProgress       = 0,
  levelMax            = 100,
  walletStars         = 0,
  streakCount         = 0,
  hasNotification     = false,
  onAvatarClick,
  onMascotClick,
  onNotificationClick,
  onAddStars,
  onAddStreak,

  // ── World Board ──────────────────────────────────────────
  worldLine1          = 'Dunia',
  worldLine2          = 'Suku Kata',
  ctaLabel            = 'Masuk ke Dunia',
  dotCount            = 1,
  activeDot           = 0,
  onCTA,
  onDotChange,
}) {
  return (
    <main
      className="relative w-full overflow-hidden"
      style={{
        height:    '100dvh',  // Dynamic viewport height (safe for mobile)
        minHeight: '100vh',
      }}
    >
      {/* ── Layer 0: Latar Belakang Langit Malam ─────────────── */}
      <BackgroundScene />

      {/* ── Layer 1: Header (fixed top) ──────────────────────── */}
      <HeaderBar
        userName={userName}
        userLevel={userLevel}
        levelProgress={levelProgress}
        levelMax={levelMax}
        walletStars={walletStars}
        streakCount={streakCount}
        hasNotification={hasNotification}
        onAvatarClick={onAvatarClick}
        onMascotClick={onMascotClick}
        onNotificationClick={onNotificationClick}
        onAddStars={onAddStars}
        onAddStreak={onAddStreak}
      />

      {/* ── Layer 2: Konten Utama (papan judul, ditengah vertikal) */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          height: '100%',
          /* Beri ruang untuk header & bottom nav agar papan benar-benar di tengah */
          paddingTop:    80,
          paddingBottom: 90,
        }}
      >
        <WorldBoardCTA
          worldLine1={worldLine1}
          worldLine2={worldLine2}
          ctaLabel={ctaLabel}
          dotCount={dotCount}
          activeDot={activeDot}
          onCTA={onCTA}
          onDotChange={onDotChange}
        />
      </div>

      {/* ── Layer 3: Bottom Navigation (fixed bottom) ─────────── */}
      <BottomNavigation />
    </main>
  );
}
