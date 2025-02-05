"use client";

import { useWallet } from "@/contexts/WalletContext";
import { truncateAddress } from "@/lib/utils";
import { useState } from "react";
import { WalletInfo } from "../components/WalletInfo";

export function Header() {
  const {
    nearAccountId,
    connectNearWallet,
    disconnectNearWallet,
    isConnecting,
  } = useWallet();

  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  return (
    <header className="border-b border-gray-100 py-4 md:py-6">
      <div className="max-w-5xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Chat</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            Pointless or not? You decide.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {nearAccountId ? (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                <span className="hidden md:inline">Connected:</span>
                <span className="font-mono">
                  {truncateAddress(nearAccountId)}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showWalletMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-lg border border-gray-100 p-2">
                  <button
                    onClick={disconnectNearWallet}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={connectNearWallet}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
              <button
                onClick={() => setShowWalletInfo(true)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Learn about wallets"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <WalletInfo
        open={showWalletInfo}
        onClose={() => setShowWalletInfo(false)}
      />
    </header>
  );
}
