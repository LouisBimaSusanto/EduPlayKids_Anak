"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ParentBottomNav } from "@/components/parent/ParentBottomNav";
import api from "@/services/backendApi";
import { HomeView } from "@/components/parent/HomeView";
import { MonitoringView } from "@/components/parent/MonitoringView";
import { ContentHubView } from "@/components/parent/ContentHubView";
import { ProfileView } from "@/components/parent/ProfileView";
import { ModuleSelectionView } from "@/components/parent/ModuleSelectionView";

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("Beranda");
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [checkingChildren, setCheckingChildren] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/orangtua/login");
    } else if (!isLoading && isAuthenticated) {
      // Mode demo: langsung masuk tanpa cek API
      if (user?.is_demo) {
        setCheckingChildren(false);
        return;
      }
      // Periksa apakah orang tua sudah memiliki anak
      api.children.getAll()
        .then((res) => {
          const childrenData = res.data || res;
          if (Array.isArray(childrenData) && childrenData.length === 0) {
            router.push("/orangtua/onboarding");
          } else {
            setCheckingChildren(false);
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil data anak:", err);
          setCheckingChildren(false);
        });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || checkingChildren) {
    return <div className="min-h-screen bg-[#1E1B4B] flex items-center justify-center text-white font-bold animate-pulse">Memuat...</div>;
  }

  return (
    <div className="max-w-md mx-auto w-full min-h-screen relative pb-32 shadow-2xl overflow-x-hidden font-sans bg-[#1E1B4B]">
      
      {/* Magical Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#312E81] to-transparent opacity-80"></div>
        {/* Floating Stars */}
        <div className="absolute top-12 left-8 text-yellow-300/40 text-xl animate-pulse">✦</div>
        <div className="absolute top-24 right-12 text-yellow-300/30 text-2xl animate-pulse" style={{animationDelay: '1s'}}>✦</div>
        <div className="absolute top-64 left-1/4 text-white/20 text-lg animate-pulse" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="absolute top-48 right-1/4 text-fuchsia-400/30 text-3xl animate-bounce" style={{animationDuration: '3s'}}>✦</div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full">
        {activeTab === "Beranda" && <HomeView />}
        {activeTab === "Analitik" && <MonitoringView />}
        {activeTab === "Hub Edukasi" && <ContentHubView />}
        {activeTab === "Modul" && <ModuleSelectionView />}
        {activeTab === "Profil" && <ProfileView />}
        
        {/* Placeholder */}
        {["Komunitas"].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Segera Datang! 🚀</h2>
            <p className="text-indigo-200">Fitur magis ini sedang dimasak.</p>
          </div>
        )}
      </div>

      {/* Chunky Magical Navigation */}
      <ParentBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}
