"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, DEMO_PAIRING_CODE } from "@/context/AuthContext";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithToken, loginWithPairingCode } = useAuth();
  
  const [tokenInput, setTokenInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanMode, setScanMode] = useState(false);
  
  // We use a ref to prevent double-initialization in React StrictMode
  const scannerRef = useRef(null);

  // Redirect if already logged in
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (scanMode) {
      // Setup Scanner
      const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
      const scanner = new Html5QrcodeScanner("reader", config, false);
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          // Sukses scan
          scanner.clear();
          setScanMode(false);
          
          if (decodedText.startsWith("eyJ")) {
            handleLoginWithToken(decodedText);
          } else {
            handleLoginWithPairingCode(decodedText);
          }
        },
        (err) => {
          // Ignored (it scans continuously)
        }
      );

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
        }
      };
    }
  }, [scanMode]);

  const handleLoginWithPairingCode = async (code) => {
    setError("");
    setIsLoading(true);
    try {
      const success = await loginWithPairingCode(code);
      if (success) {
        router.push("/");
      } else {
        setError("Gagal masuk. Pastikan kode (contoh: KID-8X2) benar dan valid.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithToken = async (tokenString) => {
    setError("");
    setIsLoading(true);
    try {
      const success = await loginWithToken(tokenString);
      if (success) {
        router.push("/");
      } else {
        setError("Gagal masuk. QR Code tidak valid atau kadaluarsa.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitManual = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setError("Kode tidak boleh kosong.");
      return;
    }
    
    let tokenToUse = tokenInput.trim();
    
    if (tokenToUse.startsWith("eyJ")) {
      handleLoginWithToken(tokenToUse);
    } else {
      handleLoginWithPairingCode(tokenToUse);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-t from-[#F5A623] via-[#8E2DE2] to-[#1B0F40] flex items-center justify-center p-4">
      {/* Bioluminescent ground glow */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,229,200,0.2)_0%,_transparent_70%)] mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md bg-[#FFF5E0] rounded-[2rem] border-[8px] border-[#FFD700] border-b-[16px] border-b-[#B8860B] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
        
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-[bounce_2s_infinite]">
          📷
        </div>

        <h1 className="text-3xl font-black text-center text-[#3D1F0A] drop-shadow-[0_2px_0_#FFF] mt-4 mb-2">
          Masuk ke Dunia
        </h1>
        <p className="text-center text-[#5A3A22] font-semibold mb-6">
          Minta Ayah/Bunda untuk memunculkan Kode Rahasia!
        </p>

        {error && (
          <div className="w-full bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 font-bold text-sm text-center">
            {error}
          </div>
        )}

        {/* Banner Kode Demo */}
        <div className="w-full bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-3 mb-4 text-center">
          <p className="text-amber-800 font-bold text-xs mb-1">🎭 Mode Demo</p>
          <p className="text-amber-700 text-xs">Gunakan kode pairing:</p>
          <p
            className="text-amber-900 font-black text-xl tracking-widest mt-1 cursor-pointer hover:text-amber-600 transition-colors"
            onClick={() => setTokenInput(DEMO_PAIRING_CODE)}
            title="Klik untuk mengisi otomatis"
          >
            {DEMO_PAIRING_CODE}
          </p>
          <p className="text-amber-600 text-xs mt-1">(Klik kode di atas untuk mengisi otomatis)</p>
        </div>

        {scanMode ? (
          <div className="w-full flex flex-col items-center mb-4">
            <div id="reader" className="w-full rounded-2xl overflow-hidden border-4 border-[#C87A3E]"></div>
            <button 
              onClick={() => setScanMode(false)}
              className="mt-4 text-[#C87A3E] font-bold text-sm hover:underline"
            >
              Batal Scan
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setScanMode(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5C8] to-[#00FFD1] border-b-[6px] border-[#008A79] active:border-b-0 active:translate-y-[6px] font-black text-[#1A2E26] text-xl transition-all shadow-lg flex items-center justify-center gap-3 mb-6"
          >
            <span className="text-3xl">📷</span>
            Scan QR Code
          </button>
        )}

        {!scanMode && (
          <>
            <div className="relative flex py-4 items-center w-full">
              <div className="flex-grow border-t-2 border-[#C87A3E]"></div>
              <span className="flex-shrink-0 mx-4 text-[#C87A3E] font-bold">Atau Masukkan Manual</span>
              <div className="flex-grow border-t-2 border-[#C87A3E]"></div>
            </div>

            <form onSubmit={handleSubmitManual} className="w-full flex flex-col gap-4">
              <input 
                type="text" 
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Ketikan Kode Token..."
                required
                className="w-full px-4 py-3 rounded-xl border-4 border-[#C87A3E] focus:border-[#FFD700] outline-none text-center font-bold text-[#3D1F0A] overflow-hidden"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFB300] border-b-[6px] border-[#B8860B] active:border-b-0 active:translate-y-[6px] font-black text-[#3D1F0A] text-xl transition-all disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </>
        )}

      </div>

      <style jsx global>{`
        /* Override default html5-qrcode styles to fit our aesthetic */
        #reader { border: none !important; }
        #reader__dashboard_section_csr span { font-family: inherit; color: #3D1F0A; font-weight: bold; }
        #reader button { 
          background: #FFD700; color: #3D1F0A; border: none; font-weight: bold; 
          padding: 8px 16px; border-radius: 8px; margin-top: 10px; cursor: pointer;
        }
        #reader select { padding: 4px 8px; border-radius: 8px; border: 2px solid #C87A3E; margin-bottom: 10px; }
      `}</style>
    </main>
  );
}
