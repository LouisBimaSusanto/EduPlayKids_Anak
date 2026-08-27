'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Game({ game, onComplete, onClose }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/40">
      <h2 className="text-4xl font-black text-white drop-shadow-lg mb-8">
        Peta Bajak Laut (Sedang Dibangun)
      </h2>
      <button 
        onClick={onComplete}
        className="px-8 py-4 bg-green-500 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_#15803d] active:shadow-[0_0px_0_#15803d] active:translate-y-2 transition-all">
        SELESAIKAN GAME
      </button>
      <button 
        onClick={onClose}
        className="mt-8 px-8 py-4 bg-red-500 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_#b91c1c] active:shadow-[0_0px_0_#b91c1c] active:translate-y-2 transition-all">
        KELUAR
      </button>
    </div>
  );
}