import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl font-bold">Agent Pointless</h1>
        <p className="text-lg max-w-2xl">Pointless...Until it isn&apos;t.</p>
        <Link
          href="/chat"
          className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Start Chatting
        </Link>
      </main>
    </div>
  );
}
