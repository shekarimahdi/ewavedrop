"use client";

import { motion } from "framer-motion";
import { useAccount, useWalletClient, useSwitchChain } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x9DCf967c2d2c60f72B0ac984f57097858eA700f6";
const contractABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_airdropAmount","type":"uint256"},{"internalType":"uint256","name":"_feeAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"feeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_airdropAmount","type":"uint256"}],"name":"setAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feeAmount","type":"uint256"}],"name":"setFeeAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const [claiming, setClaiming] = useState(false);
  const [contractFee, setContractFee] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const countdownEndDate = new Date("2025-05-03T12:00:00Z"); // تاریخ ثابت شده

  /*
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const end = 1892;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
  
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.round(progress * end);
      setCounter(currentValue);
  
      if (frame >= totalFrames) {
        clearInterval(interval);
        setCounter(end);
      }
    }, frameRate);
  
    return () => clearInterval(interval);
  }, []);
  */

  useEffect(() => {
    const fetchFeeAmount = async () => {
      if (!walletClient) return;
      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const fee = await contract.feeAmount();
        setContractFee(fee.toString());
      } catch (err) {
        console.error("Error fetching fee amount:", err);
      }
    };
    fetchFeeAmount();
  }, [walletClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownEndDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const claimAirdrop = async () => {
    alert("Claim is currently disabled. Please wait for Chance Again!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-cover bg-center relative px-4" style={{ backgroundImage: "url('/bca.jpg')" }}>
      <div className="absolute inset-0 bg-black/60 z-0" />

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

      <div className="absolute top-4 right-4 z-10">
        <w3m-button />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-yellow-500 shadow-2xl w-full max-w-lg mt-32 mb-10"
      >
        <h2 className="text-white text-lg font-bold text-center mb-6">
          🎯 Chance Again Starts In:
        </h2>

        <div className="flex justify-center gap-6 text-yellow-400 text-2xl font-extrabold">
          <div className="flex flex-col items-center">
            <span>{timeLeft.days}</span>
            <span className="text-sm text-white">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{timeLeft.hours}</span>
            <span className="text-sm text-white">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{timeLeft.minutes}</span>
            <span className="text-sm text-white">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{timeLeft.seconds}</span>
            <span className="text-sm text-white">Seconds</span>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-yellow-400 text-4xl font-extrabold text-center mt-8 pulse-glow"
        >
          Chance Again
        </motion.p>

        <div className="flex justify-center">
          <button
            onClick={claimAirdrop}
            disabled
            className="mt-6 w-3/4 bg-yellow-400/30 text-black font-semibold py-2 px-6 rounded-lg shadow hover:bg-yellow-400/40 transition opacity-50 cursor-not-allowed"
          >
            Claim Airdrop
          </button>
        </div>

        {isConnected && (
          <p className="text-xs text-center text-green-400 mt-4 break-all">
            Wallet Address: {address}
          </p>
        )}
      </motion.div>

      <div className="flex space-x-6 mt-6 mb-12 z-10">
        <a href="https://ewmarket.net/" target="_blank" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-md">
          <img src="/website.svg" alt="Website" className="w-6 h-6" />
          <span className="text-sm font-medium">Website</span>
        </a>
        <a href="https://t.me/ewave_chat/" target="_blank" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-md">
          <img src="/telegram.svg" alt="Telegram" className="w-6 h-6" />
          <span className="text-sm font-medium">Telegram</span>
        </a>
        <a href="https://x.com/ewave_market/" target="_blank" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-md">
          <img src="/x.svg" alt="X" className="w-6 h-6" />
          <span className="text-sm font-medium">X</span>
        </a>
        <a href="https://www.facebook.com/groups/594716753373448/?ref=share&mibextid=NSMWBT" target="_blank" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-md">
          <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
          <span className="text-sm font-medium">Facebook</span>
        </a>
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 0px rgba(255, 221, 0, 0.5); }
          50% { text-shadow: 0 0 15px rgba(255, 221, 0, 0.9); }
        }
        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }

        @keyframes glowMove {
          0% { text-shadow: 0 0 4px #facc15, 0 0 8px #facc15; }
          50% { text-shadow: 0 0 12px #fde047, 0 0 24px #fde047; }
          100% { text-shadow: 0 0 4px #facc15, 0 0 8px #facc15; }
        }
        .glowing-link {
          animation: glowMove 3s ease-in-out infinite;
          transition: all 0.3s ease;
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
