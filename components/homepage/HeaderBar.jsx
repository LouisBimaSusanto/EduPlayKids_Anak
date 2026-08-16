'use client';

/**
 * ============================================================
 * HeaderBar — Top Bar Halaman Utama
 * ============================================================
 * Menampilkan: avatar + nama + level + XP bar (kiri),
 *              badge bintang + badge api (tengah),
 *              maskot owl + lonceng notifikasi (kanan).
 *
 * Semua ikon menggunakan <AppIcon> — ganti via config/icons.js.
 * Semua data diterima via props dari parent (HomepageMapDunia).
 * ============================================================
 */

import Link       from 'next/link';
import { motion } from 'framer-motion';
import { AppIcon }      from '@/components/shared/AppIcon';
import { ProgressBar }  from '@/components/shared/ProgressBar';
import { CounterBadge } from '@/components/shared/CounterBadge';
import { THEME } from '@/config/theme';

/**
 * @param {object}   props
 * @param {string}   props.userName          Nama anak yang ditampilkan
 * @param {number}   props.userLevel         Level saat ini
 * @param {number}   props.levelProgress     Progress XP saat ini (0–levelMax)
 * @param {number}   props.levelMax          Nilai XP maksimum untuk level ini
 * @param {number}   props.walletStars       Jumlah bintang/poin
 * @param {number}   props.streakCount       Jumlah api/streak
 * @param {boolean}  props.hasNotification   Tampilkan badge merah di lonceng
 * @param {function} props.onAvatarClick     Klik avatar → biasanya ke /profil
 * @param {function} props.onMascotClick     Klik maskot → biasanya ke /toko
 * @param {function} props.onNotificationClick
 * @param {function} props.onAddStars        Tombol + di badge bintang
 * @param {function} props.onAddStreak       Tombol + di badge api
 */
export function HeaderBar({
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
}) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 px-4 py-3"
      style={{
        background: 'linear-gradient(180deg, rgba(11,7,37,0.97) 0%, rgba(11,7,37,0.0) 100%)',
      }}
    >
      <div className="flex items-center justify-between gap-2 w-full max-w-screen-xl mx-auto">

        {/* ── KIRI: Avatar + Nama + Level + XP ───────────────── */}
        <Link href="/profil">
          <motion.div
            className="flex items-center gap-3 flex-shrink-0 pr-4 pl-1 py-1 rounded-full cursor-pointer"
            whileTap={{ scale: 0.94 }}
            style={{ 
              minWidth: 0,
              background: '#FFF5E0',
              border: `2px solid #2C136A`,
              boxShadow: `0 4px 12px rgba(0,0,0,0.4)`
            }}
          >
          {/* Lingkaran avatar */}
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width:  48,
              height: 48,
              background:  '#FFF',
              border:      `2px solid ${THEME.colors.gold}`,
            }}
          >
            <AppIcon name="userAvatar" size={32} />
          </div>

          {/* Nama + Level + XP bar */}
          <div className="flex flex-col items-start gap-0.5">
            <span
              className="font-black leading-none whitespace-nowrap text-left"
              style={{ color: '#1E1B4B', fontSize: 'clamp(0.78rem, 1.4vw, 1rem)' }}
            >
              Halo, {userName}!
            </span>
            <span
              className="font-bold leading-none text-left"
              style={{ color: '#4F46E5', fontSize: '0.72rem', marginBottom: 2 }}
            >
              Level {userLevel}
            </span>
            <ProgressBar
              value={levelProgress}
              max={levelMax}
              color={THEME.colors.gold}
              bgColor="rgba(0,0,0,0.1)"
              height={6}
              className="w-24"
            />
          </div>
        </motion.div>
      </Link>

        {/* ── TENGAH: Badge Bintang + Badge Api ──────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <CounterBadge
            iconName="starPoints"
            value={walletStars}
            accentColor={THEME.colors.gold}
            borderColor={THEME.colors.goldDark}
            onAdd={onAddStars}
          />
          <CounterBadge
            iconName="streakFire"
            value={streakCount}
            accentColor="#FF6B35"
            borderColor="#CC3300"
            onAdd={onAddStreak}
          />
        </div>

        {/* ── KANAN: Maskot Owl + Notifikasi Bell ────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Maskot Owl — goyang kepala secara berkala */}
          <motion.button
            onClick={onMascotClick}
            className="flex items-center justify-center rounded-full"
            style={{
              width:  THEME.touch.icon,
              height: THEME.touch.icon,
              background:  'rgba(25, 12, 4, 0.85)',
              border:      `3px solid ${THEME.colors.gold}`,
              boxShadow:   `0 5px 0 ${THEME.colors.goldDark}`,
            }}
            whileTap={{ scale: 0.88 }}
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{
              duration: THEME.animation.mascotWiggle,
              repeat:   Infinity,
              delay:    4,
              ease:     'easeInOut',
            }}
          >
            <AppIcon name="mascotOwl" size={34} />
          </motion.button>

          {/* Lonceng Notifikasi */}
          <motion.button
            onClick={onNotificationClick}
            className="relative flex items-center justify-center rounded-full"
            style={{
              width:      THEME.touch.min,
              height:     THEME.touch.min,
              background: 'rgba(25, 12, 4, 0.75)',
              border:     '2px solid rgba(255,215,0,0.4)',
            }}
            whileTap={{ scale: 0.88 }}
            aria-label="Notifikasi"
          >
            <AppIcon name="notificationBell" size={24} color={THEME.colors.textWhite} />

            {/* Badge merah notifikasi baru */}
            {hasNotification && (
              <motion.span
                className="absolute rounded-full"
                style={{
                  top: 8, right: 8,
                  width: 10, height: 10,
                  background: '#FF3333',
                  border: `2px solid ${THEME.colors.bgDeep}`,
                }}
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.button>
        </div>

      </div>
    </header>
  );
}
