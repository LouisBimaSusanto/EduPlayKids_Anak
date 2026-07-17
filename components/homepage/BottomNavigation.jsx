'use client';

/**
 * ============================================================
 * BottomNavigation — Bottom Nav Halaman Utama (Desain Baru)
 * ============================================================
 * Tiga tab: Peta / Pohon / Profil.
 * Pohon sebagai tab tengah tampil lebih menonjol (naik sedikit).
 * Kontras lebih rendah dari elemen utama (tidak mengalihkan fokus).
 *
 * Semua ikon via <AppIcon> dari config/icons.js.
 * Dapat dipakai di halaman lain dengan import komponen ini.
 * ============================================================
 */

import Link       from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppIcon } from '@/components/shared/AppIcon';
import { THEME }   from '@/config/theme';

/** Konfigurasi tab — tambah tab baru cukup di sini */
const NAV_ITEMS = [
  { href: '/',       iconName: 'navMap',     label: 'Peta',   id: 'nav-tab-peta'  },
  { href: '/pohon',  iconName: 'navTree',    label: 'Pohon',  id: 'nav-tab-pohon', isCenter: true },
  { href: '/profil', iconName: 'navProfile', label: 'Profil', id: 'nav-tab-profil'},
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex justify-center px-4 pb-3 pt-0"
      aria-label="Navigasi utama"
    >
      <div
        className="flex items-end justify-around w-full max-w-sm rounded-3xl px-2 py-3 relative"
        style={{
          background:     THEME.colors.navBg,
          border:         `1.5px solid ${THEME.colors.navBorder}`,
          boxShadow:      '0 -8px 32px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {NAV_ITEMS.map(({ href, iconName, label, id, isCenter }) => {
          const isActive = pathname === href;

          /* ── Tab Tengah (Pohon) — sedikit lebih besar ─────── */
          if (isCenter) {
            return (
              <div key={id} className="relative flex flex-col items-center" style={{ marginTop: -28 }}>
                {/* Glow di belakang tombol */}
                <div
                  className="absolute rounded-full blur-xl"
                  style={{
                    width: 56, height: 56,
                    top: 4, left: '50%', transform: 'translateX(-50%)',
                    background: isActive ? 'rgba(74,222,128,0.65)' : 'rgba(34,197,94,0.35)',
                    transition: 'background 0.3s',
                  }}
                />

                <Link
                  href={href}
                  id={id}
                  className="flex flex-col items-center justify-center rounded-full relative z-10 transition-transform active:scale-90"
                  style={{
                    width:      64,
                    height:     64,
                    background: isActive
                      ? 'linear-gradient(135deg, #4ade80, #16a34a)'
                      : 'linear-gradient(135deg, #22c55e, #15803d)',
                    border:     `3px solid ${isActive ? THEME.colors.gold : 'rgba(255,215,0,0.4)'}`,
                    boxShadow:  '0 5px 0 #14532d, 0 0 18px rgba(34,197,94,0.5)',
                    transition: 'background 0.3s, border-color 0.3s',
                  }}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <AppIcon
                    name={iconName}
                    size={30}
                    color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.88)'}
                  />
                </Link>

                <span
                  className="text-[10px] font-black tracking-wider uppercase mt-1"
                  style={{
                    color: isActive ? '#4ade80' : THEME.colors.navInactive,
                    transition: 'color 0.3s',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          }

          /* ── Tab Biasa (Peta / Profil) ─────────────────────── */
          return (
            <Link
              key={id}
              href={href}
              id={id}
              className="flex flex-col items-center gap-1 pb-2 px-5 group transition-transform active:scale-90"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Ikon — sedikit scale up saat aktif */}
              <motion.div
                animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <AppIcon
                  name={iconName}
                  size={27}
                  color={isActive ? THEME.colors.navActive : THEME.colors.navInactive}
                />
              </motion.div>

              <span
                className="text-[10px] font-black tracking-wider uppercase"
                style={{
                  color:      isActive ? THEME.colors.navActive : THEME.colors.navInactive,
                  transition: 'color 0.3s',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
