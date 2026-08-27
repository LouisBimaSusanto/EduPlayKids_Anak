'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
    useAudio,
    useTTS,
} from '@/hooks/useAudio';

import { levelLog } from '@/lib/levelLogger';



const USE_DEV_GAME_FALLBACK =
    process.env.NEXT_PUBLIC_DEV_GAME_FALLBACK === 'true';

export function useLevelController({
    modulId,
    levelId,
}) {
    const router = useRouter();

    const { playSound } = useAudio();
    const { speak } = useTTS();

    // ============================================================
    // DATA
    // ============================================================

    const [introVideoUrl, setIntroVideoUrl] =
        useState(null);

    const [games, setGames] =
        useState([]);

    // ============================================================
    // LEVEL STATE
    // ============================================================

    const [phase, setPhase] =
        useState('loading');

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [progress, setProgress] =
        useState(0);

    const [totalScore, setTotalScore] =
        useState(0);

    // ============================================================
    // FETCH LEVEL
    // ============================================================

    useEffect(() => {
        let cancelled = false;

        const fetchLevel = async () => {
            levelLog('FETCH_START', {
                modulId,
                levelId,
            });

            try {
                const url =
                    `/api/modul/${modulId}/level/${levelId}`;

                console.log(
                    '[LEVEL API URL]',
                    url
                );

                const response =
                    await fetch(url, {
                        cache: 'no-store',
                    });

                if (!response.ok) {
                    throw new Error(
                        `HTTP error! status: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                console.log(
                    '[LEVEL API DATA]',
                    data
                );

                if (cancelled) {
                    return;
                }

                const activeGames =
                    (data.games || []).filter(
                        (game) => game.is_active
                    );

                setGames(activeGames);

                setCurrentIndex(0);
                setProgress(0);
                setTotalScore(0);

                if (data.intro_video_url) {
                    setIntroVideoUrl(
                        data.intro_video_url
                    );

                    setPhase('intro');

                    levelLog(
                        'INTRO_READY',
                        {
                            video:
                                data.intro_video_url,
                            games:
                                activeGames.length,
                        }
                    );
                } else {
                    setIntroVideoUrl(null);

                    setPhase('game');

                    levelLog(
                        'NO_INTRO',
                        {
                            games:
                                activeGames.length,
                        }
                    );
                }

                levelLog(
                    'FETCH_SUCCESS',
                    {
                        games:
                            activeGames.length,
                    }
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    '[LEVEL] FETCH_ERROR',
                    error
                );

                levelLog(
                    'FETCH_ERROR',
                    {
                        message:
                            error?.message,
                    }
                );

                // ==========================================================
                // DEVELOPMENT FALLBACK
                // ==========================================================

                if (USE_DEV_GAME_FALLBACK) {
                    console.warn(
                        '[LEVEL] Using DEV game fallback'
                    );

                    const fallbackGames = [
                        {
                            id: 'batu-loncatan',
                            type: 'batu-loncatan',
                            slug: 'batu-loncatan',
                            title: 'Batu Loncatan',
                            is_active: true,
                        },
                    ];

                    setGames(
                        fallbackGames
                    );

                    setIntroVideoUrl(null);

                    setCurrentIndex(0);
                    setProgress(0);
                    setTotalScore(0);

                    levelLog(
                        'DEV_FALLBACK_READY',
                        {
                            games:
                                fallbackGames,
                        }
                    );

                    setPhase('game');

                    return;
                }

                // ==========================================================
                // NORMAL ERROR
                // ==========================================================

                setPhase('game');
            }
        };

        fetchLevel();

        return () => {
            cancelled = true;
        };
    }, [
        modulId,
        levelId,
    ]);

    // ============================================================
    // START INTRO
    // ============================================================

    const handleStartGame =
        useCallback(() => {
            levelLog('START_GAME', {
                modulId,
                levelId,
            });

            setPhase('game');
        }, [
            modulId,
            levelId,
        ]);

    // ============================================================
    // GAME COMPLETE
    // ============================================================

    const handleGameComplete =
        useCallback(
            (result = {}) => {
                const earnedScore =
                    Number(result.score) || 0;

                const gameId =
                    result.gameId ||
                    games[currentIndex]?.id ||
                    'unknown';

                levelLog(
                    'GAME_COMPLETE',
                    {
                        gameId,
                        score: earnedScore,
                        currentIndex,
                    }
                );

                // ======================================================
                // UPDATE SCORE
                // ======================================================

                setTotalScore(
                    (previous) =>
                        previous + earnedScore
                );

                const nextIndex =
                    currentIndex + 1;

                const nextProgress =
                    games.length > 0
                        ? (nextIndex /
                            games.length) *
                        100
                        : 0;

                setProgress(
                    nextProgress
                );

                // ======================================================
                // MASIH ADA GAME
                // ======================================================

                if (
                    nextIndex <
                    games.length
                ) {
                    levelLog(
                        'NEXT_GAME',
                        {
                            nextIndex,
                            progress:
                                nextProgress,
                        }
                    );

                    setCurrentIndex(
                        nextIndex
                    );

                    return;
                }

                // ======================================================
                // SEMUA GAME SELESAI
                // ======================================================

                levelLog(
                    'LEVEL_COMPLETE',
                    {
                        totalScore:
                            totalScore +
                            earnedScore,
                    }
                );

                setPhase('complete');

                playSound('success');

                speak(
                    'Wah hebat sekali! Kamu juara!'
                );

                // ======================================================
                // SAVE PROGRESS
                // ======================================================

                const key =
                    `progress_${modulId}_${levelId}`;

                localStorage.setItem(
                    key,
                    'completed'
                );

                levelLog(
                    'PROGRESS_SAVED',
                    {
                        key,
                        totalScore:
                            totalScore +
                            earnedScore,
                    }
                );

                // ======================================================
                // RETURN HOME
                // ======================================================

                setTimeout(() => {
                    router.push('/');
                }, 3000);
            },
            [
                currentIndex,
                games,
                levelId,
                modulId,
                playSound,
                router,
                speak,
                totalScore,
            ]
        );

    // ============================================================
    // CLOSE LEVEL
    // ============================================================

    const handleLevelClose =
        useCallback(() => {
            levelLog('LEVEL_CLOSE', {
                modulId,
                levelId,
            });

            router.push('/');
        }, [
            modulId,
            levelId,
            router,
        ]);

    // ============================================================
    // CURRENT GAME
    // ============================================================

    const currentGame =
        useMemo(() => {
            return games[currentIndex] || null;
        }, [
            games,
            currentIndex,
        ]);

    // ============================================================
    // COUNTER
    // ============================================================

    const gameCounter =
        games.length > 0
            ? `${Math.min(
                currentIndex + 1,
                games.length
            )}/${games.length}`
            : '0/0';

    // ============================================================
    // RETURN CONTROLLER
    // ============================================================

    return {
        // ----------------------------------------------------------
        // DATA
        // ----------------------------------------------------------

        introVideoUrl,
        games,
        currentGame,

        // ----------------------------------------------------------
        // STATE
        // ----------------------------------------------------------

        phase,
        currentIndex,
        progress,
        totalScore,

        // ----------------------------------------------------------
        // UI DATA
        // ----------------------------------------------------------

        gameCounter,

        // ----------------------------------------------------------
        // ACTIONS
        // ----------------------------------------------------------

        handleStartGame,
        handleGameComplete,
        handleLevelClose,
    };
}