"use client";

import { useState } from "react";
import { Sparkles, Map, Play, Music, ArrowRight, CheckCircle2, X } from "lucide-react";

export function ModuleSelectionView() {
  const [selectedModule, setSelectedModule] = useState(null);

  const availableModules = [
    {
      id: "suku-kata",
      title: "Galaksi Suku Kata",
      icon: "🚀",
      bgClass: "from-indigo-500 to-blue-600",
      shortDesc: "Langkah selanjutnya setelah fonik. Anak akan belajar merangkai 2-3 huruf menjadi suku kata utuh.",
      longDesc: "Modul ini adalah transisi kritis dari pengenalan bunyi (fonik) ke tahap membaca awal. Anak Anda akan diajak bertualang dari satu planet ke planet lain, di mana setiap planet menyimpan rahasia suku kata (seperti ba, bi, bu) yang harus digabungkan untuk mendapatkan bahan bakar roket. Sangat direkomendasikan jika anak sudah menguasai 80% modul Fonik dasar."
    },
    {
      id: "kosakata",
      title: "Hutan Kosakata",
      icon: "🦁",
      bgClass: "from-emerald-500 to-teal-600",
      shortDesc: "Fokus pada perluasan pembendaharaan kata. Menghubungkan visual dengan pelafalan yang benar.",
      longDesc: "Perluas wawasan anak dengan menjelajahi Hutan Kosakata! Di sini, anak tidak hanya diajarkan menyebutkan nama hewan, buah, dan benda sehari-hari, tetapi juga dilatih memahami konteks penggunaannya. Dilengkapi dengan teknologi pengenalan suara pintar untuk memastikan pelafalan anak tepat dan jelas sejak dini."
    },
    {
      id: "angka",
      title: "Logika & Angka Robotika",
      icon: "🤖",
      bgClass: "from-orange-400 to-rose-500",
      shortDesc: "Bukan sekadar berhitung! Anak belajar konsep jumlah, perbandingan, dan logika dasar.",
      longDesc: "Membangun fondasi logika berpikir (*Computational Thinking*) sebelum masuk sekolah! Bersama karakter robot pintar, anak akan diajarkan konsep abstrak matematika (seperti lebih besar/lebih kecil, pengurutan, dan pola bentuk) melalui permainan merakit onderdil robot yang sangat visual dan mudah dipahami balita."
    }
  ];

  return (
    <div className="w-full min-h-screen pt-12 pb-32 animate-in fade-in duration-500 font-sans px-6 relative">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-sm flex items-center gap-2">
          Pusat Kurikulum <Map className="w-6 h-6 text-yellow-400" />
        </h1>
        <p className="text-indigo-200 text-sm mt-1">Pilih fokus pembelajaran Ara selanjutnya.</p>
      </header>

      {/* Active Module (Fonik) */}
      <section className="mb-10">
        <h3 className="text-white font-bold text-lg mb-4 drop-shadow-md">Modul Saat Ini</h3>
        <div className="bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] rounded-[2rem] p-5 border-[3px] border-[#A78BFA] shadow-[0_10px_25px_rgba(139,92,246,0.5)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-[50px] opacity-30 pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="bg-emerald-400 text-[#064E3B] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Sedang Aktif
            </span>
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg border border-yellow-200 transform rotate-6">
              <Music className="w-6 h-6 text-yellow-900" />
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-white font-black text-2xl leading-tight mb-2 drop-shadow-md">
              Dunia Bunyi Huruf (Fonik)
            </h2>
            <p className="text-indigo-200 text-xs font-medium mb-5">
              Fondasi paling penting sebelum membaca! Anak akan diajak mengenali huruf berdasarkan bunyinya (A untuk Apel, bukan sekadar menyebut huruf A) melalui *game* petualangan suara. Sangat efektif untuk balita.
            </p>

            <div className="mb-4">
              <div className="flex justify-between items-end mb-1">
                <span className="text-white font-bold text-xs">Penyelesaian Modul</span>
                <span className="text-yellow-400 font-black text-sm">45%</span>
              </div>
              <div className="w-full bg-indigo-950/50 rounded-full h-3 border border-indigo-900">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ width: '45%' }}></div>
              </div>
            </div>

            <button className="w-full bg-yellow-400 text-indigo-950 font-black text-sm px-5 py-3 rounded-xl shadow-md active:scale-95 transition-transform flex justify-center items-center gap-2">
              <Play className="w-4 h-4 fill-indigo-950" /> Lanjutkan Petualangan
            </button>
          </div>
        </div>
      </section>

      {/* Available Modules */}
      <section>
        <h3 className="text-white font-bold text-lg mb-4 drop-shadow-md">Modul Tersedia Lainnya</h3>
        
        <div className="space-y-4">
          {availableModules.map((mod) => (
            <div key={mod.id} className="bg-[#4C1D95]/40 backdrop-blur-md border border-[#6D28D9] rounded-[1.5rem] p-4 group hover:bg-[#4C1D95]/70 transition-colors">
              <div className="flex gap-4 items-start mb-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${mod.bgClass} rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner`}>
                  <span className="text-2xl">{mod.icon}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">{mod.title}</h4>
                  <p className="text-indigo-200 text-[11px] leading-relaxed">
                    {mod.shortDesc}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedModule(mod)}
                className="w-full bg-[#312E81] hover:bg-[#3730A3] text-indigo-200 font-bold text-xs py-2.5 rounded-lg border border-[#4F46E5] transition-colors flex justify-center items-center gap-2 active:scale-95"
              >
                Pilih Modul Ini <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal / Pop-up Konfirmasi */}
      {selectedModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm"
            onClick={() => setSelectedModule(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-[#2E1065] border-2 border-[#6D28D9] rounded-[2rem] p-6 w-full max-w-sm relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedModule(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#4C1D95] rounded-full flex items-center justify-center text-indigo-300 hover:text-white hover:bg-[#5B21B6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center mb-5 mt-2">
              <div className={`w-20 h-20 bg-gradient-to-br ${selectedModule.bgClass} rounded-3xl flex items-center justify-center shadow-lg mb-4 transform rotate-3`}>
                <span className="text-4xl">{selectedModule.icon}</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight mb-1">{selectedModule.title}</h2>
              <span className="bg-indigo-900 text-indigo-200 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-700">
                Pratinjau Kurikulum
              </span>
            </div>

            {/* Modal Body */}
            <div className="bg-[#1E1B4B] rounded-2xl p-4 border border-[#4C1D95] mb-6">
              <h4 className="text-indigo-300 font-bold text-xs mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Mengapa Modul Ini Penting?
              </h4>
              <p className="text-indigo-100 text-[11px] leading-relaxed">
                {selectedModule.longDesc}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedModule(null)}
                className="flex-1 bg-transparent text-indigo-300 font-bold text-sm py-3 rounded-xl border border-[#4C1D95] hover:bg-[#4C1D95] transition-colors active:scale-95"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  alert(`Modul ${selectedModule.title} berhasil diaktifkan!`);
                  setSelectedModule(null);
                }}
                className="flex-[2] bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-950 font-black text-sm py-3 rounded-xl shadow-[0_5px_15px_rgba(251,191,36,0.4)] hover:brightness-110 transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> ACC Modul
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
