'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '@/config/theme';

/* ══════════════════════════════════════════════════════════
    KONSTANTA LAYOUT
   ══════════════════════════════════════════════════════════ */
const ISLAND_W     = 320;   // lebar node pulau (ukuran sedang)
const ISLAND_H     = 220;   // tinggi node pulau
const NODE_SPACING = 360;   // jarak horizontal antar node
const BOARD_W      = 250;   // lebar papan bab
const TRAIN_W      = 120;   // lebar kereta
const ZIGZAG_AMP   = 115;   // amplitude zigzag
const CANVAS_H     = 620;   // tinggi total canvas (ditambah agar bagian atas tidak terpotong)
const NODE_RAISE   = 140;   // seberapa jauh node diangkat di atas titik rel

const CENTER_Y     = CANVAS_H / 2; // Y tengah canvas

/* ── Hitung koordinat pusat tiap node (zigzag) ─────────────── */
function calcNodePoints(count, startX) {
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * NODE_SPACING,
    y: i % 2 === 0 ? CENTER_Y - ZIGZAG_AMP : CENTER_Y + ZIGZAG_AMP,
  }));
}

/* ── Buat path SVG smooth bezier ───────────────────────────── */
function buildZigzagPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/* ── Pulau SVG (identik dengan ModuleMapPage) ──────────────── */
function IslandSVG({ locked = false, active = false, completed = false }) {
  const grassTop  = locked ? '#3b2d6e' : completed ? '#15803d' : active ? '#22c55e' : '#16a34a';
  const grassShad = locked ? '#2d1f55' : '#14532d';
  const dirtTop   = locked ? '#4a3580' : '#5c3d1e';
  const dirtBot   = locked ? '#2d1f55' : '#3d2510';

  return (
    <svg width={ISLAND_W} height={180} viewBox="0 0 110 80" fill="none">
      <ellipse cx="55" cy="75" rx="40" ry="7"  fill="rgba(0,0,0,0.3)" />
      <ellipse cx="55" cy="62" rx="40" ry="18" fill={dirtBot} />
      <ellipse cx="55" cy="54" rx="40" ry="16" fill={dirtTop} />
      <ellipse cx="55" cy="45" rx="40" ry="14" fill={grassShad} />
      <ellipse cx="55" cy="40" rx="38" ry="13" fill={grassTop} />
      <ellipse cx="40" cy="34" rx="11" ry="5"  fill="rgba(255,255,255,0.15)" transform="rotate(-15 40 34)" />
      {!locked && (
        <>
          <ellipse cx="26" cy="33" rx="9"  ry="11" fill="#15803d" />
          <ellipse cx="26" cy="27" rx="7"  ry="9"  fill="#16a34a" />
          <rect    x="23"  y="42"  width="6" height="7" rx="2" fill="#92400e" />
          <ellipse cx="82" cy="35" rx="8"  ry="10" fill="#15803d" />
          <ellipse cx="82" cy="29" rx="6"  ry="8"  fill="#16a34a" />
          <rect    x="79"  y="43"  width="6" height="6" rx="2" fill="#92400e" />
          <circle  cx="50" cy="39" r="2.5" fill="#fde68a" />
          <circle  cx="60" cy="41" r="2"   fill="#fde68a" />
        </>
      )}
      {locked && (
        <>
          <ellipse cx="30" cy="39" rx="8" ry="5"   fill="#2d1f55" />
          <ellipse cx="75" cy="40" rx="7" ry="4.5" fill="#2d1f55" />
        </>
      )}
    </svg>
  );
}

