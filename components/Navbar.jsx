"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 glass neon">
      <div className="flex items-center gap-4">
        <div className="text-neon-blue text-lg font-bold">Federated Smart Grid Simulator</div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="px-3 py-1 rounded text-sm bg-transparent hover:bg-white/5">Dashboard</Link>
        <Link href="/applications" className="px-3 py-1 rounded text-sm bg-transparent hover:bg-white/5">Applications</Link>
      </div>
    </nav>
  );
}
