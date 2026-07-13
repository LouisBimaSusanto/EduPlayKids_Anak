"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/backendApi";

const AuthContext = createContext();

// Data akun demo untuk testing tanpa backend
const DEMO_USER = {
  id: "demo_parent_001",
  name: "Orang Tua Demo",
  email: "demo@eduplaykids.com",
  role: "parent",
  children: [
    {
      id: "demo_child_001",
      name: "Ara Demo",
      age_range: "5-6 Thn",
      module: "fonik",
      current_level: 2,
      avatar: "🦊",
    }
  ],
  is_demo: true,
};

const DEMO_CHILD_USER = {
  id: "demo_child_001",
  name: "Ara Demo",
  age_range: "5-6 Thn",
  module: "fonik",
  current_level: 2,
  avatar: "🦊",
  role: "child",
  is_demo: true,
};

// Kode pairing demo yang bisa dipakai anak
export const DEMO_PAIRING_CODE = "DEMO-KID";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
  // Cek apakah sedang mode demo (anak)
      const isDemoChild = localStorage.getItem("is_demo_child");
      if (isDemoChild === "true") {
        setUser(DEMO_CHILD_USER);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Cek apakah sedang mode demo (orang tua)
      const isDemo = localStorage.getItem("is_demo");
      if (isDemo === "true") {
        setUser(DEMO_USER);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await api.auth.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Gagal mendapatkan profil:", error);
          // Jika token tidak valid / expired
          localStorage.removeItem("access_token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginAsDemo = () => {
    localStorage.setItem("is_demo", "true");
    localStorage.removeItem("access_token");
    localStorage.removeItem("is_demo_child");
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    return true;
  };

  const loginAsDemoChild = () => {
    localStorage.setItem("is_demo_child", "true");
    localStorage.removeItem("access_token");
    localStorage.removeItem("is_demo");
    setUser(DEMO_CHILD_USER);
    setIsAuthenticated(true);
    return true;
  };

  const loginWithToken = async (token) => {
    localStorage.setItem("access_token", token);
    try {
      const userData = await api.auth.getMe();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Gagal verifikasi login:", error);
      localStorage.removeItem("access_token");
      return false;
    }
  };

  const loginWithPairingCode = async (code) => {
    // Mode demo: cek kode pairing demo
    if (code.toUpperCase() === DEMO_PAIRING_CODE) {
      return loginAsDemoChild();
    }
    try {
      const response = await api.auth.childLogin({ pairing_code: code });
      const token = response.access_token || response.data?.access_token;
      if (!token) throw new Error("Token tidak ditemukan di response");
      return await loginWithToken(token);
    } catch (error) {
      console.error("Gagal login dengan pairing code:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("is_demo");
    localStorage.removeItem("is_demo_child");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, loginWithToken, loginWithPairingCode, loginAsDemo, loginAsDemoChild, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
