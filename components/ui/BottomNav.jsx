"use client";

/**
 * ============================================================
 * BottomNav — Bottom Navigation (halaman selain Homepage)
 * ============================================================
 * Dipakai oleh: /pohon, /profil, /toko, dan halaman lain.
 * Halaman utama (/) menggunakan BottomNavigation dari
 * /components/homepage/BottomNavigation.jsx.
 *
 * Diperbarui untuk menggunakan <AppIcon> agar semua ikon
 * bisa diganti dari config/icons.js tanpa ubah kode ini.
 * ============================================================
 */

import { usePathname } from "next/navigation";
import Link            from "next/link";
import { motion }      from "framer-motion";
import { AppIcon }     from "@/components/shared/AppIcon";
import { THEME }       from "@/config/theme";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-150 px-4 pb-6 pt-10 pointer-events-none">
      <div className="max-w-md mx-auto relative flex justify-between items-end pointer-events-auto">

        {/* Background papan navbar (wooden / golden) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 rounded-4xl -z-10"
          style={{
            background:  'linear-gradient(180deg, #4A2511, #2A1506)',
            border:      `4px solid ${THEME.colors.gold}`,
            borderBottom:`8px solid ${THEME.colors.goldDark}`,
            boxShadow:   '0 10px 30px rgba(0,0,0,0.8)',
          }}
        />

        {/* ── 1. HOME / Peta ──────────────────────────────────── */}
        <Link
          href="/"
          id="bottom-nav-peta"
          className="flex-1 pb-4 flex flex-col items-center justify-center gap-1 group active:translate-y-1 transition-transform"
        >
          <motion.div
            animate={pathname === '/' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: pathname === '/' ? 1 : 0.6 }}
          >
            <AppIcon
              name="navMap"
              size={28}
              color={pathname === '/' ? '#FFFFFF' : THEME.colors.gold}
              className={pathname === '/' ? 'drop-shadow-[0_0_10px_white]' : ''}
            />
          </motion.div>
          <span
            className="text-[10px] font-black tracking-widest uppercase"
            style={{
              color:      pathname === '/' ? '#FFFFFF' : THEME.colors.gold,
              opacity:    pathname === '/' ? 1 : 0.8,
              textShadow: pathname === '/' ? '0 2px 2px #000' : 'none',
            }}
          >
            Peta
          </span>
        </Link>

        {/* ── 2. POHON — tombol tengah yang menonjol ──────────── */}
        <div className="relative flex-1 flex justify-center pb-2">
          {/* Glow di belakang */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[20px] animate-[pulse_2s_ease-in-out_infinite]"
            style={{ opacity: 0.6, background: pathname === '/pohon' ? '#86efac' : '#22c55e' }}
          />

          <Link
            href="/pohon"
            id="bottom-nav-pohon"
            className="flex flex-col items-center justify-center rounded-full group active:border-b-4 active:translate-y-1 transition-all z-10"
            style={{
              width:      80,
              height:     80,
              background: pathname === '/pohon'
                ? 'linear-gradient(to top, #4ade80, #bbf7d0)'
                : 'linear-gradient(to top, #16a34a, #4ade80)',
              border:      `4px solid ${THEME.colors.gold}`,
              borderBottom:`8px solid #166534`,
              boxShadow:   '0 0 20px rgba(74,222,128,0.8)',
            }}
          >
            <AppIcon
              name="navTree"
              size={36}
              className={
                pathname === '/pohon'
                  ? 'scale-125 drop-shadow-[0_0_15px_white]'
                  : 'drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform'
              }
            />
          </Link>

          <span
            className="absolute -bottom-1 text-[10px] font-black tracking-widest uppercase drop-shadow-[0_2px_2px_#000]"
            style={{ color: pathname === '/pohon' ? '#86efac' : '#FFFFFF' }}
          >
            Pohon
          </span>
        </div>

        {/* ── 3. PROFIL ───────────────────────────────────────── */}
        <Link
          href="/profil"
          id="bottom-nav-profil"
          className="flex-1 pb-4 flex flex-col items-center justify-center gap-1 group active:translate-y-1 transition-transform"
        >
          <motion.div
            animate={pathname === '/profil' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: pathname === '/profil' ? 1 : 0.6 }}
          >
            <AppIcon
              name="navProfile"
              size={28}
              color={pathname === '/profil' ? '#FFFFFF' : THEME.colors.gold}
              className={pathname === '/profil' ? 'drop-shadow-[0_0_10px_white]' : ''}
            />
          </motion.div>
          <span
            className="text-[10px] font-black tracking-widest uppercase"
            style={{
              color:      pathname === '/profil' ? '#FFFFFF' : THEME.colors.gold,
              opacity:    pathname === '/profil' ? 1 : 0.8,
              textShadow: pathname === '/profil' ? '0 2px 2px #000' : 'none',
            }}
          >
            Profil
          </span>
        </Link>

      </div>
    </div>
  );
}
