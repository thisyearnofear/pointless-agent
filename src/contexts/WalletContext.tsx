"use client";

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import type { WalletSelector, Wallet } from "@near-wallet-selector/core";
import { createContext, useContext, useEffect, useState } from "react";

interface TransactionResult {
  success: boolean;
  error?: string;
  txHash?: string;
}

interface WalletContextType {
  selector: WalletSelector | null;
  nearAccountId: string | null;
  evmAddress: string | null;
  connectNearWallet: () => Promise<void>;
  disconnectNearWallet: () => Promise<void>;
  connectEvmWallet: () => Promise<void>;
  disconnectEvmWallet: () => Promise<void>;
  signEvmTransaction: (tx: EvmTransaction) => Promise<void>;
  switchEvmChain: (chainId: number) => Promise<void>;
  isConnecting: boolean;
  error: string | null;
  lastTransaction: TransactionResult | null;
  clearTransactionResult: () => void;
}

interface EvmTransaction {
  chainId: number;
  to: string;
  value: bigint;
  data?: string;
}

const WalletContext = createContext<WalletContextType>({
  selector: null,
  nearAccountId: null,
  evmAddress: null,
  connectNearWallet: async () => {},
  disconnectNearWallet: async () => {},
  connectEvmWallet: async () => {},
  disconnectEvmWallet: async () => {},
  signEvmTransaction: async () => {},
  switchEvmChain: async () => {},
  isConnecting: false,
  error: null,
  lastTransaction: null,
  clearTransactionResult: () => {},
});

const WALLET_WINDOW_FEATURES = "width=800,height=600,left=300,top=100";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [nearAccountId, setNearAccountId] = useState<string | null>(null);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] =
    useState<TransactionResult | null>(null);

  const clearTransactionResult = () => setLastTransaction(null);

  const handleTransactionError = (error: any): string => {
    if (error?.kind?.FunctionCallError?.ExecutionError) {
      // Handle specific smart contract errors
      const message = error.kind.FunctionCallError.ExecutionError;
      if (message.includes("slippage error")) {
        return "Transaction failed due to price impact being too high. Try reducing the amount or increasing slippage tolerance.";
      }
      return `Smart contract error: ${message}`;
    }
    return error?.message || "Transaction failed for unknown reason";
  };

  useEffect(() => {
    const initWallet = async () => {
      try {
        const bitteWallet = setupBitteWallet({
          walletUrl: "https://wallet.bitte.ai",
          callbackUrl: window.location.origin,
        });

        const selector = await setupWalletSelector({
          network: "mainnet",
          modules: [bitteWallet as any],
        });

        const state = selector.store.getState();
        const accounts = state.accounts;

        if (accounts.length > 0) {
          setNearAccountId(accounts[0].accountId);
          // Try to get the wallet instance for existing connection
          const wallet = await selector.wallet();
          setWallet(wallet);
        }

        setSelector(selector);
      } catch (err) {
        console.error("Failed to initialize wallet:", err);
        setError("Failed to initialize wallet");
      }
    };

    initWallet();
  }, []);

  // Helper to open wallet in new window
  const openWalletWindow = (url: string): Window | null => {
    const walletWindow = window.open(
      url,
      "BitteWallet",
      WALLET_WINDOW_FEATURES
    );

    if (walletWindow) {
      // Focus the new window
      walletWindow.focus();

      // Poll for window close to handle result
      const pollTimer = setInterval(() => {
        if (walletWindow.closed) {
          clearInterval(pollTimer);
          // Check localStorage for transaction result
          const savedTx = localStorage.getItem("lastTransaction");
          if (savedTx) {
            setLastTransaction(JSON.parse(savedTx));
            localStorage.removeItem("lastTransaction");
          }
        }
      }, 500);
    }

    return walletWindow;
  };

  const connectNearWallet = async () => {
    if (!selector) return;
    setError(null);
    setIsConnecting(true);

    try {
      const wallet = await selector.wallet("bitte-wallet");
      const signInUrl = `https://wallet.bitte.ai/connect?success_url=${encodeURIComponent(
        window.location.origin + "/wallet-callback"
      )}`;

      const walletWindow = openWalletWindow(signInUrl);
      if (!walletWindow) {
        throw new Error(
          "Could not open wallet window. Please allow popups for this site."
        );
      }
    } catch (err) {
      console.error("Failed to connect NEAR wallet:", err);
      setError("Failed to connect NEAR wallet");
      setIsConnecting(false);
    }
  };

  const disconnectNearWallet = async () => {
    if (!selector || !wallet) return;
    try {
      await wallet.signOut();
      setNearAccountId(null);
      setWallet(null);
      sessionStorage.clear(); // Clear chat states
    } catch (err) {
      console.error("Failed to disconnect NEAR wallet:", err);
      setError("Failed to disconnect NEAR wallet");
    }
  };

  const connectEvmWallet = async () => {
    if (!selector) return;
    setError(null);
    setIsConnecting(true);

    try {
      const wallet = await selector.wallet("bitte-wallet");
      const signInUrl = `https://wallet.bitte.ai/connect?callback_url=${encodeURIComponent(
        window.location.origin + "/wallet-callback"
      )}`;

      const walletWindow = openWalletWindow(signInUrl);
      if (!walletWindow) {
        throw new Error(
          "Could not open wallet window. Please allow popups for this site."
        );
      }
    } catch (err) {
      console.error("Failed to connect EVM wallet:", err);
      setError("Failed to connect EVM wallet");
      setIsConnecting(false);
    }
  };

  const disconnectEvmWallet = async () => {
    if (!selector || !wallet) return;
    try {
      await wallet.signOut();
      setEvmAddress(null);
      setWallet(null);
    } catch (err) {
      console.error("Failed to disconnect EVM wallet:", err);
      setError("Failed to disconnect EVM wallet");
    }
  };

  const signEvmTransaction = async (tx: EvmTransaction) => {
    if (!nearAccountId) {
      throw new Error("Please connect your wallet first");
    }

    try {
      setLastTransaction(null);
      const params = new URLSearchParams({
        to: tx.to,
        value: tx.value.toString(),
        chainId: tx.chainId.toString(),
        data: tx.data || "0x",
        callback_url: `${window.location.origin}/wallet-callback`,
      });

      const url = `https://wallet.bitte.ai/sign-evm?${params.toString()}`;
      const walletWindow = openWalletWindow(url);
      if (!walletWindow) {
        throw new Error(
          "Could not open wallet window. Please allow popups for this site."
        );
      }
    } catch (error: any) {
      setLastTransaction({
        success: false,
        error: handleTransactionError(error),
      });
      throw error;
    }
  };

  const switchEvmChain = async (chainId: number) => {
    if (!nearAccountId) {
      throw new Error("Please connect your wallet first");
    }

    const params = new URLSearchParams({
      chainId: chainId.toString(),
      callback_url: window.location.origin,
    });

    window.location.href = `https://wallet.bitte.ai/switch-chain?${params.toString()}`;
  };

  return (
    <WalletContext.Provider
      value={{
        selector,
        nearAccountId,
        evmAddress,
        connectNearWallet,
        disconnectNearWallet,
        connectEvmWallet,
        disconnectEvmWallet,
        signEvmTransaction,
        switchEvmChain,
        isConnecting,
        error,
        lastTransaction,
        clearTransactionResult,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
