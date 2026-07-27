'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundScene }   from './BackgroundScene';
import { HeaderBar }         from './HeaderBar';
import { BottomNavigation }  from './BottomNavigation';
import { AppIcon }           from '@/components/shared/AppIcon';
import { THEME }             from '@/config/theme';

const GAME_REPO_URL = process.env.NEXT_PUBLIC_GAME_REPO_URL || 'http://localhost:3002';

/* ── Progress helpers ─────────────────────────────────────── */
function readAllProgress() {
  if (typeof window === 'undefined') return {};
  const result = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('progress_')) result[key] = localStorage.getItem(key);
  }
  return result;
}

function calcModuleProgress(worlds, modulId, progressMap) {
  if (!worlds?.length) return { pct: 0, levelProgress: {} };
  let completed = 0;
  const levelProgress = {};
  worlds.forEach(w => {
    const done = progressMap[`progress_${modulId}_${w.id}`] === 'completed';
    if (done) completed++;
    levelProgress[w.id] = done ? 100 : 0;
  });
  return { pct: Math.round((completed / worlds.length) * 100), levelProgress };
}

/* ── Pulau SVG flat 2D ────────────────────────────────────── */
function IslandSVG({ locked = false, active = false, completed = false }) {
  const grassTop  = locked ? '#3b2d6e' : completed ? '#15803d' : active ? '#22c55e' : '#16a34a';
  const grassShad = locked ? '#2d1f55' : '#14532d';
  const dirtTop   = locked ? '#4a3580' : '#5c3d1e';
  const dirtBot   = locked ? '#2d1f55' : '#3d2510';

  return (
    <svg width="220" height="160" viewBox="0 0 110 80" fill="none">
      <ellipse cx="55" cy="75" rx="40" ry="7" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="55" cy="62" rx="40" ry="18" fill={dirtBot} />
      <ellipse cx="55" cy="54" rx="40" ry="16" fill={dirtTop} />
      <ellipse cx="55" cy="45" rx="40" ry="14" fill={grassShad} />
      <ellipse cx="55" cy="40" rx="38" ry="13" fill={grassTop} />
      <ellipse cx="40" cy="34" rx="11" ry="5" fill="rgba(255,255,255,0.15)" transform="rotate(-15 40 34)" />
      {!locked && (
        <>
          <ellipse cx="26" cy="33" rx="9" ry="11" fill="#15803d" />
          <ellipse cx="26" cy="27" rx="7" ry="9" fill="#16a34a" />
          <rect x="23" y="42" width="6" height="7" rx="2" fill="#92400e" />
          <ellipse cx="82" cy="35" rx="8" ry="10" fill="#15803d" />
          <ellipse cx="82" cy="29" rx="6" ry="8" fill="#16a34a" />
          <rect x="79" y="43" width="6" height="6" rx="2" fill="#92400e" />
          <circle cx="50" cy="39" r="2.5" fill="#fde68a" />
          <circle cx="60" cy="41" r="2" fill="#fde68a" />
        </>
      )}
      {locked && (
        <>
          <ellipse cx="30" cy="39" rx="8" ry="5" fill="#2d1f55" />
          <ellipse cx="75" cy="40" rx="7" ry="4.5" fill="#2d1f55" />
        </>
      )}
    </svg>
  );
}

/* ── Balon label untuk node aktif ────────────────────────── */
function ActiveLabel({ title }) {
  return (
    <div
      className="absolute flex items-center justify-center text-center px-4 py-3"
      style={{
        bottom: '125%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFF',
        borderRadius: '24px 24px 24px 8px',
        border: '3px solid #E5E7EB',
        boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
        minWidth: 140,
        whiteSpace: 'nowrap',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        position: 'absolute', bottom: -12, left: '15%',
        width: 16, height: 16,
        background: '#FFF',
        borderBottom: '3px solid #E5E7EB',
        borderLeft: '3px solid #E5E7EB',
        transform: 'rotate(-45deg)',
      }} />
      <span className="font-black text-lg leading-tight" style={{ color: '#1E1B4B' }}>
        {title}
      </span>
    </div>
  );
}

