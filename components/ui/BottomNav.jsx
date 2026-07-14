"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-150 px-4 pb-6 pt-10 pointer-events-none">
      <div className="max-w-md mx-auto relative flex justify-between items-end pointer-events-auto">
        
        {/* Main Navbar Background (Wooden/Golden) */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-[#4A2511] to-[#2A1506] rounded-4xl border-4 border-[#FFD700] border-b-8 border-b-[#B8860B] shadow-[0_10px_30px_rgba(0,0,0,0.8)] -z-10" />

        {/* 1. HOME Button */}
        <Link href="/" className="flex-1 pb-4 flex flex-col items-center justify-center gap-1 group active:translate-y-1 transition-transform">
          <span className={`text-3xl drop-shadow-md transition-transform ${pathname === '/' ? 'scale-125 drop-shadow-[0_0_10px_white]' : 'group-hover:scale-110 opacity-60'}`}>🏠</span>
          <span className={`text-[10px] font-black tracking-widest uppercase ${pathname === '/' ? 'text-white drop-shadow-[0_2px_2px_#000]' : 'text-[#FFD700] opacity-80'}`}>Peta</span>
        </Link>

        {/* 2. POHON KEHIDUPAN (Highlighted Center) */}
        <div className="relative flex-1 flex justify-center pb-2">
          {/* Highlight Glow Behind */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[20px] opacity-60 animate-[pulse_2s_ease-in-out_infinite] ${pathname === '/pohon' ? 'bg-green-300' : 'bg-green-500'}`} />
          
          <Link href="/pohon" className={`
            w-20 h-20 rounded-full 
            bg-linear-to-t ${pathname === '/pohon' ? 'from-emerald-400 to-green-200' : 'from-emerald-600 to-green-400'} 
            border-4 border-[#FFD700] border-b-8 border-b-emerald-800
            shadow-[0_0_20px_rgba(74,222,128,0.8)]
            flex flex-col items-center justify-center
            active:border-b-4 active:translate-y-1 transition-all z-10
            group
          `}>
            <span className={`text-4xl transition-transform ${pathname === '/pohon' ? 'scale-125 drop-shadow-[0_0_15px_white]' : 'drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] group-hover:scale-110'}`}>🌳</span>
          </Link>
          
          {/* Label below the protruding button */}
          <span className={`absolute -bottom-1 text-[10px] font-black tracking-widest uppercase drop-shadow-[0_2px_2px_#000] ${pathname === '/pohon' ? 'text-green-300' : 'text-white'}`}>Pohon</span>
        </div>

        {/* 3. PROFILE Button */}
        <Link href="/profil" className="flex-1 pb-4 flex flex-col items-center justify-center gap-1 group active:translate-y-1 transition-transform">
          <span className={`text-3xl drop-shadow-md transition-transform ${pathname === '/profil' ? 'scale-125 drop-shadow-[0_0_10px_white]' : 'group-hover:scale-110 opacity-60'}`}>👦</span>
          <span className={`text-[10px] font-black tracking-widest uppercase ${pathname === '/profil' ? 'text-white drop-shadow-[0_2px_2px_#000]' : 'text-[#FFD700] opacity-80'}`}>Profil</span>
        </Link>

      </div>
    </div>
  );
}
