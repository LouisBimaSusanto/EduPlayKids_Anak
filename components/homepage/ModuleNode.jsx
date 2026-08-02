'use client';

import { motion } from 'framer-motion';

function IslandSVG({ color = '#4ade80', locked = false, active = false }) {
    const baseColor  = locked ? '#4a3f6b' : color;
    const grassColor = locked ? '#3d2f5e' : (active ? '#22c55e' : '#16a34a');
    const shadowColor = locked ? '#2d1f4a' : '#14532d';

    return (
        <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="48" cy="66" rx="38" ry="8" fill="rgba(0,0,0,0.35)" />
        <ellipse cx="48" cy="52" rx="38" ry="18" fill={shadowColor} />
        <ellipse cx="48" cy="44" rx="38" ry="16" fill={baseColor} />
        <ellipse cx="48" cy="38" rx="34" ry="13" fill={grassColor} />
        <ellipse cx="34" cy="33" rx="10" ry="5" fill="rgba(255,255,255,0.18)" transform="rotate(-15 34 33)" />
        {!locked && (
            <>
            <ellipse cx="22" cy="30" rx="8" ry="10" fill="#15803d" />
            <rect x="20" y="38" width="4" height="7" rx="2" fill="#92400e" />
            <ellipse cx="72" cy="32" rx="7" ry="9" fill="#15803d" />
            <rect x="70" y="39" width="4" height="6" rx="2" fill="#92400e" />
            </>
        )}
        {locked && (
            <>
            <ellipse cx="24" cy="36" rx="6" ry="4" fill="#2d1f4a" />
            <ellipse cx="70" cy="35" rx="5" ry="3.5" fill="#2d1f4a" />
            </>
        )}
        </svg>
    );
}

function LockBadge() {
    return (
        <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
            width: 32, height: 32,
            background: 'rgba(15,10,40,0.9)',
            border: '2.5px solid rgba(255,215,0,0.3)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -70%)',
            zIndex: 4,
        }}
        >
        <span style={{ fontSize: 16 }}>🔒</span>
        </div>
    );
}

export function ModuleNode({
    index       = 1,
    title       = '',
    icon        = '🏝️',
    progress    = 0,
    isLocked    = false,
    isActive    = false,
    isCompleted = false,
    onClick,
}) {
    const isPlayable = !isLocked;

    const ringColor = isCompleted
        ? '#facc15'
        : isActive
        ? '#4ade80'
        : isLocked
        ? 'rgba(255,215,0,0.2)'
        : 'rgba(255,215,0,0.45)';

    const numberBg = isCompleted
        ? 'linear-gradient(135deg, #facc15, #d97706)'
        : isActive
        ? 'linear-gradient(135deg, #4ade80, #16a34a)'
        : isLocked
        ? 'linear-gradient(135deg, #3d3060, #2d1f4a)'
        : 'linear-gradient(135deg, #6d4c41, #4e342e)';

    return (
        <motion.div
        className="flex flex-col items-center relative"
        style={{ cursor: isPlayable ? 'pointer' : 'default', userSelect: 'none' }}
        onClick={isPlayable ? onClick : undefined}
        whileTap={isPlayable ? { scale: 0.93 } : {}}
        animate={isActive ? { y: [0, -6, 0] } : {}}
        transition={isActive ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
        >
        <div className="relative">
            <IslandSVG color={isCompleted ? '#854d0e' : '#4e342e'} locked={isLocked} active={isActive} />

            {isLocked && <LockBadge />}

            <motion.div
            className="absolute flex items-center justify-center rounded-full font-black"
            style={{
                width: 52, height: 52,
                background: numberBg,
                border: `4px solid ${ringColor}`,
                boxShadow: `0 6px 0 rgba(0,0,0,0.45), 0 0 18px ${isActive ? 'rgba(74,222,128,0.55)' : 'rgba(0,0,0,0.3)'}`,
                top: -28, left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                fontSize: 22,
                color: isLocked ? 'rgba(255,255,255,0.4)' : '#FFF5E0',
            }}
            animate={isActive ? { scale: [1, 1.08, 1] } : {}}
            transition={isActive ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
            {isCompleted ? '⭐' : index}
            </motion.div>

            {!isLocked && (
            <div className="absolute text-xl" style={{ bottom: 18, right: 8, zIndex: 3 }}>
                {icon}
            </div>
            )}
        </div>

        {isPlayable && progress > 0 && progress < 100 && (
            <div
            className="rounded-full overflow-hidden"
            style={{ width: 64, height: 6, background: 'rgba(255,255,255,0.15)', marginTop: 4 }}
            >
            <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #facc15, #f59e0b)', transition: 'width 0.6s ease' }}
            />
            </div>
        )}

        {isPlayable && progress > 0 && (
            <span className="font-black text-[11px] mt-1" style={{ color: isCompleted ? '#facc15' : 'rgba(255,215,0,0.75)' }}>
            {Math.round(progress)}%
            </span>
        )}

        <div
            className="mt-1 text-center font-black text-[11px] leading-tight max-w-[80px]"
            style={{ color: isLocked ? 'rgba(255,255,255,0.3)' : isActive ? '#4ade80' : 'rgba(255,255,255,0.75)' }}
        >
            {title}
        </div>
        </motion.div>
    );
}