"use client";

import { Bell, Search, Play, BookOpen, Crown, ChevronRight, Star, Zap, Flame, PieChart, QrCode, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/backendApi";

export function HomeView() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [pairingCode, setPairingCode] = useState("ARA-87X");
  
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Dapatkan daftar anak
        const childrenData = await api.children.getAll();
        
        let childToView = null;
        if (Array.isArray(childrenData) && childrenData.length > 0) {
          childToView = childrenData[0]; // Ambil anak pertama sebagai default
          setChildren(childrenData);
          setActiveChild(childToView);
          
          // Set pairing code asli dari backend (asumsi properti 'pairing_code' atau fallback ke id)
          if (childToView.pairing_code || childToView.id) {
            setPairingCode(childToView.pairing_code || childToView.id);
          }
        }

        // 2. Jika ada anak, ambil ringkasan dashboard-nya
        if (childToView && childToView.id) {
          const summaryData = await api.dashboard.getSummary(childToView.id);
          setSummary(summaryData);
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Defensif data: Fallback ke nilai 0 jika API belum siap
  const durasiFokus = summary?.focusDurationMinutes || 0;
  const misiSelesai = summary?.missionsCompleted || 0;
  const levelSaatIni = summary?.currentLevel || 1;
  const modulAktif = summary?.activeModule || "Fonik";
  const namaParent = user?.name || user?.email?.split('@')[0] || "Ibu/Ayah";
  const namaAnak = activeChild?.name || "Anak";

  return (
    <div className="w-full pb-28 animate-in fade-in duration-500 font-sans relative">
      
      {/* Pairing Modal */}
      {showPairingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1E1B4B] w-full max-w-sm rounded-[2rem] border-4 border-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.4)] p-6 relative flex flex-col items-center text-center animate-in zoom-in-95">
            <button 
              onClick={() => setShowPairingModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 border border-cyan-500/40">
              <QrCode className="w-8 h-8 text-cyan-400" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2">Kode Penghubung</h2>
            <p className="text-indigo-200 text-xs mb-6 px-4">
              Arahkan kamera dari halaman Login Anak ke QR Code ini, atau ketikkan kode di bawah.
            </p>
            
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
              {/* Dummy QR image since we don't generate dynamic QR image yet */}
              <QrCode className="w-40 h-40 text-indigo-950" />
            </div>
            
            <div className="bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-xl">
              <span className="text-cyan-400 font-black tracking-[0.2em] text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                {pairingCode}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Magical Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center gap-2">
            Halo, {namaParent}! ✨
          </h1>
          <p className="text-indigo-200 text-sm font-medium">Laporan Tumbuh Kembang {namaAnak}</p>
        </div>
        
        <div className="flex gap-2">
          {/* QR Pairing Button */}
          <button 
            onClick={() => setShowPairingModal(true)}
            className="w-14 h-14 bg-cyan-500/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] group"
            title="Tampilkan Kode Pairing"
          >
            <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] p-[2px] rounded-full shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full bg-indigo-900 rounded-full border-2 border-indigo-950 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${namaParent}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="px-6 py-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="px-6 space-y-8">
          
          {/* Super Attractive Stats Section */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                Aktivitas Hari Ini
              </h2>
            </div>

            <div className="flex gap-4">
              {/* Main Stat Card - Durasi */}
              <div className="flex-1 bg-gradient-to-b from-[#FF6B6B] to-[#E11D48] rounded-[2rem] p-5 shadow-[0_15px_30px_rgba(225,29,72,0.4)] relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/20 rounded-full blur-xl"></div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner z-10">
                  <Flame className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="relative z-10 mt-4">
                  <span className="text-4xl font-black text-white drop-shadow-md">{durasiFokus}<span className="text-xl text-rose-200">m</span></span>
                  <span className="block text-[10px] text-rose-100 uppercase tracking-widest font-bold mt-1">Durasi Fokus</span>
                </div>
              </div>

              {/* Right Column (Stacked Stats) */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Misi Card */}
                <div className="flex-1 bg-gradient-to-r from-[#FBBF24] to-[#D97706] rounded-3xl p-4 shadow-[0_10px_20px_rgba(217,119,6,0.3)] flex items-center gap-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white/20 rounded-full blur-lg"></div>
                  <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0 z-10">
                    <Zap className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="block text-2xl font-black text-white leading-none">{misiSelesai}</span>
                    <span className="block text-[8px] text-amber-100 uppercase tracking-widest font-bold mt-1">Misi Selesai</span>
                  </div>
                </div>

                {/* Level Card */}
                <div className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-3xl p-4 shadow-[0_10px_20px_rgba(109,40,217,0.3)] flex items-center gap-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white/20 rounded-full blur-lg"></div>
                  <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0 z-10">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="block text-2xl font-black text-white leading-none">Lv.{levelSaatIni}</span>
                    <span className="block text-[8px] text-violet-200 uppercase tracking-widest font-bold mt-1 truncate max-w-[70px]">{modulAktif}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Analitik Komprehensif */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-white font-bold text-lg tracking-wide">Ringkasan Raport</h2>
              <span className="bg-[#4C1D95] text-indigo-200 text-[10px] font-bold px-2 py-1 rounded-md">Minggu Ini</span>
            </div>

            {/* 1. Super Attractive Glow Chart (Line Chart) */}
            <div className="bg-[#2E1065] rounded-[2rem] p-6 border-2 border-[#4C1D95] shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8B5CF6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">Tren Fokus Harian</h3>
                  <p className="text-indigo-300 text-[10px] font-medium mt-1">Kenaikan partisipasi</p>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/50 px-2 py-1 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="text-emerald-400 text-[10px] font-black">+15% 🚀</span>
                </div>
              </div>
              
              <div className="w-full h-24 relative z-10">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                  <defs>
                    <linearGradient id="neonGlow" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glowEffect">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path d="M0,45 C20,30 30,40 50,20 C70,0 80,15 100,10 L100,50 L0,50 Z" fill="url(#neonGlow)" />
                  <path d="M0,45 C20,30 30,40 50,20 C70,0 80,15 100,10" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" filter="url(#glowEffect)" />
                  <circle cx="100" cy="10" r="4" fill="#FFFFFF" stroke="#22D3EE" strokeWidth="2" filter="url(#glowEffect)" className="animate-pulse" />
                </svg>
                <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-bold text-indigo-400">
                  <span>Sn</span><span>Sl</span><span>Rb</span><span>Km</span><span>Jm</span><span>Sb</span><span className="text-cyan-400 font-black">Mg</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {/* 2. Komposisi Belajar (Bar Chart) */}
              <div className="flex-1 bg-gradient-to-b from-[#312E81] to-[#2E1065] rounded-[1.5rem] p-4 border-2 border-[#4F46E5] shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/20 blur-[30px] rounded-full pointer-events-none"></div>

                <h3 className="text-white font-bold text-xs tracking-wide mb-3 z-10 relative flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-fuchsia-400" /> Distribusi
                </h3>
                
                {/* Stacked Bar with Gaps */}
                <div className="w-full flex h-3 gap-0.5 mb-4 z-10 relative">
                  <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 h-full rounded-l-full shadow-[0_0_8px_rgba(232,121,249,0.8)]" style={{width: '60%'}}></div>
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" style={{width: '25%'}}></div>
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" style={{width: '15%'}}></div>
                </div>
                
                {/* Gamified Legend */}
                <div className="space-y-2 z-10 relative">
                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-1.5 border border-fuchsia-500/30 shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-fuchsia-500/20 flex items-center justify-center font-black text-fuchsia-400 text-[10px]">A</div>
                      <span className="text-fuchsia-100 text-[9px] font-bold tracking-wider">Fonik</span>
                    </div>
                    <span className="text-white font-black text-[10px]">60%</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-1.5 border border-amber-500/30 shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center font-black text-amber-400 text-[10px]">🧠</div>
                      <span className="text-amber-100 text-[9px] font-bold tracking-wider">Logika</span>
                    </div>
                    <span className="text-white font-black text-[10px]">25%</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-1.5 border border-cyan-500/30 shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center font-black text-cyan-400 text-[10px]">👁️</div>
                      <span className="text-cyan-100 text-[9px] font-bold tracking-wider">Visual</span>
                    </div>
                    <span className="text-white font-black text-[10px]">15%</span>
                  </div>
                </div>
              </div>

              {/* 3. Profil Keterampilan (Radar/Bars) */}
              <div className="flex-1 bg-[#2E1065] rounded-[1.5rem] p-4 border-2 border-[#4C1D95] shadow-lg">
                <h3 className="text-white font-bold text-xs tracking-wide mb-3">Keterampilan</h3>
                
                <div className="space-y-3">
                  {/* Skill 1 */}
                  <div>
                    <div className="flex justify-between text-[9px] font-bold mb-1">
                      <span className="text-emerald-300">Daya Ingat</span>
                      <span className="text-white">92%</span>
                    </div>
                    <div className="w-full bg-indigo-950 rounded-full h-1.5 border border-indigo-900/50">
                      <div className="bg-emerald-400 h-full rounded-full shadow-[0_0_5px_rgba(52,211,153,0.8)]" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  {/* Skill 2 */}
                  <div>
                    <div className="flex justify-between text-[9px] font-bold mb-1">
                      <span className="text-blue-300">Pengucapan</span>
                      <span className="text-white">75%</span>
                    </div>
                    <div className="w-full bg-indigo-950 rounded-full h-1.5 border border-indigo-900/50">
                      <div className="bg-blue-400 h-full rounded-full shadow-[0_0_5px_rgba(96,165,250,0.8)]" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  {/* Skill 3 */}
                  <div>
                    <div className="flex justify-between text-[9px] font-bold mb-1">
                      <span className="text-rose-300">Konsentrasi</span>
                      <span className="text-white">88%</span>
                    </div>
                    <div className="w-full bg-indigo-950 rounded-full h-1.5 border border-indigo-900/50">
                      <div className="bg-rose-400 h-full rounded-full shadow-[0_0_5px_rgba(251,113,133,0.8)]" style={{width: '88%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* Elegant AI Insight */}
          <section>
            <div className="bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 backdrop-blur-md rounded-[1.5rem] p-4 border border-violet-400/30 flex gap-4 items-start shadow-[0_5px_15px_rgba(139,92,246,0.2)]">
              <div className="mt-1 text-2xl animate-bounce">💡</div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Catatan Perkembangan AI</h4>
                <p className="text-indigo-100 text-[11px] font-medium leading-relaxed">
                  {namaAnak} menunjukkan kemajuan luar biasa pada *Daya Ingat Visual* (92%). Kami merekomendasikan penambahan porsi latihan untuk *Pengucapan Verbal* pada sesi belajar berikutnya agar kemampuannya lebih seimbang.
                </p>
              </div>
            </div>
          </section>

          {/* Learning Videos Carousel */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
               <h3 className="text-white font-bold text-sm tracking-wide">Video Edukasi Ibu</h3>
               <span className="text-violet-300 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg">Lihat Semua</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
              {/* Card 1 */}
              <div 
                onClick={() => router.push('/orangtua/video')}
                className="min-w-[200px] snap-start group cursor-pointer"
              >
                <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl relative overflow-hidden mb-2 border-2 border-indigo-400 shadow-[0_5px_15px_rgba(99,102,241,0.3)]">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-white fill-white ml-1" />
                      </div>
                   </div>
                   <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded">05:30</div>
                </div>
                <h4 className="text-white font-bold text-xs leading-tight mb-0.5 group-hover:text-indigo-200 transition-colors">Strategi Menghadapi Tantrum</h4>
                <p className="text-indigo-300 text-[9px]">Pakar Psikologi Anak</p>
              </div>

              {/* Card 2 */}
              <div 
                onClick={() => router.push('/orangtua/video')}
                className="min-w-[200px] snap-start group cursor-pointer"
              >
                <div className="w-full aspect-video bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl relative overflow-hidden mb-2 border-2 border-fuchsia-400 shadow-[0_5px_15px_rgba(217,70,239,0.3)]">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-white fill-white ml-1" />
                      </div>
                   </div>
                   <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded">08:15</div>
                </div>
                <h4 className="text-white font-bold text-xs leading-tight mb-0.5 group-hover:text-fuchsia-200 transition-colors">Metode Fonik Praktis</h4>
                <p className="text-indigo-300 text-[9px]">Edukasi Usia Dini</p>
              </div>
            </div>
          </section>

          {/* Latest Articles */}
          <section>
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-white font-bold text-sm tracking-wide">Artikel Terkini</h3>
            </div>
            
            <div className="space-y-3">
              {/* Article Item 1 */}
              <div 
                onClick={() => router.push('/orangtua/artikel')}
                className="bg-[#2E1065] rounded-2xl p-3 border-2 border-[#4C1D95] flex gap-4 items-center shadow-lg group cursor-pointer hover:bg-[#3B177D] transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  🧠
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1">Perkembangan</span>
                  <h4 className="text-white font-bold text-xs leading-tight mb-1.5">Nutrisi Penting untuk Perkembangan Otak Emas Anak</h4>
                  <div className="flex items-center gap-1.5 text-indigo-200 text-[9px] font-medium">
                    <BookOpen className="w-3 h-3 text-indigo-400" /> Baca 3 menit
                  </div>
                </div>
              </div>

              {/* Article Item 2 */}
              <div 
                onClick={() => router.push('/orangtua/artikel')}
                className="bg-[#2E1065] rounded-2xl p-3 border-2 border-[#4C1D95] flex gap-4 items-center shadow-lg group cursor-pointer hover:bg-[#3B177D] transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  🗣️
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest mb-1">Komunikasi</span>
                  <h4 className="text-white font-bold text-xs leading-tight mb-1.5">Cara Merangsang Kemampuan Berbicara Anak Sejak Dini</h4>
                  <div className="flex items-center gap-1.5 text-indigo-200 text-[9px] font-medium">
                    <BookOpen className="w-3 h-3 text-indigo-400" /> Baca 5 menit
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
