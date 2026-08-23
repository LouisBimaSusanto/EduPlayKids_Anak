'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio, useTTS } from '@/hooks/useAudio';

const GAME_REPO_URL = process.env.NEXT_PUBLIC_GAME_REPO_URL || 'http://localhost:3002';

export default function LevelPage({ params }) {
  const router = useRouter();
  const { playSound } = useAudio();
  const { speak } = useTTS();
  const { modulId, levelId } = use(params);

  const iframeRef = useRef(null);

  // Data dari API
  const [introVideoUrl, setIntroVideoUrl] = useState(null);
  const [games, setGames] = useState([]);

  // State machine: 'loading' → 'intro' → 'game' → 'complete'
  const [phase, setPhase] = useState('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Fetch level data: intro_video_url + games (sudah tanpa entry intro)
  useEffect(() => {
    fetch(`${GAME_REPO_URL}/api/modul/${modulId}/level/${levelId}`)
      .then(res => res.json())
      .then(data => {
        const activeGames = (data.games || []).filter(g => g.is_active);
        setGames(activeGames);
        if (data.intro_video_url) {
          setIntroVideoUrl(data.intro_video_url);
          setPhase('intro');
        } else {
          setPhase('game');
        }
      })
      .catch(err => {
        console.error('Gagal fetch level data:', err);
        setPhase('game');
      });
  }, [modulId, levelId]);

  // Listener postMessage dari game iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'GAME_COMPLETE') {
        const nextIndex = currentIndex + 1;
        setProgress((nextIndex / games.length) * 100);
        if (nextIndex < games.length) {
          setCurrentIndex(nextIndex);
        } else {
          setPhase('complete');
          playSound('success');
          speak('Wah hebat sekali! Kamu juara!');
          const key = `progress_${modulId}_${levelId}`;
          localStorage.setItem(key, 'completed');
          setTimeout(() => router.push('/'), 3000);
        }
      }
      if (event.data?.type === 'GAME_CLOSE') {
        router.push('/');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentIndex, games, modulId, levelId, router, playSound, speak]);

  // Tombol MULAI MAIN: transisi intro → game
  const handleStartGame = () => {
    setPhase('game');
  };

  const currentGame = games[currentIndex];

  // ─── SCREEN: COMPLETE ──────────────────────────────────────────
  if (phase === 'complete') return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 to-purple-600 flex flex-col items-center justify-center">
      <span className="text-[10rem] animate-bounce">🎉</span>
      <h1 className="text-6xl font-black text-white mt-8">Level Selesai!</h1>
    </div>
  );

  return (
    <main className="fixed inset-0 h-[100dvh] w-[100dvw] flex flex-col overflow-hidden bg-gradient-to-b from-[#2a2d7c] via-[#4b3fa0] to-[#6a4fc0]">

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className="bg-[#4285F4] px-3 py-2 md:px-5 md:py-3 flex items-center gap-4 z-50 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => router.push('/')}
          className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#EA4335] border-[3px] border-white shadow-[0_4px_0_#b31404] flex items-center justify-center text-white font-black text-lg md:text-2xl active:shadow-[0_0px_0_#b31404] active:translate-y-1 transition-all"
        >
          ✕
        </button>
        <div className="flex-1 h-5 md:h-7 rounded-full border-2 border-white overflow-hidden p-[2px]">
          <div
            className="h-full bg-[#34A853] rounded-full transition-all duration-700"
            style={{ width: `${phase === 'intro' ? 0 : progress}%` }}
          />
        </div>
        <span className="text-white font-bold text-lg md:text-2xl ml-1 drop-shadow-md">
          {phase === 'intro' ? `0/${games.length}` : `${currentIndex + 1}/${games.length}`}
        </span>
      </header>

      {/* ── CONTENT AREA ──────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col items-center justify-center gap-4 px-4 py-4 overflow-hidden">

        {/* ── PHASE: LOADING ── */}
        {phase === 'loading' && (
          <p className="text-white text-2xl animate-pulse">Memuat level...</p>
        )}

        {/* ── PHASE: INTRO — hanya video dalam kotak kuning ── */}
        {phase === 'intro' && (
          <>
            {/* Kotak kuning: HANYA video, tidak ada konten lain */}
            <div
              className="relative w-full max-w-4xl rounded-3xl border-[5px] border-[#FABB05] shadow-[0_0_40px_rgba(250,187,5,0.5),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden bg-black"
              style={{ flex: '1 1 0', minHeight: 0 }}
            >
              <iframe
                src={introVideoUrl}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Video Pembuka"
              />
            </div>

            {/* Tombol MULAI MAIN — di luar kotak kuning */}
            <div className="shrink-0 pb-1">
              <button
                onClick={handleStartGame}
                className="bg-[#2ecc71] hover:bg-[#27ae60] text-[#0a4d2e] font-black text-2xl md:text-4xl tracking-wider py-3 px-10 md:py-4 md:px-16 rounded-2xl md:rounded-3xl border-[3px] md:border-4 border-white shadow-[0_6px_0_#1e8449,0_10px_20px_rgba(0,0,0,0.4)] active:shadow-none active:translate-y-[6px] transition-all flex flex-col items-center cursor-pointer select-none"
              >
                <span className="leading-tight">MULAI</span>
                <span className="leading-tight">MAIN 🚀</span>
              </button>
            </div>
          </>
        )}

        {/* ── PHASE: GAME — iframe penuh, tanpa frame/border ── */}
        {phase === 'game' && (
          <>
            {games.length === 0 ? (
              <p className="text-white text-2xl animate-pulse">Memuat game...</p>
            ) : currentGame ? (
              <iframe
                ref={iframeRef}
                key={`${currentGame.id}-${currentIndex}`}
                src={`${GAME_REPO_URL}${currentGame.path}`}
                className="absolute inset-0 w-full h-full border-0 block"
                allow="autoplay; fullscreen"
                title={currentGame.title}
              />
            ) : null}
          </>
        )}

        {/* Sound Toggle — selalu tampil di kanan bawah */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-30">
          <button className="w-11 h-11 md:w-14 md:h-14 bg-[#1a1c5b]/80 hover:bg-[#2a2d7c] rounded-full border-2 border-white/30 flex items-center justify-center text-white text-xl md:text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
            🔊
          </button>
        </div>

      </div>
    </main>
  );
}