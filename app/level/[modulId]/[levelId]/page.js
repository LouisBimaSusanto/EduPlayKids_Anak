'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio, useTTS } from '@/hooks/useAudio';

const GAME_REPO_URL = process.env.NEXT_PUBLIC_GAME_REPO_URL || 'http://localhost:3002';

export default function LevelPage({ params }) {
  const router = useRouter();
  const { playSound } = useAudio();
  const { speak } = useTTS();
  const { modulId, levelId } = use(params);

  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    fetch(`${GAME_REPO_URL}/api/modul/${modulId}/level/${levelId}`)
      .then(res => res.json())
      .then(data => setGames((data.games || []).filter(g => g.is_active)))
      .catch(err => console.error('Gagal fetch games:', err));
  }, [modulId, levelId]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'GAME_COMPLETE') {
        const nextIndex = currentIndex + 1;
        setProgress((nextIndex / games.length) * 100);
        if (nextIndex < games.length) {
          setCurrentIndex(nextIndex);
        } else {
          setIsComplete(true);
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

  const currentGame = games[currentIndex];

  if (isComplete) return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 to-purple-600 flex flex-col items-center justify-center">
      <span className="text-[10rem] animate-bounce">🎉</span>
      <h1 className="text-6xl font-black text-white mt-8">Level Selesai!</h1>
    </div>
  );

  return (
    <main className="fixed inset-0 h-[100dvh] w-[100dvw] bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col overflow-hidden">
      <header className="p-2 md:p-4 flex items-center gap-4 z-10 shrink-0">
        <button onClick={() => router.push('/')}
          className="shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-red-500 border-2 md:border-4 border-white border-b-4 md:border-b-8 border-b-red-700 flex items-center justify-center text-white font-black text-xl md:text-3xl active:border-b-2 active:md:border-b-4 active:translate-y-1 transition-all">
          ✕
        </button>
        <div className="flex-1 h-10 bg-white/50 rounded-full border-4 border-white overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }} />
        </div>
        <span className="text-white font-black text-xl">{currentIndex + 1}/{games.length}</span>
      </header>

      {games.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-3xl animate-pulse">Memuat game...</p>
        </div>
      )}

      {currentGame && (
        <iframe
          key={`${currentGame.id}-${currentIndex}`}
          src={`${GAME_REPO_URL}${currentGame.path}`}
          className="flex-1 w-full border-0"
          allow="autoplay; fullscreen"
          title={currentGame.title}
        />
      )}
    </main>
  );
}
