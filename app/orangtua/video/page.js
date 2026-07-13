"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Download, CheckCircle2, ChevronRight, FileText, BrainCircuit } from "lucide-react";

export default function VideoEduPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("materi");
  const [quizAnswered, setQuizAnswered] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#1E1B4B] font-sans flex flex-col relative overflow-x-hidden selection:bg-rose-500/30">
      
      {/* Top Navbar */}
      <nav className="w-full px-4 py-4 flex items-center gap-3 relative z-20 bg-gradient-to-b from-[#1E1B4B] to-transparent">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-bold text-sm tracking-wide">Akademi Ibu Peri</span>
      </nav>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 pb-20 relative z-10">
        
        {/* Cinematic Video Player Placeholder */}
        <div className="w-full px-4 mb-6">
          <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-rose-500/50 shadow-[0_15px_30px_rgba(225,29,72,0.3)] relative overflow-hidden group">
            {/* Fake Video Thumbnail Cover */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
            
            {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-rose-500/80 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-rose-400 group-hover:scale-110 group-hover:bg-rose-500 transition-all shadow-[0_0_30px_rgba(225,29,72,0.6)] cursor-pointer pointer-events-auto active:scale-95">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>

            {/* Duration/Status */}
            <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              08:15
            </div>
          </div>
        </div>

        {/* Video Title & Author */}
        <div className="px-6 mb-8">
          <div className="inline-block bg-rose-500/20 text-rose-300 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-rose-500/30 mb-3">
            Manajemen Tantrum
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 drop-shadow-md">
            Seni Menghadapi Anak Tantrum Tanpa Berteriak
          </h1>
          
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/10">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Doc1" className="w-10 h-10 rounded-full bg-white border border-rose-300" alt="Author" />
             <div>
               <h4 className="text-white font-bold text-sm">Dr. Aisha Lestari, M.Psi</h4>
               <p className="text-indigo-300 text-[10px] font-medium">Pakar Psikologi Anak & Keluarga</p>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 mb-6">
          <div className="w-full bg-[#2E1065] rounded-xl p-1.5 border border-[#4C1D95] flex shadow-inner">
            <button 
              onClick={() => setActiveTab("materi")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "materi" ? "bg-[#4C1D95] text-white shadow-md" : "text-indigo-300 hover:text-white"}`}
            >
              <FileText className="w-3.5 h-3.5" /> Ringkasan
            </button>
            <button 
              onClick={() => setActiveTab("unduh")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "unduh" ? "bg-[#4C1D95] text-white shadow-md" : "text-indigo-300 hover:text-white"}`}
            >
              <Download className="w-3.5 h-3.5" /> Modul
            </button>
            <button 
              onClick={() => setActiveTab("kuis")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "kuis" ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]" : "text-indigo-300 hover:text-white"}`}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Kuis
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6">
          
          {/* Tab: Materi / Ringkasan */}
          {activeTab === "materi" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                Tantrum adalah cara anak balita mengomunikasikan rasa frustrasinya ketika mereka belum memiliki kosakata yang cukup untuk menjelaskannya.
              </p>
              
              <div className="bg-[#2E1065] border-l-4 border-rose-500 rounded-r-xl rounded-l-sm p-4 mt-4">
                <h4 className="text-white font-bold text-sm mb-2">3 Langkah Kunci (Teknik 3T):</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <p className="text-indigo-200 text-xs leading-relaxed"><strong className="text-white">Tenangkan Diri Sendiri:</strong> Ambil napas dalam 3 kali sebelum merespons anak.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <p className="text-indigo-200 text-xs leading-relaxed"><strong className="text-white">Turun ke Level Anak:</strong> Berjongkoklah agar mata Anda sejajar dengan matanya.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <p className="text-indigo-200 text-xs leading-relaxed"><strong className="text-white">Terima Emosinya:</strong> Validasi perasaannya dengan berkata, "Bunda tahu adik marah karena mainannya rusak."</p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Unduh Modul */}
          {activeTab === "unduh" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#2E1065] border border-[#4C1D95] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                  <span className="text-white font-black text-xs">PDF</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm mb-1">Cetak Lembar Latihan 3T</h4>
                  <p className="text-indigo-300 text-[10px]">Ukuran: 2.4 MB • 3 Halaman</p>
                </div>
                <button className="w-10 h-10 bg-[#4C1D95] rounded-full flex items-center justify-center text-white hover:bg-[#5B21B6] transition-colors active:scale-95 shadow-md">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab: Kuis (Uji Pemahaman) */}
          {activeTab === "kuis" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!quizAnswered ? (
                <div className="bg-gradient-to-br from-[#4C1D95] to-[#2E1065] border-2 border-rose-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
                  
                  <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-3 inline-block relative z-10">
                    Uji Pemahaman
                  </span>
                  
                  <h4 className="text-white font-bold text-base leading-snug mb-5 relative z-10">
                    Apa langkah pertama yang harus Bunda lakukan saat anak mulai menangis histeris di tempat umum?
                  </h4>
                  
                  <div className="space-y-3 relative z-10">
                    <button 
                      onClick={() => alert("Kurang tepat Bun. Menasihati saat emosi anak meledak tidak akan efektif.")}
                      className="w-full text-left bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl p-4 text-indigo-100 text-sm font-medium transition-colors"
                    >
                      A. Langsung menasihati anak agar berhenti menangis.
                    </button>
                    <button 
                      onClick={() => setQuizAnswered(true)}
                      className="w-full text-left bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-500/10 rounded-xl p-4 text-indigo-100 text-sm font-medium transition-colors group"
                    >
                      B. Mengambil napas dalam dan menenangkan diri sendiri terlebih dahulu.
                    </button>
                    <button 
                      onClick={() => alert("Sebaiknya jangan Bun. Mengabaikan bisa membuat anak merasa perasaannya tidak divalidasi.")}
                      className="w-full text-left bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl p-4 text-indigo-100 text-sm font-medium transition-colors"
                    >
                      C. Meninggalkan anak sendirian sampai ia diam.
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">Tepat Sekali!</h3>
                  <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                    Bunda luar biasa! Kita tidak bisa menenangkan ombak jika diri kita sendiri ikut menjadi badai. Tarik napas, tenangkan diri, baru hadapi anak.
                  </p>
                  <button className="bg-white text-emerald-700 font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-emerald-50 transition-colors">
                    Selesai & Lanjut Materi Lain
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
