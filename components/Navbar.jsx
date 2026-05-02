"use client";
import Link from "next/link";
import { ActivitySquare, Grid2x2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="premium-panel flex w-full items-center justify-between rounded-[28px] px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-200">
          <ActivitySquare className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-900">Federated Smart Grid Simulator</div>
          <div className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">live federated energy visualizer</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
          <Grid2x2 className="h-4 w-4" /> Dashboard
        </Link>
        <Link href="/applications" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700">
          <ActivitySquare className="h-4 w-4" /> Applications
        </Link>
      </div>
    </nav>
  );
}
