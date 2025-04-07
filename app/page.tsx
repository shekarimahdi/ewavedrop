"use client";

import { motion } from "framer-motion";
import { useAccount, useWalletClient, useSwitchChain } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x54c5D4216972Db0D12c0496c316f833B992cA176";
const contractABI = [
  {"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_airdropAmount","type":"uint256"},{"internalType":"uint256","name":"_feeAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"feeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_airdropAmount","type":"uint256"}],"name":"setAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_feeAmount","type":"uint256"}],"name":"setFeeAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const [claiming, setClaiming] = useState(false);
  const [contractFee, setContractFee] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);

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
        console.error("Error in receiving the fee amount:", err);
      }
    };

    fetchFeeAmount();
  }, [walletClient]);

  useEffect(() => {
    const bscTestnetChainId = 97;

    const bscTestnetParams = {
      chain: {  // این بخش اضافه شده است
        id: bscTestnetChainId,  // تغییر از 'chainId' به 'id'
        name: "Binance Smart Chain Testnet",
        nativeCurrency: {
          name: "BNB",
          symbol: "tBNB",
          decimals: 18
        },
        rpcUrls: {
          default: {
            http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"]
          }
        },
        blockExplorers: {
          default: {
            name: "BscScan",
            url: "https://testnet.bscscan.com"
          }
        }
      }
    };

    const ensureBscTestnet = async () => {
      if (!walletClient) return;

      try {
        if (walletClient.chain.id !== bscTestnetChainId) {
          await walletClient.addChain(bscTestnetParams);
          await walletClient.switchChain({ id: bscTestnetChainId });
        }
      } catch (err) {
        console.error("Network switch error:", err);
        alert("Please switch to Binance Smart Chain Testnet.");
      }
    };

    ensureBscTestnet();
  }, [walletClient]);

  useEffect(() => {
    let start = 0;
    const end = 55;
    const interval = setInterval(() => {
      start += 1;
      setCounter(start);
      if (start >= end) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const claimAirdrop = async () => {
    if (!walletClient || !isConnected || !address) {
      alert("Please connect your wallet.");
      return;
    }
    try {
      setClaiming(true);
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const fee = contractFee
        ? ethers.parseUnits(contractFee, "wei")
        : ethers.parseUnits("0.0142857", "ether");

      const tx = await contract.claimAirdrop({ value: fee, gasLimit: 500000 });
      await tx.wait();
      alert("Airdrop received successfully!");
    } catch (error) {
      console.error("Error while receiving airdrop:", error);
      alert("There was a problem receiving the airdrop.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('/bca.jpg')" }}
    >
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
        <h2 className="text-white text-lg font-bold text-center">
          You Can Claim <span className="text-yellow-400">Ewave Now!</span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-yellow-400 text-4xl font-extrabold text-center mt-4 pulse-glow"
        >
          <span className="ml-2">+{counter.toLocaleString()}</span>
          <span className="text-white text-xl font-medium ml-2">Participants so far</span>
        </motion.p>

        <p className="text-gray-300 mt-4 text-justify leading-relaxed text-sm">
          You can receive<span className="text-yellow-400">&nbsp;1000</span> $Ewave tokens with each claim.
        </p>
        <p className="text-gray-300 mt-2 text-justify leading-relaxed text-sm">
          🚀 This is more than just an airdrop — it’s your gateway to the next.
        </p>
        <p className="text-gray-300 mt-2 text-justify leading-relaxed text-sm">
          🌐 Backed by leading global enterprises and supported by world-class investors, our token is set to be listed on top-tier exchanges very soon.
        </p>
        <p className="text-gray-300 mt-2 text-justify leading-relaxed text-sm">
          🔒 To ensure fairness and prevent Sybil attacks, only the network gas fee is required — you pay nothing else.
        </p>
        <p className="text-gray-300 mt-2 text-justify leading-relaxed text-sm">
          💎 With real-world utility across our upcoming products and massive adoption ahead, the potential is truly.
        </p>
        <p className="text-gray-300 mt-2 text-justify leading-relaxed text-sm">
          🔥 Don’t miss your chance — <span className="text-yellow-400">claim now and be part of the revolution.</span>
        </p>

        <div className="flex justify-center">
          <button
            onClick={claimAirdrop}
            disabled={claiming || !isConnected}
            className="mt-4 w-3/4 bg-yellow-400 text-black font-semibold py-2 px-6 rounded-lg shadow hover:bg-yellow-500 transition"
          >
            {claiming ? "Receiving..." : "Claim Airdrop"}
          </button>
        </div>

        {isConnected && (
          <p className="text-xs text-center text-green-400 mt-4 break-all">
            Wallet Address: {address}
          </p>
        )}

        {!isConnected && (
          <p className="text-sm text-red-400 mt-3 text-center">
            Please connect your wallet first.
          </p>
        )}
      </motion.div>

      <div className="flex space-x-6 mt-6 mb-12 z-10">
        <a href="https://ewmarket.net/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md">
          <img src="/website.svg" alt="Website" className="w-6 h-6" />
          <span className="text-sm font-medium">Website</span>
        </a>
        <a href="https://t.me/ewave_chat/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md">
          <img src="/telegram.svg" alt="Telegram" className="w-6 h-6" />
          <span className="text-sm font-medium">Telegram</span>
        </a>
        <a href="https://x.com/ewave_market/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md">
          <img src="/x.svg" alt="X" className="w-6 h-6" />
          <span className="text-sm font-medium">X</span>
        </a>
        <a href="https://www.facebook.com/groups/594716753373448/?ref=share&mibextid=NSMWBT" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-md">
          <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
          <span className="text-sm font-medium">Facebook</span>
        </a>
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 0 0 0px rgba(255, 221, 0, 0.5);
          }
          50% {
            text-shadow: 0 0 15px rgba(255, 221, 0, 0.9);
          }
        }
        .pulse-glow {
          animation: pulseGlow 1.8s infinite;
        }

        @keyframes glowMove {
          0% {
            text-shadow: 0 0 4px #facc15, 0 0 8px #facc15;
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            text-shadow: 0 0 10px #fde047, 0 0 20px #fde047;
            transform: translateX(4px);
            opacity: 0.7;
          }
          100% {
            text-shadow: 0 0 4px #facc15, 0 0 8px #facc15;
            transform: translateX(0);
            opacity: 1;
          }
        }

        .glowing-link {
          animation: glowMove 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
