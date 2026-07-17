'use client';

/**
 * ============================================================
 * app/page.js — Homepage (Map Dunia)
 * ============================================================
 * Bertanggung jawab atas:
 *   1. Auth guard (redirect ke /login jika belum login)
 *   2. Fetch manifest dunia dari game server
 *   3. Fetch progress anak (bintang, streak, level)
 *   4. Mengirim semua data sebagai props ke HomepageMapDunia
 *
 * Tidak ada JSX presentasional di sini — semua ada di /components.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';
import { useAuth }             from '@/context/AuthContext';
import api                     from '@/services/backendApi';
import { HomepageMapDunia }    from '@/components/homepage/HomepageMapDunia';

const GAME_REPO_URL = process.env.NEXT_PUBLIC_GAME_REPO_URL || 'http://localhost:3002';

/**
 * Manifest fallback — dipakai jika game server tidak tersedia,
 * sehingga halaman tetap tampil dengan konten default.
 */
const FALLBACK_MANIFEST = {
  modules: [
    {
      id: 'fonik',
      title: 'Fonik',
      worlds: [
        { id: 'suku-kata', title: 'Suku Kata' },
      ],
    },
  ],
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // ── State data ──────────────────────────────────────────
  const [manifest,    setManifest]    = useState(null);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [walletStars, setWalletStars] = useState(0);
  const [streak,      setStreak]      = useState(0);
  const [activeDot,   setActiveDot]   = useState(0);

  // ── Fetch manifest dunia dari game server ────────────────
  useEffect(() => {
    fetch(`${GAME_REPO_URL}/api/manifest`)
      .then(res => res.json())
      .then(setManifest)
      .catch(err => {
        console.warn('[HomePage] Gagal fetch manifest, menggunakan fallback:', err.message);
        setManifest(FALLBACK_MANIFEST);
      });
  }, []);

  // ── Auth guard ───────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  // ── Fetch progress anak ──────────────────────────────────
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const fetchProgress = async () => {
      try {
        // Jika user adalah PARENT, gunakan anak pertamanya
        let targetChildId = user.id;
        if (user.role === 'PARENT' || !targetChildId) {
          const childrenList = await api.children.getAll();
          const childrenData = childrenList.data || childrenList;
          if (Array.isArray(childrenData) && childrenData.length > 0) {
            targetChildId = childrenData[0].id;
          }
        }
        if (!targetChildId) return;

        const progress  = await api.progress.getByChildId(targetChildId);
        const progData  = progress.data || progress;
        if (progData) {
          setMaxUnlocked(progData.maxUnlocked || 1);
          setWalletStars(progData.walletStars  || 0);
          setStreak(     progData.streak       || 1);
        }
      } catch {
        // Fallback ke localStorage jika API tidak tersedia
        const saved      = localStorage.getItem('eduplay_max_unlocked');
        const savedStars = localStorage.getItem('eduplay_wallet_stars');
        if (saved)      setMaxUnlocked(parseInt(saved,      10));
        if (savedStars) setWalletStars(parseInt(savedStars, 10));
      }
    };

    fetchProgress();
  }, [isLoading, isAuthenticated, user]);

  // ── Derive tampilan dari manifest ────────────────────────
  // Flatten semua worlds dari semua modul untuk dot indicator
  const worlds = manifest
    ? manifest.modules.flatMap(m =>
        m.worlds.map(w => ({ ...w, moduleId: m.id, moduleName: m.title }))
      )
    : [];

  const currentWorld = worlds[activeDot] ?? null;

  // Judul papan: split "Dunia Suku Kata" → ["Dunia", "Suku Kata"]
  // Anggap kata pertama = baris 1, sisanya = baris 2
  const titleWords  = (currentWorld?.title ?? 'Dunia Suku Kata').split(' ');
  const worldLine1  = titleWords[0] ?? 'Dunia';
  const worldLine2  = titleWords.slice(1).join(' ') || 'Suku Kata';

  // Nama tampilan: prioritas anak, fallback user, fallback default
  const displayName =
    user?.name                    ??
    user?.children?.[0]?.name     ??
    'Anak';

  // Level & progress — pakai current_level dari user atau maxUnlocked sebagai proxy
  const userLevel     = user?.current_level ?? maxUnlocked;
  const levelProgress = (maxUnlocked % 6) * (100 / 6);  // XP dalam 1 level (6 node per world)

  // ── Handler navigasi ─────────────────────────────────────
  const handleEnterWorld = () => {
    if (!currentWorld) return;
    router.push(`/level/${currentWorld.moduleId}/${currentWorld.id}`);
  };

  // ── Loading state ────────────────────────────────────────
  if (isLoading || !manifest) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #0B0725 0%, #160D3A 100%)' }}
      >
        <p
          className="text-4xl font-black animate-pulse"
          style={{ color: '#FFF5E0' }}
        >
          Memuat...
        </p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <HomepageMapDunia
      /* Header */
      userName={displayName}
      userLevel={userLevel}
      levelProgress={levelProgress}
      levelMax={100}
      walletStars={walletStars}
      streakCount={streak}
      hasNotification={false}
      onAvatarClick={()      => router.push('/profil')}
      onMascotClick={()      => router.push('/toko')}
      onNotificationClick={() => { /* TODO: buka panel notifikasi */ }}
      onAddStars={()         => { /* TODO: logic tambah bintang */ }}
      onAddStreak={()        => { /* TODO: logic tambah streak  */ }}

      /* World Board */
      worldLine1={worldLine1}
      worldLine2={worldLine2}
      ctaLabel="Masuk ke Dunia"
      dotCount={worlds.length || 1}
      activeDot={activeDot}
      onCTA={handleEnterWorld}
      onDotChange={setActiveDot}
    />
  );
}
