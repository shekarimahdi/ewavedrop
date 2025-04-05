"use client";

import { useAccount, useWalletClient } from "wagmi";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x54c5D4216972Db0D12c0496c316f833B992cA176";
const contractABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_airdropAmount","type":"uint256"},{"internalType":"uint256","name":"_feeAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"feeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_airdropAmount","type":"uint256"}],"name":"setAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feeAmount","type":"uint256"}],"name":"setFeeAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [claiming, setClaiming] = useState(false);
  const [contractFee, setContractFee] = useState<string | null>(null);

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
        console.error("خطا در دریافت مقدار کارمزد:", err);
      }
    };

    fetchFeeAmount();
  }, [walletClient]);

  const claimAirdrop = async () => {
    if (!walletClient || !isConnected || !address) {
      alert("ابتدا والت خود را متصل کنید.");
      return;
    }

    try {
      setClaiming(true);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const fee = contractFee ?? ethers.parseUnits("0.0142857", "ether");
      const tx = await contract.claimAirdrop({ value: fee });

      await tx.wait();
      alert("ایردراپ با موفقیت دریافت شد!");
    } catch (error) {
      console.error("خطا هنگام دریافت ایردراپ:", error);
      alert("مشکلی در دریافت ایردراپ پیش آمد.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bca.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <header className="absolute top-4 left-4 flex items-center space-x-2 z-10">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-white font-bold text-lg">
          <span className="text-gray-300">Ewave</span>
          <span className="text-yellow-400">Airdrop</span>
        </h1>
      </header>

      <div className="absolute top-4 right-4 z-10">
        <w3m-button />
      </div>

      <div className="relative z-10 bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-yellow-400 text-center max-w-md">
        <h2 className="text-white text-xl font-bold">
          دریافت توکن <span className="text-yellow-400">BDOGE</span>
        </h2>
        <p className="text-gray-300 mt-2">
          تعداد <span className="text-yellow-400">210,000,000,000,000,000</span> توکن BDOGE برای ایردراپ آماده است.
        </p>

        <button
          onClick={claimAirdrop}
          disabled={claiming || !isConnected}
          className="mt-4 bg-yellow-400 text-black font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition"
        >
          {claiming ? "در حال دریافت..." : "دریافت ایردراپ"}
        </button>

        {!isConnected && (
          <p className="text-sm text-red-400 mt-3">لطفاً ابتدا والت خود را متصل کنید.</p>
        )}
      </div>
    </main>
  );
}
