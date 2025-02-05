"use client";

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import type {
  WalletSelector,
  Wallet,
  WalletModuleFactory,
} from "@near-wallet-selector/core";
import { createContext, useContext, useEffect, useState } from "react";

interface TransactionResult {
  success: boolean;
  error?: string;
  txHash?: string;
}

interface TransactionError {
  message: string;
  data?: unknown;
}

interface WalletContextType {
  selector: WalletSelector | null;
  nearAccountId: string | null;
  connectNearWallet: () => Promise<void>;
  disconnectNearWallet: () => Promise<void>;
  isConnecting: boolean;
  error: string | null;
  lastTransaction: TransactionResult | null;
  clearTransactionResult: () => void;
}

const WalletContext = createContext<WalletContextType>({
  selector: null,
  nearAccountId: null,
  connectNearWallet: async () => {},
  disconnectNearWallet: async () => {},
  isConnecting: false,
  error: null,
  lastTransaction: null,
  clearTransactionResult: () => {},
});

const WALLET_WINDOW_FEATURES = "width=800,height=600,left=300,top=100";

const isBrowser = typeof window !== "undefined";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [nearAccountId, setNearAccountId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] =
    useState<TransactionResult | null>(null);

  const clearTransactionResult = () => setLastTransaction(null);

  useEffect(() => {
    const initWallet = async () => {
      try {
        const bitteWalletModule = setupBitteWallet({
          walletUrl: "https://wallet.bitte.ai",
          callbackUrl: window.location.origin + "/wallet-callback",
        });

        const selector = await setupWalletSelector({
          network: "mainnet",
          modules: [
            bitteWalletModule as unknown as WalletModuleFactory<Wallet>,
          ],
        });

        // Check if user was previously connected
        const state = selector.store.getState();
        const accounts = state.accounts;

        if (accounts.length > 0) {
          setNearAccountId(accounts[0].accountId);
        }

        setSelector(selector);
      } catch (error) {
        console.error("Failed to initialize wallet:", error);
        setError("Failed to initialize wallet");
      }
    };

    initWallet();
  }, []);

  // Helper to open wallet in new window
  const openWalletWindow = (url: string): Window | null => {
    if (!isBrowser) return null;

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
      // Get the signInUrl ready first
      const signInUrl = new URL("https://wallet.bitte.ai/connect");
      signInUrl.searchParams.set(
        "success_url",
        window.location.origin + "/wallet-callback"
      );

      const walletWindow = openWalletWindow(signInUrl.toString());
      if (!walletWindow) {
        throw new Error(
          "Could not open wallet window. Please allow popups for this site."
        );
      }

      // Add message listener for wallet connection completion
      const handleMessage = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.data?.type === "WALLET_CALLBACK_COMPLETE"
        ) {
          const { accountId, publicKey } = event.data.data;
          if (accountId) {
            setNearAccountId(accountId);
            if (accountId && publicKey) {
              selector.setActiveAccount(accountId);
            }
          }
          setIsConnecting(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);
    } catch (error) {
      console.error("Failed to connect NEAR wallet:", error);
      setError(
        error instanceof Error ? error.message : "Failed to connect NEAR wallet"
      );
      setIsConnecting(false);
    }
  };

  const disconnectNearWallet = async () => {
    if (!selector) return;
    try {
      const wallet = await selector.wallet("bitte-wallet");
      await wallet.signOut();
      setNearAccountId(null);

      // The signOut method will handle clearing the account state
    } catch (err) {
      const error = err as TransactionError;
      console.error("Failed to disconnect NEAR wallet:", error);
      setError(error.message || "Failed to disconnect NEAR wallet");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        selector,
        nearAccountId,
        connectNearWallet,
        disconnectNearWallet,
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
