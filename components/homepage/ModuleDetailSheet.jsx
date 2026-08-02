'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AppIcon } from '@/components/shared/AppIcon';
import { THEME }   from '@/config/theme';

export function ModuleDetailSheet({ module, progress = 0, onStart, onClose }) {
    const isOpen = !!module;

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            <motion.div
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.55)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl px-6 pt-5 pb-10"
                style={{
                background: 'linear-gradient(180deg, #1a0f3d 0%, #0d0820 100%)',
                border: '1.5px solid rgba(255,215,0,0.18)',
                borderBottom: 'none',
                boxShadow: '0 -12px 48px rgba(0,0,0,0.7)',
                maxWidth: 480,
                left: '50%',
                transform: 'translateX(-50%)',
                }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
                <div className="mx-auto rounded-full mb-4" style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)' }} />

                <div className="flex items-start gap-4 mb-4">
                <div
                    className="flex items-center justify-center rounded-2xl text-4xl flex-shrink-0"
                    style={{ width: 68, height: 68, background: 'rgba(255,215,0,0.1)', border: '2px solid rgba(255,215,0,0.3)' }}
                >
                    {module?.icon || '📚'}
                </div>

                <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs uppercase tracking-widest" style={{ color: THEME.colors.gold }}>
                    Modul {module?.index}
                    </span>
                    <h2
                    className="font-black leading-tight mt-0.5"
                    style={{ color: '#FFF5E0', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
                    >
                    {module?.title}
                    </h2>
                    {module?.description && (
                    <p className="text-sm mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {module.description}
                    </p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', fontSize: 18 }}
                >
                    ✕
                </button>
                </div>

                <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Progress</span>
                    <span className="text-xs font-black" style={{ color: THEME.colors.gold }}>{Math.round(progress)}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #facc15, #f59e0b)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                </div>
                </div>

                {module?.worlds && module.worlds.length > 0 && (
                <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Level dalam modul ini
                    </p>
                    <div className="flex flex-col gap-1.5">
                    {module.worlds.map((w, i) => {
                        const lvlProgress = module.levelProgress?.[w.id] || 0;
                        const isCompleted = lvlProgress >= 100;
                        const isLvlLocked = i > 0 && (module.levelProgress?.[module.worlds[i - 1].id] || 0) < 100;
                        return (
                        <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <span style={{ fontSize: 18, opacity: isLvlLocked ? 0.35 : 1 }}>{w.icon}</span>
                            <span className="flex-1 font-bold text-sm" style={{ color: isLvlLocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)' }}>
                            {w.title}
                            </span>
                            {isLvlLocked ? <span style={{ fontSize: 14 }}>🔒</span>
                            : isCompleted ? <span style={{ fontSize: 14 }}>⭐</span>
                            : lvlProgress > 0 ? <span className="text-xs font-black" style={{ color: THEME.colors.gold }}>{Math.round(lvlProgress)}%</span>
                            : null}
                        </div>
                        );
                    })}
                    </div>
                </div>
                )}

                <motion.button
                onClick={onStart}
                className="w-full flex items-center justify-center gap-3 font-black rounded-2xl"
                style={{
                    height: 60, fontSize: '1.1rem',
                    background: THEME.colors.ctaBg,
                    border: `3px solid ${THEME.colors.ctaBorder}`,
                    boxShadow: `0 6px 0 ${THEME.colors.ctaShadow}, 0 0 24px rgba(255,184,0,0.35)`,
                    color: THEME.colors.ctaText,
                    letterSpacing: '0.02em',
                }}
                whileTap={{ scale: 0.96, y: 4 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                <span>{progress > 0 && progress < 100 ? 'Lanjutkan' : progress >= 100 ? 'Main Lagi' : 'Mulai'}</span>
                <AppIcon name="ctaArrow" size={24} color={THEME.colors.ctaText} strokeWidth={3} />
                </motion.button>
            </motion.div>
            </>
        )}
        </AnimatePresence>
    );
}