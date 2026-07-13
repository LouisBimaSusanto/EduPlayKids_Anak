"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/backendApi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function ParentLoginPage() {
  const router = useRouter();
  const { loginWithToken, loginAsDemo, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/orangtua");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push("/orangtua");
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      
      const token = response.data?.access_token || response.access_token;
      if (token) {
        const success = await loginWithToken(token);
        if (success) {
          router.push("/orangtua");
        } else {
          setError("Gagal memuat profil setelah login.");
        }
      }
    } catch (err) {
      setError(err.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setIsLoading(true);
    try {
      const idToken = credentialResponse.credential;
      
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        localStorage.setItem("google_name", payload.name || "");
        localStorage.setItem("google_email", payload.email || "");
        localStorage.setItem("google_picture", payload.picture || "");
        
        // Coba login normal
        const response = await api.auth.googleLogin({ idToken: idToken });
        const googleToken = response.data?.access_token || response.access_token;
        if (googleToken) {
          const success = await loginWithToken(googleToken);
          if (success) {
            router.push("/orangtua");
            return;
          }
        }
      } catch (loginErr) {
        // Jika backend menolak karena email belum terdaftar, kita lakukan AUTO REGISTER!
        if (loginErr.message?.toLowerCase().includes("tidak ditemukan")) {
           try {
             // Ekstrak data dari Google JWT
             const payload = JSON.parse(atob(idToken.split('.')[1]));
             const autoPassword = `GoogleOauth_${payload.sub}!`; // Password acak yang kuat
             
             // Daftarkan ke backend
             await api.auth.register({ 
               name: payload.name || "Pengguna Google", 
               email: payload.email, 
               password: autoPassword 
             });
             
             // Login manual dengan akun yang baru saja dibuat
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
             throw new Error("Gagal mendaftarkan akun Google secara otomatis: " + autoRegErr.message);
           }
        } else {
           throw loginErr; // Lemparkan error asli jika bukan karena email tidak ditemukan
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal login dengan Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <main className="relative min-h-screen bg-[#1E1B4B] flex items-center justify-center p-4 font-sans">
        {/* Background Magic */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#312E81] to-transparent opacity-80"></div>
          <div className="absolute bottom-0 w-full h-64 bg-[radial-gradient(ellipse_at_bottom,_rgba(79,70,229,0.3)_0%,_transparent_70%)] mix-blend-screen" />
        </div>
        
        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-indigo-400">
              🦉
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Parent Hub
          </h1>
          <p className="text-center text-indigo-200 mb-8">
            Masuk untuk memantau perkembangan belajar anak Anda.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-indigo-100 font-semibold mb-2">Alamat Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 outline-none text-white placeholder-white/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-indigo-100 font-semibold mb-2">Kata Sandi</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 outline-none text-white placeholder-white/40 transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 font-bold text-white transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink-0 mx-4 text-indigo-300 text-sm font-medium">Atau masuk dengan</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          {/* Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 hover:border-amber-400 text-amber-300 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 mb-3"
          >
            <span>🎭</span> Coba Akun Demo
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink-0 mx-4 text-indigo-300 text-sm font-medium">Atau Google</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <div className="flex justify-center w-full min-h-[40px] items-center">
            {isLoading ? (
               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
               <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full [&_iframe]:w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Login gagal atau ditutup.")}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    width="100%"
                  />
               </div>
            )}
          </div>

          <p className="text-center text-indigo-300 text-sm mt-8">
            Belum punya akun?{" "}
            <a href="/orangtua/register" className="text-indigo-300 font-bold hover:text-white underline underline-offset-4 transition-colors">
              Daftar di sini
            </a>
          </p>

        </div>
      </main>
    </GoogleOAuthProvider>
  );
}