/* ── Node Level (pulau + badge + bintang + judul) ───────────── */
function LevelNode({ cx, cy, number, title, stars = 0, maxStars = 3, isLocked, isActive, isCompleted, onClick }) {
  const ringColor = isCompleted ? '#facc15'
    : isActive    ? '#4ade80'
    : isLocked    ? 'rgba(255,255,255,0.15)'
    :               'rgba(255,215,0,0.5)';

  const numBg = isCompleted ? 'linear-gradient(135deg,#facc15,#d97706)'
    : isActive    ? 'linear-gradient(135deg,#4ade80,#16a34a)'
    : isLocked    ? 'linear-gradient(135deg,#3d2d6e,#2d1f4a)'
    :               'linear-gradient(135deg,#7c5c3e,#5c3d1e)';

  // Node diangkat ke atas dari titik rel (cy)
  const left = cx - ISLAND_W / 2;
  const top  = cy - NODE_RAISE; // angkat node jauh di atas rel

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left, top, width: ISLAND_W, cursor: isLocked ? 'default' : 'pointer', zIndex: 10 }}
      onClick={!isLocked ? onClick : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      animate={isActive ? { y: [0, -10, 0] } : {}}
      transition={isActive ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      {/* Pulau */}
      <div className="relative flex items-center justify-center">
        <IslandSVG locked={isLocked} active={isActive} completed={isCompleted} />

        {/* Badge nomor level — ukuran sedang */}
        <motion.div
          className="absolute flex items-center justify-center rounded-full font-black"
          style={{
            width: 96, height: 96,
            top: -34, left: '50%', transform: 'translateX(-50%)',
            background: numBg,
            border: `8px solid ${ringColor}`,
            boxShadow: `0 9px 0 rgba(0,0,0,0.55), 0 0 30px ${isActive ? 'rgba(74,222,128,0.7)' : 'rgba(0,0,0,0.35)'}`,
            fontSize: 26,
            color: isLocked ? 'rgba(255,255,255,0.35)' : '#fff',
            zIndex: 20,
          }}
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={isActive ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
        >
          {isCompleted ? '⭐' : isLocked ? '🔒' : number}
        </motion.div>
      </div>

      {/* Bintang */}
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: maxStars }).map((_, i) => (
          <span key={i} style={{ fontSize: 22, opacity: i < stars ? 1 : 0.25 }}>⭐</span>
        ))}
      </div>

      {/* Judul level */}
      <div
        className="text-center font-bold leading-tight px-3 py-1.5 rounded-full mt-2"
        style={{
          fontSize: 16,
          color: isLocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          maxWidth: 220,
        }}
      >
        {title}
      </div>
    </motion.div>
  );
}

