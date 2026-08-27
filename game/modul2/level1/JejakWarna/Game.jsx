'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['🔴', '🟡', '🟢', '🔵', '🟣'];

export default function Game({ game, onComplete, onClose }) {
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [phase, setPhase] = useState('show');
  const [round, setRound] = useState(1);
  const [showing, setShowing] = useState(0);

  const MAX_ROUNDS = 3;
  const SEQUENCE_LENGTH = round + 2;

  useEffect(() => {
    const newSeq = Array.from({ length: SEQUENCE_LENGTH }, () =>
      COLORS[Math.floor(Math.random() * COLORS.length)]
    );
    setSequence(newSeq);
    setPlayerInput([]);
    setPhase('show');
    setShowing(0);
  }, [round]);

  useEffect(() => {
    if (phase !== 'show') return;
    if (showing >= sequence.length) {
      setTimeout(() => setPhase('input'), 800);
      return;
    }
    const t = setTimeout(() => setShowing(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [phase, showing, sequence.length]);

  const handleColorTap = (color) => {
    if (phase !== 'input') return;
    const newInput = [...playerInput, color];
    setPlayerInput(newInput);
    if (newInput.length === sequence.length) {
      const correct = newInput.every((c, i) => c === sequence[i]);
      setPhase('result');
      setTimeout(() => {
        if (correct) {
          if (round >= MAX_ROUNDS) { onComplete({ completed: true, score: 100 }); }
          else { setRound(r => r + 1); }
        } else {
          setPhase('show');
          setShowing(0);
          setPlayerInput([]);
        }
      }, 1500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8">
      <h2 className="text-4xl font-black text-white drop-shadow-lg">
        Jejak Warna — Round {round}/{MAX_ROUNDS}
      </h2>
      <div className="flex gap-4 justify-center flex-wrap min-h-32 items-center">
        {phase === 'show' && sequence.slice(0, showing).map((c, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl">
            {c}
          </motion.span>
        ))}
        {phase === 'input' && (
          <p className="text-3xl text-white font-bold animate-pulse">Ulangi urutannya!</p>
        )}
        {phase === 'result' && (
          <p className="text-5xl">
            {playerInput.every((c, i) => c === sequence[i]) ? '✅ Benar!' : '❌ Coba lagi!'}
          </p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {COLORS.map(color => (
          <button key={color} onClick={() => handleColorTap(color)}
            disabled={phase !== 'input'}
            className="text-7xl w-28 h-28 rounded-3xl bg-white/20 border-4 border-white/40 active:scale-90 transition-transform disabled:opacity-40">
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}