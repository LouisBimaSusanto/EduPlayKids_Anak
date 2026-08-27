'use client';

import { BackgroundScene }  from './BackgroundScene';
import { HeaderBar }        from './HeaderBar';
import { WorldBoardCTA }    from './WorldBoardCTA';
import { BottomNavigation } from './BottomNavigation';
import { THEME }            from '@/config/theme';
import { useState, useEffect } from 'react';



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
 * Module data props:
 * @param {number}   props.moduleIndex      — Nomor modul (e.g. 1)
 * @param {string}   props.moduleTitle      — Judul modul (e.g. "Membaca")
 * @param {string}   props.moduleDesc       — Deskripsi singkat modul
 * @param {string}   props.modulId          — ID modul (untuk lookup progress localStorage)
 * @param {Array}    props.worlds           — Daftar level/dunia dalam modul
 * @param {object}   props.progressMap      — Map key:value dari localStorage
 * @param {function} props.onCTA            — Callback saat user klik level (dipanggil dgn levelId)
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

  // ── Module Data ──────────────────────────────────────────
  moduleIndex         = 1,
  moduleTitle         = 'Membaca',
  moduleDesc          = '',
  modulId             = '',
  worlds              = [],
  progressMap         = {},
  onCTA,
}) {
  const [totalStars, setTotalStars] = useState(30);

  useEffect(() => {
    fetch(`/api/manifest`)
      .then(r => r.json())
      .then(d => {
        const mods = d.modules?.filter(m => m.is_active) || [];
        setTotalStars(mods.reduce((acc, m) => acc + (m.worlds?.length || 0), 0) * 3);
      })
      .catch(() => {});
  }, []);

  return (
    <main
      className="relative w-full overflow-hidden"
      style={{
        height:    '100dvh',
        minHeight: '100vh',
      }}
    >
      {/* ── Layer 0: Latar Belakang ───────────────────────────── */}
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

      {/* ── Layer 2: Peta Level Horizontal (tengah vertikal) ──── */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          height:        '100%',
          paddingTop:    76,
          paddingBottom: 72,
        }}
      >
        <WorldBoardCTA
          moduleIndex={moduleIndex}
          moduleTitle={moduleTitle}
          moduleDesc={moduleDesc}
          modulId={modulId}
          worlds={worlds}
          progressMap={progressMap}
          onCTA={onCTA}
        />
      </div>

      {/* ── Layer 3: Bottom Bar konsisten + Bottom Navigation ─── */}
      <div className="flex items-center justify-between px-8 flex-shrink-0 bg-transparent absolute left-0 right-0 z-40 pointer-events-none"
        style={{ bottom: 72 }}>
        <button
          onClick={onAvatarClick}
          className="flex items-center gap-2 rounded-full px-5 py-3 font-black text-sm transition-transform active:scale-95 pointer-events-auto"
          style={{ background: 'rgba(25,12,4,0.8)', border: '2px solid rgba(255,215,0,0.4)', color: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
        >
          📖 Daftar Modul
        </button>

        <div className="flex items-center gap-2 rounded-full px-5 py-3 pointer-events-auto"
          style={{ background: 'rgba(25,12,4,0.8)', border: '2px solid rgba(255,215,0,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: 22 }}>⭐</span>
          <span className="font-black text-base" style={{ color: THEME.colors.gold }}>
            {walletStars}/{totalStars}
          </span>
          <span style={{ fontSize: 20, marginLeft: 8 }}>🎁</span>
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}