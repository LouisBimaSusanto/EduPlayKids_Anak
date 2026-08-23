'use client';

import { useState, useCallback, useEffect } from 'react';
import { ModuleMapPage }    from '@/components/homepage/ModuleMapPage';
import { HomepageMapDunia } from '@/components/homepage/HomepageMapDunia';
import { useRouter }        from 'next/navigation';

const GAME_REPO_URL = process.env.NEXT_PUBLIC_GAME_REPO_URL || 'http://localhost:3002';

const DEMO_USER = {
  userName: 'Ara Demo', userLevel: 2, levelProgress: 35,
  levelMax: 100, walletStars: 50, streakCount: 0, hasNotification: false,
};

function readAllProgress() {
  if (typeof window === 'undefined') return {};
  const result = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('progress_')) result[key] = localStorage.getItem(key);
  }
  return result;
}

export default function HomePage() {
  const router = useRouter();
  
  // Ambil state awal dari sessionStorage jika ada, tapi hindari hydration mismatch
  const [activeModule, setActiveModule] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const [progressMap,  setProgressMap]  = useState({});

  useEffect(() => {
    setIsMounted(true);
    // Baca sessionStorage
    const saved = sessionStorage.getItem('last_active_module');
    if (saved) {
      try { setActiveModule(JSON.parse(saved)); } catch (e) {}
    }
    
    // Baca progress
    setProgressMap(readAllProgress());
    const onFocus = () => setProgressMap(readAllProgress());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleEnterModule = useCallback((mod) => {
    setProgressMap(readAllProgress());
    setActiveModule(mod);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_active_module', JSON.stringify(mod));
    }
  }, []);

  // Klik level di peta level → langsung masuk ke game
  const handleLevelClick = useCallback((levelId) => {
    if (!activeModule) return;
    router.push(`/level/${activeModule.id}/${levelId}`);
  }, [activeModule, router]);

  const headerProps = {
    ...DEMO_USER,
    onAvatarClick:        () => {
      setActiveModule(null);
      if (typeof window !== 'undefined') sessionStorage.removeItem('last_active_module');
    },
    onMascotClick:        () => router.push('/toko'),
    onNotificationClick:  () => {},
    onAddStars:           () => {},
    onAddStreak:          () => {},
  };

  if (activeModule) {
    return (
      <HomepageMapDunia
        {...headerProps}
        moduleIndex={activeModule.index || 1}
        moduleTitle={activeModule.title}
        moduleDesc={activeModule.description || ''}
        modulId={activeModule.id}
        worlds={activeModule.worlds || []}
        progressMap={progressMap}
        onCTA={handleLevelClick}
      />
    );
  }

  return (
    <ModuleMapPage
      {...headerProps}
      onEnterWorld={handleEnterModule}
    />
  );
}