/* ── Satu node modul ──────────────────────────────────────── */
function ModuleNode({ index, title, icon, progress, isLocked, isActive, isCompleted, onClick }) {
  const ringColor = isCompleted ? '#facc15'
    : isActive   ? '#4ade80'
    : isLocked   ? 'rgba(255,255,255,0.15)'
    :              'rgba(255,215,0,0.5)';

  const numBg = isCompleted ? 'linear-gradient(135deg,#facc15,#d97706)'
    : isActive   ? 'linear-gradient(135deg,#4ade80,#16a34a)'
    : isLocked   ? 'linear-gradient(135deg,#3d2d6e,#2d1f4a)'
    :              'linear-gradient(135deg,#7c5c3e,#5c3d1e)';

  return (
    <motion.div
      className="flex flex-col items-center relative"
      style={{ cursor: isLocked ? 'default' : 'pointer', userSelect: 'none', width: 220 }}
      onClick={!isLocked ? onClick : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      animate={isActive ? { y: [0, -10, 0] } : {}}
      transition={isActive ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      {/* Balon label untuk node aktif */}
      {isActive && (
        <div className="relative w-full" style={{ height: 60 }}>
          <ActiveLabel title={title} />
        </div>
      )}

      <div className="relative flex items-center justify-center">
        <IslandSVG locked={isLocked} active={isActive} completed={isCompleted} />
        
        {/* Ikon besar di atas pulau (Kereta, Roket, dll) */}
        {!isLocked && (
          <div className="absolute text-[54px] z-10" style={{ top: -10, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>
            {icon}
          </div>
        )}
        {isLocked && (
          <div className="absolute text-[54px] z-10 opacity-30 grayscale" style={{ top: -10 }}>
            {icon}
          </div>
        )}

        {/* Nomor di depan pulau/ikon */}
        <motion.div
          className="absolute flex items-center justify-center rounded-full font-black z-20"
          style={{
            width: 76, height: 76,
            bottom: 5, left: -10,
            background: numBg,
            border: `6px solid ${ringColor}`,
            boxShadow: `0 8px 0 rgba(0,0,0,0.5), 0 0 24px ${isActive ? 'rgba(74,222,128,0.7)' : 'rgba(0,0,0,0.35)'}`,
            fontSize: 34,
            color: isLocked ? 'rgba(255,255,255,0.35)' : '#fff',
          }}
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={isActive ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
        >
          {isCompleted ? '⭐' : isLocked ? '🔒' : index}
        </motion.div>
      </div>

      {/* Progress % */}
      {!isLocked && progress > 0 && (
        <div className="flex flex-col items-center mt-3 gap-1 px-4 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.15)' }}>
          {progress < 100 && (
            <div className="rounded-full overflow-hidden" style={{ width: 80, height: 8, background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#facc15,#f59e0b)' }} />
            </div>
          )}
          <span className="font-black text-sm" style={{ color: isCompleted ? '#facc15' : 'rgba(255,215,0,0.9)' }}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ── Rel kereta mengikuti titik zigzag ────────────────────── */
function RailPath({ points, height }) {
  if (points.length < 2) return null;
  const totalWidth = points[points.length - 1].x + 200;

  // Smooth bezier melewati semua titik
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }}
      width={totalWidth} height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
    >
      {/* Shadow rel */}
      <path d={d} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth={32} strokeLinecap="round" />
      {/* Bantalan kayu */}
      <path d={d} fill="none" stroke="#5c3010" strokeWidth={34}
        strokeLinecap="round" strokeDasharray="18 20" />
      {/* Rel kiri */}
      <path d={d} fill="none" stroke="#e6b94a" strokeWidth={6}
        strokeLinecap="round"
        style={{ transform: 'translateY(-10px)', transformBox: 'fill-box' }}
      />
      {/* Rel kanan */}
      <path d={d} fill="none" stroke="#c8921a" strokeWidth={6}
        strokeLinecap="round"
        style={{ transform: 'translateY(10px)', transformBox: 'fill-box' }}
      />
      {/* Garis tengah putih (jalur) */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={3}
        strokeLinecap="round" strokeDasharray="12 14" />
    </svg>
  );
}

/* ── Bottom Sheet Detail Modul ────────────────────────────── */
function ModuleDetailSheet({ module, progress, onStart, onClose }) {
  return (
    <AnimatePresence>
      {module && (
        <>
          <motion.div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              className="relative w-full rounded-3xl px-6 pt-4 pb-6 pointer-events-auto"
              style={{
                background: 'linear-gradient(180deg,#1a0f3d 0%,#0d0820 100%)',
                border: '1.5px solid rgba(255,215,0,0.2)',
                boxShadow: '0 16px 64px rgba(0,0,0,0.8)',
                maxWidth: 480,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
            <div className="mx-auto rounded-full mb-4" style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)' }} />

            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center justify-center rounded-2xl text-4xl flex-shrink-0"
                style={{ width: 68, height: 68, background: 'rgba(255,215,0,0.12)', border: '2px solid rgba(255,215,0,0.3)' }}>
                {module.icon || '📚'}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: THEME.colors.gold }}>
                  Modul {module.index}
                </span>
                <h2 className="font-black leading-tight mt-0.5" style={{ color: '#FFF5E0', fontSize: 'clamp(1rem,3vw,1.35rem)' }}>
                  {module.title}
                </h2>
                {module.description && (
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{module.description}</p>
                )}
              </div>
              <button onClick={onClose}
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
                ✕
              </button>
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>Progress</span>
                <span className="text-xs font-black" style={{ color: THEME.colors.gold }}>{Math.round(progress)}%</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.1)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#facc15,#f59e0b)' }}
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }} />
              </div>
            </div>

            {module.worlds?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Level
                </p>
                <div className="flex flex-col gap-1.5">
                  {module.worlds.map((w, i) => {
                    const done   = (module.levelProgress?.[w.id] || 0) >= 100;
                    const locked = i > 0 && !((module.levelProgress?.[module.worlds[i-1].id] || 0) >= 100);
                    return (
                      <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 18, opacity: locked ? 0.3 : 1 }}>{w.icon}</span>
                        <span className="flex-1 font-bold text-sm"
                          style={{ color: locked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.82)' }}>
                          {w.title}
                        </span>
                        <span style={{ fontSize: 14 }}>{locked ? '🔒' : done ? '⭐' : null}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <motion.button onClick={onStart}
              className="w-full flex items-center justify-center gap-3 font-black rounded-2xl"
              style={{
                height: 58, fontSize: '1.1rem',
                background: THEME.colors.ctaBg,
                border: `3px solid ${THEME.colors.ctaBorder}`,
                boxShadow: `0 6px 0 ${THEME.colors.ctaShadow}`,
                color: THEME.colors.ctaText,
              }}
              whileTap={{ scale: 0.96, y: 4 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>{progress >= 100 ? 'Main Lagi' : progress > 0 ? 'Lanjutkan' : 'Mulai'}</span>
              <AppIcon name="ctaArrow" size={22} color={THEME.colors.ctaText} strokeWidth={3} />
            </motion.button>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Posisi zigzag Y tiap node (fraksi 0–1 dari tinggi area) ── */
const ZIGZAG_Y = [0.72, 0.50, 0.26, 0.50, 0.72, 0.26, 0.45];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export function ModuleMapPage({
  userName = 'Anak', userLevel = 1, levelProgress = 0, levelMax = 100,
  walletStars = 0, streakCount = 0, hasNotification = false,
  onAvatarClick, onMascotClick, onNotificationClick, onAddStars, onAddStreak,
  onEnterWorld,
}) {
  const [modules, setModules]         = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [selected, setSelected]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [mapHeight, setMapHeight]     = useState(400);

  const scrollRef    = useRef(null);
  const containerRef = useRef(null);

  const NODE_SPACING = 270;
  
  // Custom icons per module as requested
  const MODULE_ICONS = ['🚂', '🚀', '🏰', '🎪', '🛸', '🎡', '⛵', '🦁', '🦖'];

  /* ── Fetch manifest ─────────────────────────────────────── */
  useEffect(() => {
    fetch(`${GAME_REPO_URL}/api/manifest`)
      .then(r => r.json())
      .then(d => setModules(d.modules?.filter(m => m.is_active) || []))
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
  }, []);

  /* ── Progress dari localStorage ─────────────────────────── */
  useEffect(() => {
    setProgressMap(readAllProgress());
    const onFocus = () => setProgressMap(readAllProgress());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  /* ── Ukur tinggi container ──────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setMapHeight(e.contentRect.height);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* ── Hitung state modul ─────────────────────────────────── */
  const modulesWithProgress = modules.map((mod, i) => {
    const { pct, levelProgress: lvlProg } = calcModuleProgress(mod.worlds, mod.id, progressMap);
    const prevPct = i === 0 ? 100 : calcModuleProgress(modules[i-1].worlds, modules[i-1].id, progressMap).pct;
    return {
      ...mod,
      progress:      pct,
      levelProgress: lvlProg,
      isLocked:      i > 0 && prevPct < 100,
      isActive:      prevPct >= 100 && pct < 100,
      isCompleted:   pct >= 100,
      index:         i + 1,
      icon:          MODULE_ICONS[i % MODULE_ICONS.length],
      title:         mod.title.replace(/Modul \d+ - /, ''),
    };
  });

  const activeIndex = modulesWithProgress.findIndex(m => m.isActive);
  const allDone     = modulesWithProgress.length > 0 && modulesWithProgress.every(m => m.isCompleted);
  const MAP_WIDTH   = Math.max(modules.length * NODE_SPACING + 400, typeof window !== 'undefined' ? window.innerWidth : 1000);

  /* ── Titik koordinat tiap node ──────────────────────────── */
  const nodePoints = modulesWithProgress.map((_, i) => ({
    x: 150 + i * NODE_SPACING,
    y: mapHeight * ZIGZAG_Y[i % ZIGZAG_Y.length],
  }));

  const chestPoint = {
    x: 150 + modules.length * NODE_SPACING,
    y: mapHeight * ZIGZAG_Y[modules.length % ZIGZAG_Y.length],
  };

  /* ── Scroll ke node aktif ───────────────────────────────── */
    useEffect(() => {
        if (!scrollRef.current || activeIndex < 0) return;
        scrollRef.current.scrollTo({ left: Math.max(0, activeIndex * NODE_SPACING - 100), behavior: 'smooth' });
    }, [activeIndex, modules.length]);

    const handleStart = useCallback(() => {
        if (!selected) return;
        setSelected(null);
        onEnterWorld?.(selected);
    }, [selected, onEnterWorld]);

    return (
        <main className="relative w-full overflow-hidden" style={{ height: '100dvh', minHeight: '100vh' }}>
        <BackgroundScene />

        <HeaderBar
            userName={userName} userLevel={userLevel} levelProgress={levelProgress}
            levelMax={levelMax} walletStars={walletStars} streakCount={streakCount}
            hasNotification={hasNotification} onAvatarClick={onAvatarClick}
            onMascotClick={onMascotClick} onNotificationClick={onNotificationClick}
            onAddStars={onAddStars} onAddStreak={onAddStreak}
        />

        <div className="relative z-10 flex flex-col" style={{ height: '100%', paddingTop: 76, paddingBottom: 88 }}>

            {/* Loading spinner */}
            {loading && (
            <div className="flex-1 flex items-center justify-center">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: 48 }}>🚂</motion.span>
            </div>
            )}

            {/* Peta scroll horizontal */}
            {!loading && (
            <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto overflow-y-hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
                <div
                ref={containerRef}
                className="relative h-full"
                style={{ width: MAP_WIDTH, minWidth: '100%' }}
                >
                {/* Rel kereta */}
                {nodePoints.length >= 2 && (
                    <RailPath points={[...nodePoints, chestPoint]} height={mapHeight} />
                )}

                {/* Node modul */}
                {modulesWithProgress.map((mod, i) => {
                    const pt = nodePoints[i];
                    if (!pt) return null;
                    return (
                    <div key={mod.id} className="absolute" style={{ left: pt.x - 110, top: pt.y - 80, zIndex: 10 }}>
                        <ModuleNode
                        index={mod.index}
                        title={mod.title}
                        icon={mod.icon}
                        progress={mod.progress}
                        isLocked={mod.isLocked}
                        isActive={mod.isActive}
                        isCompleted={mod.isCompleted}
                        onClick={() => setSelected(mod)}
                        />
                    </div>
                    );
                })}

                {/* Chest di ujung */}
                <motion.div
                    className="absolute flex flex-col items-center gap-1 z-10"
                    style={{ left: chestPoint.x - 32, top: chestPoint.y - 48 }}
                    animate={allDone ? { scale: [1, 1.12, 1] } : { opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div style={{ fontSize: 52, filter: allDone ? 'none' : 'grayscale(0.6)' }}>🎁</div>
                    <span className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: allDone ? THEME.colors.gold : 'rgba(255,255,255,0.25)' }}>
                    Hadiah
                    </span>
                </motion.div>
                </div>
            </div>
            )}

            {/* Bottom bar */}
            {!loading && (
            <div className="flex items-center justify-between px-8 py-4 flex-shrink-0 bg-transparent absolute bottom-0 left-0 right-0 z-40 pb-8">
                <button
                className="flex items-center gap-2 rounded-full px-5 py-3 font-black text-sm transition-transform active:scale-95"
                style={{ background: 'rgba(25,12,4,0.8)', border: '2px solid rgba(255,215,0,0.4)', color: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                >
                📖 Daftar Modul
                </button>

                <div className="flex items-center gap-3 bg-[rgba(25,12,4,0.6)] px-4 py-2.5 rounded-full border border-[rgba(255,215,0,0.2)]">
                {modulesWithProgress.map((_, i) => (
                    <div key={i} className="rounded-full transition-all duration-300"
                    style={{
                        width:      i === activeIndex ? 24 : 10,
                        height:     10,
                        background: i <= activeIndex ? THEME.colors.gold : 'rgba(255,215,0,0.25)',
                    }}
                    />
                ))}
                </div>

                <div className="flex items-center gap-2 rounded-full px-5 py-3"
                style={{ background: 'rgba(25,12,4,0.8)', border: '2px solid rgba(255,215,0,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                <span style={{ fontSize: 22 }}>⭐</span>
                <span className="font-black text-base" style={{ color: THEME.colors.gold }}>
                    {walletStars}/{modules.reduce((acc, m) => acc + (m.worlds?.length || 0), 0) * 3}
                </span>
                <span style={{ fontSize: 20, marginLeft: 8 }}>🎁</span>
                </div>
            </div>
            )}
        </div>

        {/* Removed BottomNavigation as requested by mockup design */}

        <ModuleDetailSheet
            module={selected}
            progress={selected?.progress || 0}
            onStart={handleStart}
            onClose={() => setSelected(null)}
        />
        </main>
    );
}