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
    const publicKey = searchParams.get("public_key");
    const errorMessage = searchParams.get("error");

    if (window.opener) {
      // Send complete data back to parent window
      window.opener.postMessage(
        {
          type: "WALLET_CALLBACK_COMPLETE",
          data: {
            accountId,
            publicKey,
            error: errorMessage,
          },
        },
        window.location.origin
      );

      // Close this window after a short delay
      setTimeout(() => window.close(), 100);
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
