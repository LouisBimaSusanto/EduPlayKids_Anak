"use client";

import { Target, Zap, Brain, Sparkles, AlertCircle, HeartHandshake, Download } from "lucide-react";
import { RedFlagAlert } from "./RedFlagAlert";

export function MonitoringView() {
  const handlePrint = () => {
    // In a real app, this would trigger html2pdf or window.print()
    alert("Mempersiapkan dokumen PDF Laporan Pertumbuhan Ara...");
  };

  return (
    <div className="w-full min-h-screen pt-12 pb-32 animate-in fade-in duration-500 font-sans px-6">
      
      {/* Professional Elegant Header */}
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400 drop-shadow-sm tracking-wide">
            Raport Pertumbuhan
          </h1>
          <p className="text-indigo-200 text-sm mt-1">Laporan detail untuk Bunda, ditulis dengan bahasa yang mudah dipahami.</p>
        </div>
        
        <button 
          onClick={handlePrint}
          className="w-10 h-10 bg-indigo-500/20 border border-indigo-400/30 rounded-xl flex items-center justify-center text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all shadow-md active:scale-95 flex-shrink-0"
          title="Cetak PDF"
        >
          <Download className="w-5 h-5" />
        </button>
      </header>

      {/* Alert Banner */}
      <div className="mb-8">
        <RedFlagAlert />
      </div>

      {/* Catatan Psikolog/AI (Executive Summary for Lay Mothers) */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-[#8B5CF6]/90 to-[#6D28D9]/90 backdrop-blur-xl border-2 border-[#A78BFA] rounded-[2rem] p-5 shadow-[0_15px_30px_rgba(139,92,246,0.4)] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-[40px] pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-inner">
              👩‍🏫
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Kesimpulan Minggu Ini</h3>
              <p className="text-violet-200 text-[10px] font-medium">Oleh Asisten Pintar Eduplay</p>
            </div>
          </div>
          
          <p className="text-white text-xs leading-relaxed font-medium relative z-10">
            "Ara sangat luar biasa minggu ini! Ia sudah <strong className="text-yellow-300">sangat lancar mengingat bentuk huruf vokal</strong>. Meskipun kadang pelafalan huruf 'R' masih belum sempurna, Bunda tidak perlu khawatir karena ini sangat wajar di usianya. Terus berikan pujian ya Bun!"
          </p>
        </div>
      </section>

      {/* Lay-friendly Metrics */}
      <section className="mb-8">
        <h3 className="text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" /> Performa Belajar Anak
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Accuracy */}
          <div className="bg-[#2E1065] border border-[#4C1D95] rounded-3xl p-4 relative overflow-hidden group hover:bg-[#3B177D] transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
            <Target className="w-6 h-6 text-emerald-400 mb-2" />
            <span className="text-white font-black text-2xl">85%</span>
            <h4 className="text-emerald-300 font-bold text-[10px] uppercase tracking-widest mt-1">Ketepatan</h4>
            <p className="text-indigo-200 text-[10px] leading-tight mt-1.5">
              Hebat! Ara sangat jarang melakukan kesalahan saat memilih jawaban.
            </p>
          </div>

          {/* Speed */}
          <div className="bg-[#2E1065] border border-[#4C1D95] rounded-3xl p-4 relative overflow-hidden group hover:bg-[#3B177D] transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl"></div>
            <Zap className="w-6 h-6 text-yellow-400 mb-2" />
            <span className="text-white font-black text-2xl">4.2s</span>
            <h4 className="text-yellow-300 font-bold text-[10px] uppercase tracking-widest mt-1">Kecepatan</h4>
            <p className="text-indigo-200 text-[10px] leading-tight mt-1.5">
              Sangat responsif! Ara bisa menjawab pertanyaan dengan tangkas.
            </p>
          </div>

          {/* Independence (Full width) */}
          <div className="col-span-2 bg-[#2E1065] border border-[#4C1D95] rounded-3xl p-4 flex gap-4 items-center">
             <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
               <Brain className="w-6 h-6 text-blue-400" />
             </div>
             <div>
               <h4 className="text-white font-bold text-sm mb-0.5">Tingkat Kemandirian: <span className="text-blue-400">Sangat Tinggi</span></h4>
               <p className="text-indigo-200 text-[11px] leading-relaxed">
                 Ara berhasil menyelesaikan <strong className="text-white">90% permainan</strong> tanpa harus dibantu oleh petunjuk sistem. Ia anak yang mandiri!
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Detailed Skills Breakdown */}
      <section className="mb-8">
        <h3 className="text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
          <Target className="w-4 h-4 text-fuchsia-400" /> Rincian Keterampilan Dasar
        </h3>
        
        <div className="bg-gradient-to-b from-[#312E81] to-[#2E1065] rounded-[2rem] p-5 border-2 border-[#4F46E5] shadow-[0_10px_20px_rgba(0,0,0,0.3)] space-y-5">
          
          {/* Skill 1 */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-white font-bold text-sm block">Mengingat Bentuk Huruf</span>
                <span className="text-indigo-300 text-[10px]">Kemampuan visual anak</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                Sangat Kuat
              </span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-3 overflow-hidden border border-indigo-900/50">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" style={{ width: '95%' }}></div>
            </div>
          </div>

          {/* Skill 2 */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-white font-bold text-sm block">Melafalkan Bunyi (Bicara)</span>
                <span className="text-indigo-300 text-[10px]">Kemampuan verbal anak</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                Berkembang
              </span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-3 overflow-hidden border border-indigo-900/50">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Skill 3 */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-white font-bold text-sm block">Fokus & Konsentrasi</span>
                <span className="text-indigo-300 text-[10px]">Kemampuan menahan distraksi</span>
              </div>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                Sudah Baik
              </span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-3 overflow-hidden border border-indigo-900/50">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" style={{ width: '85%' }}></div>
            </div>
          </div>

        </div>
      </section>

      {/* Actionable Advice (PR untuk Bunda) */}
      <section>
        <h3 className="text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-rose-400" /> Tips Latihan di Rumah
        </h3>
        
        <div className="space-y-4">
          <div className="bg-[#2E1065] border-l-4 border-rose-500 rounded-r-2xl rounded-l-md p-4 relative overflow-hidden shadow-md">
            <h4 className="text-white font-bold text-sm mb-1.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" /> Untuk Pelafalan Huruf /b/ & /p/
            </h4>
            <p className="text-indigo-200 text-xs leading-relaxed">
              Ara kadang masih tertukar antara B dan P. <strong className="text-white">Tips Bunda:</strong> Coba ajak Ara bermain tebak barang di rumah. Misalnya, "Ara, mana ya benda yang namanya pakai awalan P? Piiiiiin-tu!".
            </p>
          </div>

          <div className="bg-[#2E1065] border-l-4 border-orange-500 rounded-r-2xl rounded-l-md p-4 relative overflow-hidden shadow-md">
            <h4 className="text-white font-bold text-sm mb-1.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" /> Mengasah Huruf Konsonan /r/
            </h4>
            <p className="text-indigo-200 text-xs leading-relaxed">
              Ini sangat wajar! Huruf R memang butuh waktu. <strong className="text-white">Tips Bunda:</strong> Ajak Ara menirukan suara motor "Brummm brummm" atau harimau "Rrrrroar" saat bermain peran bersama.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
