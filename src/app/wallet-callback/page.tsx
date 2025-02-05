"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function WalletCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      const transactionHashes = searchParams.get("transactionHashes");
      const errorCode = searchParams.get("errorCode");
      const accountId = searchParams.get("accountId");

      if (transactionHashes || errorCode) {
        // Handle transaction result
        localStorage.setItem(
          "lastTransaction",
          JSON.stringify({
            success: !!transactionHashes,
            error: errorCode
              ? "Transaction was cancelled or failed"
              : undefined,
            txHash: transactionHashes?.split(",")[0],
          })
        );
      }

      if (accountId) {
        // Handle wallet connection
        localStorage.setItem(
          "walletConnection",
          JSON.stringify({
            accountId,
            timestamp: Date.now(),
          })
        );
      }

      // Close the window and notify opener
      if (window.opener) {
        window.opener.postMessage(
          { type: "WALLET_CALLBACK_COMPLETE" },
          window.location.origin
        );
        window.close();
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing wallet action...</p>
    </div>
  );
}
