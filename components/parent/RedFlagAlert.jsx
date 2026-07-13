"use client";

import { Info } from "lucide-react";

export function RedFlagAlert() {
  return (
    <div className="w-full bg-gradient-to-r from-rose-500/20 to-pink-600/20 backdrop-blur-md rounded-[2rem] p-4 border border-rose-400/50 shadow-[0_5px_15px_rgba(225,29,72,0.2)] flex items-center gap-4 cursor-pointer hover:bg-rose-500/30 transition-colors">
      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
        <span className="text-2xl">🧸</span>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-sm">Info Penting Minggu Ini</h4>
        <p className="text-rose-100 text-[10px] font-medium leading-tight mt-0.5">Ada catatan khusus mengenai cara Ara menyebut huruf /r/. Yuk lihat detailnya Bun!</p>
      </div>
      <div className="bg-white/10 p-2 rounded-full">
        <Info className="w-4 h-4 text-rose-300" />
      </div>
    </div>
  );
}
