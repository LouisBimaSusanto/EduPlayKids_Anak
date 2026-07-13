"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/backendApi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";

export default function ParentRegisterPage() {
  const router = useRouter();
  const { loginWithToken, isAuthenticated, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState(1); // 1 = isi form, 2 = sukses
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/orangtua");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const registerResponse = await api.auth.register({ name, email, password });

      // Jika backend langsung mengembalikan token setelah register
      const regToken = registerResponse.data?.access_token || registerResponse.access_token;
      if (regToken) {
        const success = await loginWithToken(regToken);
        if (success) {
          router.push("/orangtua");
          return;
        }
      }

      // Jika backend TIDAK mengembalikan token, otomatis login pakai email+password yang baru
      const loginResponse = await api.auth.login({ email, password });
      const loginToken = loginResponse.data?.access_token || loginResponse.access_token;
      if (loginToken) {
        const success = await loginWithToken(loginToken);
        if (success) {
          router.push("/orangtua");
          return;
        }
      }

      // Fallback terakhir: redirect ke halaman login
      router.push("/orangtua/login");
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Coba gunakan email lain.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    setError("");
    setIsLoading(true);
    try {
      const idToken = credentialResponse.credential;
      
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        localStorage.setItem("google_name", payload.name || "");
        localStorage.setItem("google_email", payload.email || "");
        localStorage.setItem("google_picture", payload.picture || "");
        
        // Coba login dulu
        const response = await api.auth.googleLogin({ idToken });
        const googleToken = response.data?.access_token || response.access_token;
        if (googleToken) {
          const success = await loginWithToken(googleToken);
          if (success) {
            router.push("/orangtua");
            return;
          }
        }
      } catch (loginErr) {
        // Jika belum terdaftar, kita daftarkan otomatis (Auto Register)
        if (loginErr.message?.toLowerCase().includes("tidak ditemukan")) {
           try {
             const payload = JSON.parse(atob(idToken.split('.')[1]));
             const autoPassword = `GoogleOauth_${payload.sub}!`;
             
             // Register via endpoint normal
             await api.auth.register({ 
               name: payload.name || "Pengguna Google", 
               email: payload.email, 
               password: autoPassword 
             });
             
             // Langsung login manual untuk dapat token
             const loginResponse = await api.auth.login({ email: payload.email, password: autoPassword });
             const autoLoginToken = loginResponse.data?.access_token || loginResponse.access_token;
             if (autoLoginToken) {
               const success = await loginWithToken(autoLoginToken);
               if (success) {
                 router.push("/orangtua");
                 return;
               }
             }
           } catch (autoRegErr) {
             throw new Error("Gagal auto-register dari Google: " + autoRegErr.message);
           }
        } else {
           throw loginErr;
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mendaftar dengan Google.");
    } finally {
      setIsLoading(false);
    }
  };

  // === STEP 2: Sukses ===
  if (step === 2) {
    return (
      <main className="relative min-h-screen bg-[#1E1B4B] flex items-center justify-center p-4 font-sans">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#312E81] to-transparent opacity-80" />
          <div className="absolute bottom-0 w-full h-64 bg-[radial-gradient(ellipse_at_bottom,_rgba(79,70,229,0.3)_0%,_transparent_70%)] mix-blend-screen" />
        </div>
        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-green-500/20 border-4 border-green-400 rounded-full flex items-center justify-center text-5xl animate-bounce">
            🎉
          </div>
          <h1 className="text-3xl font-bold text-white">Pendaftaran Berhasil!</h1>
          <p className="text-indigo-200 leading-relaxed">
            Akun Anda telah berhasil dibuat. Silakan masuk menggunakan email dan kata sandi yang baru saja Anda daftarkan.
          </p>
          <Link
            href="/orangtua/login"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 font-bold text-white text-center transition-all shadow-lg shadow-indigo-500/30"
          >
            Masuk Sekarang →
          </Link>
        </div>
      </main>
    );
  }

  // === STEP 1: Form Register ===
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <main className="relative min-h-screen bg-[#1E1B4B] flex items-center justify-center p-4 font-sans">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#312E81] to-transparent opacity-80" />
          {/* Animated orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 w-full h-64 bg-[radial-gradient(ellipse_at_bottom,_rgba(79,70,229,0.3)_0%,_transparent_70%)] mix-blend-screen" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

            {/* Icon & Title */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-indigo-400 animate-[bounce_3s_infinite]">
                🦉
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-white mb-1">
              Daftar sebagai Orang Tua
            </h1>
            <p className="text-center text-indigo-200 mb-8 text-sm">
              Buat akun untuk memantau perjalanan belajar anak Anda.
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div>
                <label className="block text-indigo-100 font-semibold mb-2 text-sm">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth: Ibu Siti Rahayu"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-indigo-100 font-semibold mb-2 text-sm">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-indigo-100 font-semibold mb-2 text-sm">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors text-lg"
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-indigo-100 font-semibold mb-2 text-sm">Konfirmasi Kata Sandi</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  required
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-400 focus:border-red-400"
                      : confirmPassword && confirmPassword === password
                      ? "border-green-400 focus:border-green-400"
                      : "border-white/20 focus:border-indigo-400"
                  }`}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-red-400 text-xs mt-1 ml-1">⚠️ Kata sandi tidak cocok</p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="text-green-400 text-xs mt-1 ml-1">✅ Kata sandi cocok</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 font-bold text-white transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Daftar Sekarang →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-7 items-center">
              <div className="flex-grow border-t border-white/20" />
              <span className="flex-shrink-0 mx-4 text-indigo-300 text-sm">Atau daftar dengan</span>
              <div className="flex-grow border-t border-white/20" />
            </div>

            {/* Google Login */}
            <div className="flex justify-center w-full min-h-[40px] items-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleRegister}
                    onError={() => setError("Google Login gagal atau ditutup.")}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="signup_with"
                    width="100%"
                  />
                </div>
              )}
            </div>

            {/* Link ke Login */}
            <p className="text-center text-indigo-300 text-sm mt-8">
              Sudah punya akun?{" "}
              <Link href="/orangtua/login" className="text-indigo-300 font-bold hover:text-white underline underline-offset-4 transition-colors">
                Masuk di sini
              </Link>
            </p>

          </div>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}
