"use client";

import { Play, Sparkles, BookOpen, Heart, Brain, Users, Calendar, Video, ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContentHubView() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("semua"); // semua, video, artikel, webinar

  return (
    <div className="w-full min-h-screen pt-12 pb-32 animate-in fade-in duration-500 px-6 font-sans">
      
      <header className="mb-6">
        <h1 className="text-3xl font-black text-white drop-shadow-sm flex items-center gap-2">
          Pusat Edukasi Ibu <span className="animate-bounce">🧚‍♀️</span>
        </h1>
        <p className="text-indigo-200 text-sm mt-1">Tingkatkan skill mendidik dengan materi eksklusif.</p>
      </header>

      {/* Hero: Upcoming Webinar */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] p-6 border-[3px] border-amber-300 shadow-[0_15px_30px_rgba(245,158,11,0.4)] relative overflow-hidden group">
          {/* Magic Glow & Shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="absolute -bottom-6 -right-6 text-9xl opacity-20 transform -rotate-12 pointer-events-none">🎙️</div>
          
          <div className="relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/40 mb-3 flex items-center gap-2 w-max">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE WEBINAR HARI INI
            </div>
            
            <h2 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">
              Tanya Jawab Psikolog: Mengatasi *Speech Delay*
            </h2>
            <p className="text-amber-100 text-xs font-medium mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 19:00 WIB • Bersama dr. Karin Nabila
            </p>
            
            <button className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Daftar Gratis Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 pb-2 snap-x">
        {['semua', 'video', 'artikel', 'webinar'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`snap-start px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all border-2 ${
              activeCategory === cat 
                ? 'bg-fuchsia-500 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]' 
                : 'bg-[#2E1065] border-[#4C1D95] text-indigo-300 hover:bg-[#3B177D] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIDEO SECTION */}
      {(activeCategory === "semua" || activeCategory === "video") && (
        <section className="mb-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" /> Masterclass Video
            </h3>
            <button className="text-cyan-400 text-[10px] font-bold hover:text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
            {/* Video Card 1 */}
            <div 
              onClick={() => router.push('/orangtua/video')}
              className="min-w-[240px] snap-start group cursor-pointer bg-[#2E1065] border border-[#4C1D95] rounded-2xl p-2 hover:bg-[#3B177D] transition-colors"
            >
              <div className="w-full aspect-video bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl relative overflow-hidden mb-3 shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                 </div>
                 <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md">08:15</div>
              </div>
              <div className="px-1 pb-1">
                <span className="text-rose-400 text-[9px] font-black uppercase tracking-widest mb-1 block">Manajemen Emosi</span>
                <h4 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-rose-300 transition-colors">Seni Menghadapi Anak Tantrum</h4>
                <p className="text-indigo-300 text-[10px]">Oleh Dr. Aisha Lestari</p>
              </div>
            </div>

            {/* Video Card 2 */}
            <div 
              onClick={() => router.push('/orangtua/video')}
              className="min-w-[240px] snap-start group cursor-pointer bg-[#2E1065] border border-[#4C1D95] rounded-2xl p-2 hover:bg-[#3B177D] transition-colors"
            >
              <div className="w-full aspect-video bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl relative overflow-hidden mb-3 shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                 </div>
                 <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md">12:30</div>
              </div>
              <div className="px-1 pb-1">
                <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest mb-1 block">Metode Mengajar</span>
                <h4 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-cyan-300 transition-colors">Panduan Praktis Fonik Dasar</h4>
                <p className="text-indigo-300 text-[10px]">Oleh Eduplay Team</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ARTICLE SECTION */}
      {(activeCategory === "semua" || activeCategory === "artikel") && (
        <section className="mb-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Artikel Pilihan
            </h3>
            <button className="text-emerald-400 text-[10px] font-bold hover:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Article 1 */}
            <div 
              onClick={() => router.push('/orangtua/artikel')}
              className="bg-[#2E1065] border-2 border-[#4C1D95] rounded-2xl p-3 flex gap-4 items-center shadow-md group cursor-pointer hover:bg-[#3B177D] transition-colors"
            >
              <div className="w-20 h-20 bg-[url('https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl flex-shrink-0 border border-emerald-500/30"></div>
              <div className="flex-1 py-1">
                <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1 block">Perkembangan Otak</span>
                <h4 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2">Nutrisi Emas: Mempercepat Perkembangan Bicara Anak</h4>
                <div className="flex items-center gap-3 text-indigo-300 text-[10px] font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 Min Baca</span>
                </div>
              </div>
            </div>

            {/* Article 2 */}
            <div 
              onClick={() => router.push('/orangtua/artikel')}
              className="bg-[#2E1065] border-2 border-[#4C1D95] rounded-2xl p-3 flex gap-4 items-center shadow-md group cursor-pointer hover:bg-[#3B177D] transition-colors"
            >
              <div className="w-20 h-20 bg-[url('https://images.unsplash.com/photo-1543333995-a78aea2efa50?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl flex-shrink-0 border border-fuchsia-500/30"></div>
              <div className="flex-1 py-1">
                <span className="text-fuchsia-400 text-[9px] font-black uppercase tracking-widest mb-1 block">Stimulasi</span>
                <h4 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-fuchsia-300 transition-colors line-clamp-2">Permainan Sederhana Pembangun Kosakata di Rumah</h4>
                <div className="flex items-center gap-3 text-indigo-300 text-[10px] font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 4 Min Baca</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WEBINAR SECTION */}
      {(activeCategory === "semua" || activeCategory === "webinar") && (
        <section className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Jadwal Webinar
            </h3>
          </div>

          <div className="bg-[#2E1065] border border-[#4C1D95] rounded-2xl p-5 relative overflow-hidden shadow-md">
             <div className="flex gap-4 items-center mb-4">
               <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex flex-col items-center justify-center border border-indigo-400/30 flex-shrink-0">
                 <span className="text-indigo-300 text-[10px] font-bold uppercase">Okt</span>
                 <span className="text-white font-black text-xl leading-none">15</span>
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm mb-1">Membangun *Bonding* Lewat Dongeng</h4>
                 <p className="text-indigo-300 text-xs">Pukul 15:30 WIB • Via Zoom</p>
               </div>
             </div>
             <button className="w-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white font-bold text-sm py-2.5 rounded-xl transition-all">
               Ingatkan Saya
             </button>
          </div>
        </section>
      )}

    </div>
  );
}
