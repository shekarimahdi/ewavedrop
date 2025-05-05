"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Home() {
  const { isConnected, address } = useAccount();

  // State برای مدیریت ذرات آتش
  const [particles, setParticles] = useState<number[]>([]);

  // اضافه کردن ذرات آتش به صفحه
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [...prev, Date.now()]); // هر بار یک ذره جدید اضافه می‌کنیم
    }, 200); // فاصله زمانی برای اضافه کردن ذرات
    return () => clearInterval(interval); // تمیز کردن interval
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage: "url('/bcfire.png'), url('/19Nx.gif')",
        backgroundPosition: "center, center",  // موقعیت هر تصویر
        backgroundSize: "cover, cover" // اندازه هر تصویر
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Header */}
      <header className="absolute top-4 left-4 flex flex-col items-start space-y-1 z-10">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-white font-bold text-lg">
            <span className="text-gray-300">Ewave</span>
            <span className="text-yellow-400">Airdrop</span>
          </h1>
        </div>
        <a
          href="https://ewmarket.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-yellow-400 text-sm font-semibold glowing-link"
        >
          Our Website & WhitePaper
        </a>
      </header>

      {/* Wallet Connect */}
      <div className="absolute top-4 right-4 z-10">
        <w3m-button />
      </div>

      {/* Burned Message */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 bg-black/70 backdrop-blur-md p-6 rounded-xl border border-red-700 shadow-2xl w-full max-w-lg mt-32 mb-10 overflow-hidden"
      >
        <h2 className="text-red-600 text-4xl font-extrabold text-center tracking-widest fire-glow z-10 relative">
          Ewave Airdrop 🔥 Burned
        </h2>

        <p className="text-gray-300 mt-6 text-center text-base italic relative z-10">
          The legendary Ewave Airdrop is officially over. Forever.
        </p>

        <p className="text-orange-500 mt-3 text-center text-sm relative z-10">
          🔥 This opportunity is now history — thank you for being part of it.
        </p>

        <div className="flex justify-center mt-6 relative z-10">
          <button
            disabled
            className="w-3/4 bg-red-800/50 text-gray-400 cursor-not-allowed font-semibold py-2 px-6 rounded-lg border border-red-600 opacity-60"
          >
            Airdrop Ended
          </button>
        </div>

        {isConnected && (
          <p className="text-xs text-center text-gray-500 mt-4 break-all relative z-10">
            Wallet Address: {address}
          </p>
        )}
      </motion.div>

      {/* Footer */}
      <div className="flex space-x-6 mt-6 mb-12 z-10">
        <a
          href="https://ewmarket.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md"
        >
          <img src="/website.svg" alt="Website" className="w-6 h-6" />
          <span className="text-sm font-medium">Website</span>
        </a>
        <a
          href="https://t.me/ewave_chat/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md"
        >
          <img src="/telegram.svg" alt="Telegram" className="w-6 h-6" />
          <span className="text-sm font-medium">Telegram</span>
        </a>
        <a
          href="https://x.com/ewave_market/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md"
        >
          <img src="/x.svg" alt="X" className="w-6 h-6" />
          <span className="text-sm font-medium">X</span>
        </a>
        <a
          href="https://www.facebook.com/groups/594716753373448/?ref=share&mibextid=NSMWBT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md"
        >
          <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
          <span className="text-sm font-medium">Facebook</span>
        </a>
      </div>

      {/* ذرات آتش معلق */}
      <div className="particle-container">
        {particles.map((particleId) => (
          <div key={particleId} className="particle"></div>
        ))}
      </div>
    </main>
  );
}
