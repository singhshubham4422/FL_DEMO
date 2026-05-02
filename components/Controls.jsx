"use client";
import { useState } from "react";
import { Cpu, Shield, Workflow, Rocket } from "lucide-react";

export default function Controls({ onStart, initialClients = 8, initialDP = false, initialSMPC = false }) {
  const [clients, setClients] = useState(initialClients);
  const [dp, setDp] = useState(initialDP);
  const [smpc, setSmpc] = useState(initialSMPC);

  return (
    <div className="premium-panel p-5 space-y-5 w-full">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-700 flex items-center justify-center">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-900">Controls</div>
          <div className="text-sm text-slate-500">Tune the federated run in real time</div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50/90 border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Number of Clients</span>
          <span className="text-blue-700">{clients}</span>
        </div>
        <div className="flex items-center gap-2">
          {[4, 8, 16].map((count) => (
            <button
              key={count}
              onClick={() => setClients(count)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${clients === count ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-700'}`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setDp((value) => !value)}
        className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 border transition ${dp ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200'}`}
      >
        <span className="flex items-center gap-3 font-medium"><Shield className="w-4 h-4" /> Differential Privacy</span>
        <span className="text-sm font-semibold">{dp ? 'ON' : 'OFF'}</span>
      </button>

      <button
        onClick={() => setSmpc((value) => !value)}
        className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 border transition ${smpc ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-200'}`}
      >
        <span className="flex items-center gap-3 font-medium"><Workflow className="w-4 h-4" /> Secure Aggregation</span>
        <span className="text-sm font-semibold">{smpc ? 'ON' : 'OFF'}</span>
      </button>

      <button
        onClick={() => onStart({ clients, dp, smpc })}
        className="w-full group rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 text-white font-semibold px-4 py-3 shadow-lg shadow-blue-200 transition hover:translate-y-[-1px]"
      >
        <span className="inline-flex items-center gap-2"><Rocket className="w-4 h-4" /> Start Simulation</span>
      </button>
    </div>
  );
}
