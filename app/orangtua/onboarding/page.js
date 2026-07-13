"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, QrCode, CheckCircle2, User, Target, Smartphone, PartyPopper } from "lucide-react";
import api from "@/services/backendApi";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relationship, setRelationship] = useState("");
  const [goals, setGoals] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Confetti effect trigger for step 3
  const [showConfetti, setShowConfetti] = useState(false);
  const [pairingCode, setPairingCode] = useState("");

  useEffect(() => {
    if (step === 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [step]);

  const toggleGoal = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  return (
    <div className="w-full min-h-screen bg-[#1E1B4B] font-sans flex flex-col relative overflow-x-hidden selection:bg-fuchsia-500/30">
      
      {/* Background Magical Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fuchsia-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      {/* Top Progress Bar */}
      <div className="w-full pt-12 px-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Langkah {step} dari 3</span>
          <span className="text-fuchsia-400 font-bold text-xs">Registrasi Anak</span>
        </div>
        <div className="w-full bg-indigo-950 rounded-full h-1.5 flex gap-1">
          <div className={`h-full rounded-full transition-all duration-500 ${step >= 1 ? 'bg-fuchsia-500 flex-1 shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-indigo-900 w-1/3'}`}></div>
          <div className={`h-full rounded-full transition-all duration-500 ${step >= 2 ? 'bg-fuchsia-500 flex-1 shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-indigo-900 w-1/3'}`}></div>
          <div className={`h-full rounded-full transition-all duration-500 ${step >= 3 ? 'bg-fuchsia-500 flex-1 shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-indigo-900 w-1/3'}`}></div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-6 pt-10 pb-20 relative z-10">
        
        {/* STEP 1: Profil Anak */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-6 border border-fuchsia-500/40">
              <User className="w-8 h-8 text-fuchsia-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 leading-tight">Siapa nama jagoan kecil Bunda?</h1>
            <p className="text-indigo-200 text-sm mb-8">Kami akan mempersonalisasi sapaan dan petualangan khusus untuknya.</p>
            
              <div className="space-y-4">
                {/* Nama */}
                <div>
                  <label className="text-indigo-300 font-bold text-xs mb-2 block uppercase tracking-wider">Nama Anak</label>
                  <input 
                    type="text" 
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Masukkan nama lengkap / panggilan"
                    className="w-full bg-[#2E1065] border-2 border-[#4C1D95] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-fuchsia-500 transition-all placeholder:text-indigo-400/50"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="text-indigo-300 font-bold text-xs mb-2 block uppercase tracking-wider">Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Laki-laki", "Perempuan"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                          gender === g
                            ? "bg-fuchsia-500 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                            : "bg-[#2E1065] border-[#4C1D95] text-indigo-300 hover:bg-[#3B177D]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tempat, Tanggal Lahir */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-indigo-300 font-bold text-xs mb-2 block uppercase tracking-wider">Tempat Lahir</label>
                    <input 
                      type="text" 
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      placeholder="Kota"
                      className="w-full bg-[#2E1065] border-2 border-[#4C1D95] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-fuchsia-500 transition-all placeholder:text-indigo-400/50"
                    />
                  </div>
                  <div>
                    <label className="text-indigo-300 font-bold text-xs mb-2 block uppercase tracking-wider">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-[#2E1065] border-2 border-[#4C1D95] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-fuchsia-500 transition-all text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Status dengan Anak */}
                <div>
                  <label className="text-indigo-300 font-bold text-xs mb-2 block uppercase tracking-wider">Status dengan Anda</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full bg-[#2E1065] border-2 border-[#4C1D95] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-fuchsia-500 transition-all appearance-none"
                  >
                    <option value="" disabled>Pilih Status</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Ayah">Ayah</option>
                    <option value="Wali">Wali</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

            <button 
              onClick={nextStep}
              disabled={!childName || !gender || !birthPlace || !birthDate || !relationship}
              className="w-full mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-950 font-black text-lg py-4 rounded-2xl shadow-[0_10px_25px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Lanjutkan <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Tujuan Belajar */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/40">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 leading-tight">Apa prioritas Bunda untuk {childName || 'Anak'}?</h1>
            <p className="text-indigo-200 text-sm mb-8">Pilih area yang ingin lebih sering dilatih. Bisa pilih lebih dari satu.</p>
            
            <div className="space-y-4 flex-1">
              {[
                { id: 'fonik', title: '🔤 Pengenalan Huruf (Fonik)', desc: 'Mengingat bentuk dan bunyi alfabet dasar.' },
                { id: 'bicara', title: '🗣️ Latihan Bicara & Kosakata', desc: 'Memperbanyak perbendaharaan kata.' },
                { id: 'logika', title: '🧩 Logika & Problem Solving', desc: 'Latihan menyortir, membandingkan, pola.' },
                { id: 'fokus', title: '🧘‍♂️ Fokus & Rentang Perhatian', desc: 'Melatih konsentrasi pada satu tugas.' }
              ].map((item) => {
                const isSelected = goals.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleGoal(item.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-[#10B981]/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-[#2E1065] border-[#4C1D95] hover:bg-[#3B177D]'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-indigo-400 bg-transparent'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-[#1E1B4B]" />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-emerald-300' : 'text-white'}`}>{item.title}</h3>
                      <p className="text-indigo-200 text-[11px] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {submitError && (
              <div className="w-full bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded-xl mt-4 text-sm text-center">
                {submitError}
              </div>
            )}
            <button 
              disabled={goals.length === 0 || isSubmitting}
              onClick={async () => {
                setSubmitError("");
                setIsSubmitting(true);
                try {
                  const res = await api.children.create({
                    name: childName,
                    gender: gender === "Laki-laki" ? "MALE" : "FEMALE",
                    birth_place: birthPlace,
                    birthdate: birthDate,
                    onboarding_profile: {
                      parent_relationship: relationship,
                      goals: goals
                    }
                  });
                  
                  const newChildId = res.id || res.data?.id;
                  if (newChildId) {
                     try {
                       const pRes = await api.children.generatePairingCode(newChildId);
                       const pCode = pRes.code || pRes.data?.code || pRes;
                       if (typeof pCode === 'string') setPairingCode(pCode);
                     } catch(e) {
                       console.error("Gagal buat pairing code:", e);
                     }
                  }
                  nextStep(); // Lanjut ke step 3 (Success & Pairing)
                } catch(e) {
                  console.error(e);
                  setSubmitError(e.message || "Gagal menyimpan data.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="w-full mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-950 font-black text-lg py-4 rounded-2xl shadow-[0_10px_25px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 3: Success & Pairing Code */}
        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-700 h-full flex flex-col items-center justify-center text-center relative mt-8">
            
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxjaXJjbGUgY3g9IjEwJSIgY3k9IjIwJSIgcj0iNCIgZmlsbD0iI2Y0M2Y1ZSIgLz48Y2lyY2xlIGN4PSI4MCUiIGN5PSIxMCUiIHI9IjMiIGZpbGw9IiMzYjgyZjYiIC8+PHBvbHlnb24gcG9pbnRzPSI1MCw1MCA1NSw2MCA0NSw2MCIgZmlsbD0iI2ZiYmYyNCIgLz48cmVjdCB4PSI4MCUiIHk9IjgwJSIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iIzEwYjk4MSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgODAlIDgwJSkiIC8+PC9zdmc+')] animate-ping opacity-50"></div>
              </div>
            )}

            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2rem] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(251,191,36,0.6)] transform rotate-12 relative z-10">
              <PartyPopper className="w-12 h-12 text-indigo-950" />
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2 leading-tight relative z-10">
              Hore! Profil Siap!
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed mb-6 max-w-xs relative z-10">
              Hubungkan ke perangkat {childName || 'Anak'} menggunakan kode ini.
            </p>
            
            <div className="bg-[#2E1065] border-2 border-cyan-500/50 rounded-[2rem] p-6 mb-8 w-full text-center relative overflow-hidden shadow-[0_20px_40px_rgba(34,211,238,0.2)]">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/30 blur-[50px]"></div>
               
               <p className="text-cyan-300 font-bold text-[10px] uppercase tracking-[0.3em] mb-3 relative z-10">Kode Penghubung (Pairing Code)</p>
               
               <div className="mt-4 relative z-10 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
                    {pairingCode ? (
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pairingCode)}`} alt="QR Code" className="w-32 h-32" />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 text-xs">Membuat QR...</div>
                    )}
                  </div>
                  
                  {pairingCode && (
                    <div className="mt-6 bg-[#1E1B4B]/80 px-6 py-3 rounded-full border border-cyan-500/30 flex items-center gap-3">
                      <span className="text-cyan-200 text-xs">Ketik kode pendek ini:</span>
                      <span className="text-2xl font-black text-cyan-400 tracking-widest">{pairingCode}</span>
                    </div>
                  )}
               </div>
            </div>
            
            <button 
              onClick={() => router.push('/orangtua')}
              className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-black text-lg py-4 rounded-2xl shadow-[0_10px_25px_rgba(217,70,239,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 relative z-10"
            >
              Masuk ke Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
