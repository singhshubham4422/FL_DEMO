"use client";
import { useState } from "react";
import { Cpu, Shield, Workflow, Rocket } from "lucide-react";

export default function Controls({ onStart, initialClients = 8, initialDP = false, initialSMPC = false }) {
  const [clients, setClients] = useState(initialClients);
  const [dp, setDp] = useState(initialDP);
  const [smpc, setSmpc] = useState(initialSMPC);

  return (
    <div className="premium-panel p-6 space-y-6 w-full rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-blue-900/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">Controls</div>
          <div className="text-sm font-medium text-slate-500">Tune the federated run in real time</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 border border-white p-4 space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-sm font-bold text-slate-700">
          <span className="uppercase tracking-wider text-xs text-slate-500">Number of Clients</span>
          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{clients}</span>
        </div>
        <div className="flex items-center gap-2">
          {[4, 8, 16].map((count) => (
            <button
              key={count}
              onClick={() => setClients(count)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200 ${clients === count ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'}`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setDp((value) => !value)}
        className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 border-2 transition-all duration-200 ${dp ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-md shadow-blue-500/10 scale-[1.02]' : 'bg-white/80 border-transparent hover:border-blue-200 text-slate-600 shadow-sm hover:shadow-md'}`}
      >
        <span className="flex items-center gap-3 font-bold"><Shield className={`w-5 h-5 ${dp ? 'text-blue-600' : 'text-slate-400'}`} /> Differential Privacy</span>
        <span className={`text-xs font-black px-2 py-1 rounded-md ${dp ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>{dp ? 'ON' : 'OFF'}</span>
      </button>

      <button
        onClick={() => setSmpc((value) => !value)}
        className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 border-2 transition-all duration-200 ${smpc ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md shadow-emerald-500/10 scale-[1.02]' : 'bg-white/80 border-transparent hover:border-emerald-200 text-slate-600 shadow-sm hover:shadow-md'}`}
      >
        <span className="flex items-center gap-3 font-bold"><Workflow className={`w-5 h-5 ${smpc ? 'text-emerald-600' : 'text-slate-400'}`} /> Secure Aggregation</span>
        <span className={`text-xs font-black px-2 py-1 rounded-md ${smpc ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>{smpc ? 'ON' : 'OFF'}</span>
      </button>

      <button
        onClick={() => onStart({ clients, dp, smpc })}
        className="w-full group rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right text-white font-bold px-4 py-4 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1"
      >
        <span className="inline-flex items-center gap-2"><Rocket className="w-5 h-5 group-hover:animate-bounce" /> Start Simulation</span>
      </button>
    </div>
  );
}
