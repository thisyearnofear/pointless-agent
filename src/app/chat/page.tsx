"use client";

import { BitteAiChat } from "@bitte-ai/chat";
import { useWallet } from "@/contexts/WalletContext";
import { useEffect, useState, useRef, Suspense } from "react";
import type { EVMWalletAdapter } from "@bitte-ai/chat";
import {
  AVAILABLE_AGENTS,
  type ChatState,
  type AgentConfig,
} from "@/types/chat";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TransactionNotification } from "@/components/TransactionNotification";
import Image from "next/image";

export default function ChatPage() {
  const {
    selector,
    nearAccountId,
    evmAddress,
    connectNearWallet,
    signEvmTransaction,
    switchEvmChain,
    isConnecting,
    error,
    lastTransaction,
    clearTransactionResult,
  } = useWallet();

  const [wallet, setWallet] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig>(
    AVAILABLE_AGENTS[0]
  );
  const chatStateRef = useRef<ChatState | null>(null);

  // Listen for wallet callback messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "WALLET_CALLBACK_COMPLETE"
      ) {
        // Refresh wallet state if needed
        if (selector && !wallet) {
          initWallet();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selector, wallet]);

  // Save chat state before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatStateRef.current) {
        sessionStorage.setItem(
          "chatState",
          JSON.stringify(chatStateRef.current)
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Create EVM wallet adapter that matches the expected interface
  const evmWalletAdapter: EVMWalletAdapter | undefined = evmAddress
    ? {
        address: evmAddress,
        sendTransaction: async (tx: any) => {
          await signEvmTransaction(tx);
          return { hash: "" };
        },
        switchChain: async ({ chainId }) => {
          await switchEvmChain(chainId);
          return { id: chainId };
        },
      }
    : undefined;

  const initWallet = async () => {
    if (selector && !wallet) {
      try {
        const walletInstance = await selector.wallet("bitte-wallet");
        setWallet(walletInstance);
      } catch (error) {
        console.error("Failed to setup wallet:", error);
      }
    }
  };

  useEffect(() => {
    initWallet();
  }, [selector, wallet]);

  // Get initial chat state
  const getSavedChatState = (): ChatState | null => {
    if (typeof window === "undefined") return null;
    const savedState = sessionStorage.getItem(`chatState-${selectedAgent.id}`);
    if (!savedState) return null;
    try {
      return JSON.parse(savedState);
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-12">
          {/* Chat Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
            <Suspense fallback={<div className="p-4">Loading chat...</div>}>
              {!nearAccountId ? (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={connectNearWallet}
                    disabled={isConnecting}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isConnecting ? "Connecting..." : "Connect NEAR Wallet"}
                  </button>
                </div>
              ) : (
                <BitteAiChat
                  agentId={selectedAgent.id}
                  apiUrl="/api/chat"
                  wallet={{
                    near: { wallet },
                    evm: evmWalletAdapter,
                  }}
                  options={{
                    agentName: selectedAgent.name,
                    agentImage: selectedAgent.image,
                  }}
                  colors={{
                    generalBackground: "#ffffff",
                    messageBackground: "#f3f4f6",
                    textColor: "#111827",
                    buttonColor: "#3b82f6",
                    borderColor: "#e5e7eb",
                  }}
                />
              )}
            </Suspense>
          </div>

          {/* Sidebar */}
          <Sidebar
            selectedAgentId={selectedAgent.id}
            onSelectAgent={(agentId) => {
              const agent = AVAILABLE_AGENTS.find((a) => a.id === agentId);
              if (agent) setSelectedAgent(agent);
            }}
          />
        </div>
      </main>

      {/* Transaction Notifications */}
      {lastTransaction && (
        <TransactionNotification
          transaction={lastTransaction}
          onClose={clearTransactionResult}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600">Built with</span>
          <a
            href="https://docs.bitte.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-800 hover:text-blue-600 transition-colors"
          >
            <Image
              src="/images/bitte.png"
              alt="BitteAI"
              width={20}
              height={20}
              className="inline-block"
            />
            <span className="text-sm font-medium">BitteAI</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