/* ── Papan Bab ──────────────────────────────────────────────── */
function ChapterBoard({ cx, cy, moduleIndex, title, description }) {
  const left = cx - BOARD_W / 2;
  const top  = cy - 90;

  return (
    <div className="absolute" style={{ left, top, width: BOARD_W, zIndex: 10 }}>
      {/* Label Bab */}
      <div
        className="absolute left-1/2 font-black text-sm px-5 py-1 rounded-full text-white z-20"
        style={{
          transform: 'translateX(-50%)',
          top: -20,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          border: '2px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        Bab {moduleIndex}
      </div>

      {/* Papan kayu */}
      <div
        className="relative px-5 py-6 rounded-2xl"
        style={{
          background: 'linear-gradient(160deg,#8b5e25 0%,#5c3d0e 60%,#3b2508 100%)',
          border: '3px solid #c8861a',
          boxShadow: '0 8px 0 #3b1f00, 0 12px 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* Sekrup pojok */}
        {[[8,8],[8,'auto'],[,'auto'],['auto',8],['auto','auto']].map((_, i) => (
          <div key={i} className="absolute w-3 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle,#f0c060,#a06010)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.8)',
              top:    i < 2 ? 8 : 'auto', bottom: i >= 2 ? 8 : 'auto',
              left:   i % 2 === 0 ? 8 : 'auto', right: i % 2 === 1 ? 8 : 'auto',
            }}
          />
        ))}

        <h2
          className="font-black text-center leading-tight"
          style={{ color: '#fff5e0', fontSize: 'clamp(0.95rem,1.8vw,1.25rem)', textShadow: '0 3px 8px rgba(0,0,0,0.8)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-center text-xs leading-snug mt-2" style={{ color: 'rgba(255,220,140,0.8)' }}>
            {description}
          </p>
        )}

        <div className="absolute -bottom-4 left-3 text-xl">🌿</div>
        <div className="absolute -bottom-4 right-3 text-xl">🌿</div>
      </div>
    </div>
  );
}

/* ── Kereta dekorasi ────────────────────────────────────────── */
function TrainDecor({ cx, cy }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: cx - 44, top: cy - 50, zIndex: 10 }}
      animate={{ x: [-4, 4, -4], y: [0, -4, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Asap */}
      <motion.div className="absolute rounded-full"
        style={{ width: 14, height: 14, top: -18, left: 14, background: 'rgba(255,255,255,0.25)', filter: 'blur(3px)' }}
        animate={{ y: [0, -14, 0], opacity: [0.4, 0.9, 0.4], scale: [0.8, 1.5, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 10, height: 10, top: -10, left: 36, background: 'rgba(255,255,255,0.2)', filter: 'blur(2px)' }}
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3], scale: [0.7, 1.2, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      <div style={{ fontSize: 76, lineHeight: 1, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))' }}>🚂</div>
    </motion.div>
  );
}

/* ── Boss Node ──────────────────────────────────────────────── */
function BossNode({ cx, cy }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-2"
      style={{ left: cx - 46, top: cy - 46, zIndex: 10 }}
      animate={{ scale: [1, 1.07, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="flex items-center justify-center rounded-full font-black"
        style={{
          width: 72, height: 72,
          background: 'linear-gradient(135deg,#ef4444,#991b1b)',
          border: '5px solid #fca5a5',
          boxShadow: '0 8px 0 rgba(0,0,0,0.55), 0 0 30px rgba(239,68,68,0.7)',
          fontSize: 32,
        }}
      >
        🏆
      </div>
      <span className="font-black text-xs" style={{ color: '#fca5a5', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Boss</span>
    </motion.div>
  );
}

/* ── Zigzag Rail SVG ────────────────────────────────────────── */
function ZigzagRail({ points, totalW }) {
  if (points.length < 2) return null;
  const d = buildZigzagPath(points);
  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 2 }}
      width={totalW} height={CANVAS_H}
      viewBox={`0 0 ${totalW} ${CANVAS_H}`}
    >
      {/* Shadow */}
      <path d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={42} strokeLinecap="round" />
      {/* Bantalan kayu */}
      <path d={d} fill="none" stroke="#5c3010" strokeWidth={44} strokeDasharray="20 24" strokeLinecap="round" />
      {/* Rel kiri */}
      <path d={d} fill="none" stroke="#e6b94a" strokeWidth={8} strokeLinecap="round"
        style={{ transform: 'translateY(-13px)', transformBox: 'fill-box' }} />
      {/* Rel kanan */}
      <path d={d} fill="none" stroke="#c8921a" strokeWidth={8} strokeLinecap="round"
        style={{ transform: 'translateY(13px)', transformBox: 'fill-box' }} />
      {/* Kilap tengah */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={3}
        strokeLinecap="round" strokeDasharray="14 18" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export function WorldBoardCTA({
  moduleIndex = 1,
  moduleTitle = 'Membaca',
  moduleDesc  = '',
  worlds      = [],
  progressMap = {},
  modulId     = '',
  onCTA,
  // Legacy props (diabaikan)
  ctaLabel, activeDot, onDotChange,
}) {
  const scrollRef  = useRef(null);
  const isDragging = useRef(false);
  const dragStart  = useRef({ x: 0, scrollLeft: 0 });

  /* Drag-to-scroll */
  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current  = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft };
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  /* Hitung state tiap level */
  const levelsWithState = worlds.map((w, i) => {
    const done     = progressMap[`progress_${modulId}_${w.id}`] === 'completed';
    const prevDone = i === 0 ? true : progressMap[`progress_${modulId}_${worlds[i - 1].id}`] === 'completed';
    return { ...w, isCompleted: done, isActive: !done && prevDone, isLocked: !done && !prevDone, stars: done ? 3 : 0 };
  });

  /* Koordinat */
  // Urutan elemen: [board] → [train] → [level 0] → [level 1] → ... → [boss]
  // Board di kiri, train tepat setelah board, level mulai setelahnya
  const BOARD_CX  = 180;
  const TRAIN_CX  = BOARD_CX + BOARD_W / 2 + TRAIN_W / 2 + 40;
  const LEVELS_START_X = TRAIN_CX + TRAIN_W / 2 + NODE_SPACING / 2;

  const levelPoints = calcNodePoints(levelsWithState.length, LEVELS_START_X);
  const bossPoint   = {
    x: LEVELS_START_X + levelsWithState.length * NODE_SPACING,
    y: levelsWithState.length % 2 === 0 ? CENTER_Y - ZIGZAG_AMP : CENTER_Y + ZIGZAG_AMP,
  };

  // Semua titik untuk rel: mulai dari papan, lalu train, lalu semua level, lalu boss
  const boardPoint = { x: BOARD_CX, y: CENTER_Y };
  const trainPoint = { x: TRAIN_CX, y: CENTER_Y };
  const allRailPoints = [boardPoint, trainPoint, ...levelPoints, bossPoint];

  const totalW = bossPoint.x + 160;

  return (
    <div className="relative w-full" style={{ height: CANVAS_H }}>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto overflow-y-hidden"
        style={{ height: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Canvas absolut */}
        <div className="relative" style={{ width: totalW, height: CANVAS_H }}>
          {/* Rel zigzag */}
          <ZigzagRail points={allRailPoints} totalW={totalW} />

          {/* Papan Bab */}
          <ChapterBoard
            cx={BOARD_CX} cy={CENTER_Y}
            moduleIndex={moduleIndex}
            title={moduleTitle}
            description={moduleDesc}
          />

          {/* Kereta */}
          <TrainDecor cx={TRAIN_CX} cy={CENTER_Y} />

          {/* Node Level */}
          {levelsWithState.map((world, i) => (
            <LevelNode
              key={world.id || i}
              cx={levelPoints[i].x}
              cy={levelPoints[i].y}
              number={`${moduleIndex}-${i + 1}`}
              title={world.title}
              stars={world.stars}
              isLocked={world.isLocked}
              isActive={world.isActive}
              isCompleted={world.isCompleted}
              onClick={() => onCTA?.(world.id || world.levelId)}
            />
          ))}

          {/* Boss */}
          <BossNode cx={bossPoint.x} cy={bossPoint.y} />
        </div>
      </div>
    </div>
  );
}