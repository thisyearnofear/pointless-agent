"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TransactionCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const transactionHashes = searchParams.get("transactionHashes");
    const errorCode = searchParams.get("errorCode");

    // Store transaction result in localStorage to persist through redirect
    if (transactionHashes || errorCode) {
      localStorage.setItem(
        "lastTransaction",
        JSON.stringify({
          success: !!transactionHashes,
          error: errorCode ? "Transaction was cancelled or failed" : undefined,
          txHash: transactionHashes?.split(",")[0],
        })
      );
    }

    // Redirect back to chat
    router.push("/chat");
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing transaction result...</p>
    </div>
  );
}
