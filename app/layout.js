import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata = {
  title: "EduPlay Kids Nusantara",
  description: "Dunia Suku Kata - Petualangan Nusantara",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduPlay Kids",
  },
};

export const viewport = {
  themeColor: "#1B0F40",
};

import { CurtainSplashScreen } from "@/components/ui/CurtainSplashScreen";

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${baloo.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <CurtainSplashScreen />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
