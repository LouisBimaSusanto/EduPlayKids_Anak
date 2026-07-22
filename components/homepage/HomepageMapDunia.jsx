'use client';

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
 * @param {Array<{line1:string, line2:string}>} props.worlds   Daftar dunia (min. 1)
 * @param {string}   props.ctaLabel         Teks tombol CTA
 * @param {number}   props.activeDot        Indeks dunia aktif (controlled)
 * @param {function} props.onCTA            Callback "Masuk ke Dunia"
 * @param {function} props.onDotChange      Callback saat dunia aktif berubah (idx) => void
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
  worlds              = [
    { line1: 'Dunia', line2: 'Suku Kata' },
    // { line1: 'Dunia', line2: 'Kalimat' },
    // { line1: 'Dunia', line2: 'Cerita' },
  ],
  ctaLabel            = 'Masuk ke Dunia',
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
          worlds={worlds}
          ctaLabel={ctaLabel}
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