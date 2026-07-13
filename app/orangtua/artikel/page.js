"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Share2, Bookmark, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ArticleEduPage() {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#1E1B4B] font-sans flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Top Navbar */}
      <nav className="w-full px-4 py-4 flex items-center justify-between relative z-20 bg-gradient-to-b from-[#1E1B4B] to-transparent">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-indigo-300 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center transition-colors ${isBookmarked ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-indigo-300 hover:text-white'}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-400' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Hero Cover Image */}
      <div className="w-full h-[40vh] absolute top-0 left-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
        {/* Deep gradient fade to background color */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#1E1B4B]/80 to-[#1E1B4B]"></div>
      </div>

      {/* Main Reading Area */}
      <main className="flex-1 px-6 pt-[20vh] pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Article Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-500/30">
              Perkembangan Otak
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" /> 3 Menit Baca
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6 drop-shadow-lg">
            Nutrisi Emas: Makanan Spesifik yang Mempercepat Perkembangan Bicara Anak
          </h1>
          
          {/* Author */}
          <div className="flex items-center gap-3 border-t border-b border-white/10 py-4">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Nutri" className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-400" alt="Author" />
             <div>
               <h4 className="text-white font-bold text-sm">dr. Karin Nabila, Sp.A</h4>
               <p className="text-indigo-300 text-[11px] font-medium">Dokter Spesialis Anak - 12 Okt 2024</p>
             </div>
          </div>
        </div>

        {/* Article Body (Optimized for Reading) */}
        <article className="prose prose-invert prose-emerald max-w-none">
          <p className="text-indigo-100 text-lg leading-relaxed font-medium mb-6">
            Banyak orang tua yang fokus pada stimulasi luar seperti membacakan buku atau bernyanyi untuk melatih anak berbicara. Namun, tahukah Bunda bahwa "bahan bakar" otak dari dalam sama pentingnya?
          </p>
          
          <h3 className="text-white font-bold text-xl mb-3 mt-8">1. Asam Lemak Omega-3 (DHA & EPA)</h3>
          <p className="text-indigo-200 text-base leading-relaxed mb-5">
            DHA adalah komponen utama penyusun otak. Penelitian menunjukkan bahwa asupan Omega-3 yang cukup berhubungan langsung dengan ketajaman memori dan pemrosesan bahasa. Sumber terbaik: <strong className="text-emerald-300">Ikan salmon, ikan kembung, dan telur yang difortifikasi Omega-3.</strong>
          </p>

          <div className="bg-[#2E1065] border-l-4 border-emerald-500 rounded-r-2xl rounded-l-md p-5 my-8 shadow-lg">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tips Praktis Bunda
            </h4>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Jika anak tidak suka bau amis ikan, Bunda bisa mengakalinya dengan membuat <strong className="text-white">nugget ikan buatan rumah</strong> yang dicampur dengan sedikit wortel parut dan keju.
            </p>
          </div>

          <h3 className="text-white font-bold text-xl mb-3 mt-8">2. Zat Besi (Iron)</h3>
          <p className="text-indigo-200 text-base leading-relaxed mb-5">
            Zat besi berfungsi membawa oksigen ke seluruh bagian otak. Kekurangan zat besi pada masa balita telah terbukti dapat menunda perkembangan kognitif dan bahasa. Pastikan Bunda menyertakan <strong className="text-emerald-300">daging merah tanpa lemak, bayam, atau hati ayam</strong> dalam menu MPASI.
          </p>

          <h3 className="text-white font-bold text-xl mb-3 mt-8">3. Kolin (Choline)</h3>
          <p className="text-indigo-200 text-base leading-relaxed mb-5">
            Kolin sangat penting untuk pusat memori otak. Anak yang memiliki memori kuat akan lebih mudah mengingat kosakata baru. Kabar baiknya, sumber kolin paling mudah ditemukan ada pada <strong className="text-emerald-300">kuning telur</strong>. Satu butir telur sehari sudah sangat membantu!
          </p>
        </article>

        <hr className="border-white/10 my-10" />

        {/* Related Articles */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-fuchsia-400" /> Bacaan Terkait
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-20 h-20 bg-[url('https://images.unsplash.com/photo-1543333995-a78aea2efa50?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl flex-shrink-0"></div>
              <div className="flex flex-col justify-center">
                <span className="text-fuchsia-400 text-[9px] font-black uppercase tracking-widest mb-1">Stimulasi</span>
                <h4 className="text-white font-bold text-xs leading-snug mb-1.5 group-hover:text-emerald-300 transition-colors">Permainan Sederhana Pembangun Kosakata</h4>
                <div className="text-indigo-300 text-[10px] font-medium">Baca 4 menit</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-20 h-20 bg-[url('https://images.unsplash.com/photo-1484665754804-74b091211472?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl flex-shrink-0"></div>
              <div className="flex flex-col justify-center">
                <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest mb-1">Psikologi</span>
                <h4 className="text-white font-bold text-xs leading-snug mb-1.5 group-hover:text-emerald-300 transition-colors">Kenali Tanda *Speech Delay* pada Balita</h4>
                <div className="text-indigo-300 text-[10px] font-medium">Baca 5 menit</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
