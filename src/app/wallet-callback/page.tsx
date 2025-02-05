"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const isBrowser = typeof window !== "undefined";

function WalletCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isBrowser) return;

    const accountId = searchParams.get("account_id");
    const txHash = searchParams.get("transactionHashes");
    const errorMessage = searchParams.get("error");

    if (window.opener) {
      // Send message to parent window
      window.opener.postMessage(
        {
          type: "WALLET_CALLBACK_COMPLETE",
          data: {
            accountId,
            txHash,
            error: errorMessage,
          },
        },
        window.location.origin
      );

      // If there's a transaction result, save it
      if (txHash || errorMessage) {
        window.opener.localStorage.setItem(
          "lastTransaction",
          JSON.stringify({
            success: !errorMessage,
            error: errorMessage,
            txHash,
          })
        );
      }

      // Close this window
      window.close();
    } else {
      // If opened directly, redirect to home
      window.location.href = "/";
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Processing...</h1>
        <p className="text-gray-600">
          Please wait while we complete your request.
        </p>
      </div>
    </div>
  );
}

export default function WalletCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Loading...</h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      }
    >
      <WalletCallbackContent />
    </Suspense>
  );
}
