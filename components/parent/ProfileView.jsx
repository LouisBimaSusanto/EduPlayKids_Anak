"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/backendApi";

export function ProfileView() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [googleData, setGoogleData] = useState({ name: "", email: "", picture: "" });
  const [pairingCode, setPairingCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGoogleData({
        name: localStorage.getItem("google_name") || "",
        email: localStorage.getItem("google_email") || "",
        picture: localStorage.getItem("google_picture") || "",
      });
      
      const fetchPairingCode = async () => {
        try {
          // Asumsi backend mereturn response format: { data: { code: "KID-MGU" } } atau string langsung
          const children = await api.children.getAll();
          const childData = children.data || children;
          
          if (Array.isArray(childData) && childData.length > 0) {
            const firstChildId = childData[0].id;
            
            // Coba ambil dari properties child dulu jika backend sudah menyisipkan pairing_code
            if (childData[0].pairing_code) {
              setPairingCode(childData[0].pairing_code);
            } else {
              // Panggil endpoint generate jika belum ada
              const response = await api.children.generatePairingCode(firstChildId);
              const generatedCode = response.code || response.data?.code || response;
              if (typeof generatedCode === 'string') {
                setPairingCode(generatedCode);
              }
            }
          }
        } catch (err) {
          console.error("Gagal memuat pairing code dari backend:", err);
          // Fallback tampilan error atau kosong
        }
      };
      
      if (localStorage.getItem("access_token")) {
        fetchPairingCode();
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("google_name");
      localStorage.removeItem("google_email");
      localStorage.removeItem("google_picture");
    }
    logout();
    router.push("/orangtua/login");
  };

  return (
    <div className="p-6 pt-12 pb-32 w-full animate-fade-in font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white drop-shadow-md">Profil Anda</h1>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl mb-6 flex flex-col items-center">
        {googleData.picture ? (
          <img 
            src={googleData.picture} 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg mb-4 object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg mb-4">
            <span className="text-4xl text-white font-bold uppercase">
              {(user?.name || googleData.name) ? (user?.name || googleData.name).charAt(0) : "O"}
            </span>
          </div>
        )}
        <h2 className="text-2xl font-bold text-white mb-1">{user?.name || googleData.name || "Orang Tua"}</h2>
        <div className="flex items-center gap-2 text-indigo-200 bg-indigo-900/40 px-3 py-1 rounded-full text-sm">
          <Shield className="w-4 h-4" />
          <span>Akun {user?.role || "Parent"}</span>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl mb-8 space-y-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Informasi Akun</h3>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-0.5">Nama Lengkap</p>
            <p className="text-white font-medium">{user?.name || googleData.name || "Belum diatur"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-0.5">Alamat Email</p>
            <p className="text-white font-medium">{user?.email || googleData.email || "Belum ada email"}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl mb-8 space-y-4 text-center">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-left">Kode Penghubung Anak</h3>
        <p className="text-indigo-200 text-xs mb-4 text-left">Gunakan QR Code atau Kode Pendek ini di HP/Tablet Anak untuk terhubung dengan profil Anda.</p>
        
        <div className="bg-white p-3 rounded-xl inline-block shadow-lg mx-auto">
          {pairingCode ? (
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pairingCode)}`} alt="QR Code" className="w-32 h-32 mx-auto" />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center px-2">Memuat QR Code...<br/>(Pastikan API Backend Siap)</div>
          )}
        </div>
        
        {pairingCode && (
          <div className="mt-4 bg-[#1E1B4B]/80 px-6 py-3 rounded-2xl border border-cyan-500/30 inline-block w-full">
            <span className="text-cyan-200 text-xs block mb-1">Atau Ketik Kode Pendek Ini:</span>
            <span className="text-3xl font-black text-cyan-400 tracking-widest">{pairingCode}</span>
          </div>
        )}
      </div>

      <button 
        onClick={() => router.push('/')}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 border border-emerald-400 text-white font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_20px_rgba(16,185,129,0.3)] mb-4"
      >
        <span className="text-2xl">🎮</span>
        Mainkan EduplayKids (Mode Anak)
      </button>

      <button 
        onClick={handleLogout}
        className="w-full py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_20px_rgba(239,68,68,0.2)]"
      >
        <LogOut className="w-5 h-5" />
        Keluar dari Akun
      </button>
    </div>
  );
}
