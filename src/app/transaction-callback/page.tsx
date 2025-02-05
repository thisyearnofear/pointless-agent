"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TransactionCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const txHash = searchParams.get("transactionHashes");
    const errorMessage = searchParams.get("error");

    if (window.opener) {
      // Send message to parent window
      window.opener.postMessage(
        {
          type: "TRANSACTION_CALLBACK_COMPLETE",
          data: {
            txHash,
            error: errorMessage,
          },
        },
        window.location.origin
      );

      // Save transaction result
      window.opener.localStorage.setItem(
        "lastTransaction",
        JSON.stringify({
          success: !errorMessage,
          error: errorMessage,
          txHash: txHash?.split(",")[0], // NEAR returns comma-separated hashes
        })
      );

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
        <h1 className="text-xl font-semibold mb-2">
          Processing Transaction...
        </h1>
        <p className="text-gray-600">
          Please wait while we complete your transaction.
        </p>
      </div>
    </div>
  );
}

export default function TransactionCallback() {
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
      <TransactionCallbackContent />
    </Suspense>
  );
}
