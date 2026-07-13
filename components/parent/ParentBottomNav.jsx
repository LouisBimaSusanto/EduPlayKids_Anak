"use client";

import { Home, BarChart2, BookOpen, User, Layers } from "lucide-react";

export function ParentBottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "Beranda", icon: Home, label: "Beranda" },
    { id: "Analitik", icon: BarChart2, label: "Raport" },
    { id: "Hub Edukasi", icon: BookOpen, label: "Edukasi" },
    { id: "Modul", icon: Layers, label: "Modul" },
    { id: "Profil", icon: User, label: "Profil" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md z-50 rounded-t-[2rem] bg-[#2E1065] border-t-[3px] border-[#4C1D95] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center transition-transform active:scale-95 w-16"
            >
              {/* Active Tab Glow & Background */}
              <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] shadow-[0_0_15px_rgba(139,92,246,0.6)] border-b-4 border-[#4C1D95] -translate-y-2" 
                  : "bg-transparent text-[#6B7280] hover:text-[#A78BFA]"
              }`}>
                <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-indigo-300"}`} />
              </div>
              
              {/* Label */}
              <span className={`text-[10px] font-bold mt-1 transition-colors ${
                isActive ? "text-yellow-400 drop-shadow-md" : "text-indigo-400"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
