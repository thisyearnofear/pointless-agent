import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { WalletProvider } from "@/contexts/WalletContext";

export const metadata: Metadata = {
  title: "Agent Pointless",
  description: "Pointless AI Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          <nav className="bg-white dark:bg-gray-900 border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  Agent Pointless
                </Link>
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Open Chat
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
