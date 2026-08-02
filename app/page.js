'use client';

import { useState, useCallback } from 'react';
import { ModuleMapPage } from '@/components/homepage/ModuleMapPage';
import { HomepageMapDunia } from '@/components/homepage/HomepageMapDunia';
import { useRouter } from 'next/navigation';

const DEMO_USER = {
  userName: 'Ara Demo', userLevel: 2, levelProgress: 35,
  levelMax: 100, walletStars: 50, streakCount: 0, hasNotification: false,
};

export default function HomePage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState(null);
  const [activeDot, setActiveDot] = useState(0);

  const handleEnterWorld = useCallback((mod) => {
    setActiveDot(0);
    setActiveModule(mod);
  }, []);

  const handleCTA = useCallback(() => {
    if (!activeModule) return;
    const worlds = activeModule.worlds || [];
    const activeWorld = worlds.find(w => localStorage.getItem(`progress_${activeModule.id}_${w.id}`) !== 'completed') || worlds[activeDot];
    if (activeWorld) router.push(`/level/${activeModule.id}/${activeWorld.id}`);
  }, [activeModule, activeDot, router]);

  const headerProps = {
    ...DEMO_USER,
    onAvatarClick: () => setActiveModule(null), // kembali ke peta
    onMascotClick: () => router.push('/toko'),
    onNotificationClick: () => { },
    onAddStars: () => { },
    onAddStreak: () => { },
  };

  if (activeModule) {
    return (
      <HomepageMapDunia
        {...headerProps}
        worlds={activeModule.worlds?.map(w => ({
          line1: activeModule.title.replace(/Modul \d+ - /, ''),
          line2: w.title,
          levelId: w.id,
          modulId: activeModule.id,
        })) || []}
        ctaLabel="Masuk ke Dunia"
        activeDot={activeDot}
        onCTA={handleCTA}
        onDotChange={setActiveDot}
      />
    );
  }

  return (
    <ModuleMapPage
      {...headerProps}
      onEnterWorld={handleEnterWorld}
    />
  );
}