"use client";
import { useState } from "react";

export default function Controls({ onStart, initialClients = 8, initialDP = false, initialSMPC = false }) {
  const [clients, setClients] = useState(initialClients);
  const [dp, setDp] = useState(initialDP);
  const [smpc, setSmpc] = useState(initialSMPC);

  return (
    <div className="p-4 glass space-y-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-200">Number of Clients</div>
        <div className="flex items-center gap-3">
          <button className={`px-3 py-1 rounded ${clients === 4 ? 'bg-white/10' : ''}`} onClick={() => setClients(4)}>4</button>
          <button className={`px-3 py-1 rounded ${clients === 8 ? 'bg-white/10' : ''}`} onClick={() => setClients(8)}>8</button>
          <button className={`px-3 py-1 rounded ${clients === 16 ? 'bg-white/10' : ''}`} onClick={() => setClients(16)}>16</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div> Differential Privacy </div>
        <label className="switch">
          <input type="checkbox" checked={dp} onChange={() => setDp(!dp)} />
          <span className="ml-2">{dp ? 'ON' : 'OFF'}</span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div> Secure Aggregation (SMPC) </div>
        <label className="switch">
          <input type="checkbox" checked={smpc} onChange={() => setSmpc(!smpc)} />
          <span className="ml-2">{smpc ? 'ON' : 'OFF'}</span>
        </label>
      </div>

      <div>
        <button
          onClick={() => onStart({ clients, dp, smpc })}
          className="w-full px-4 py-2 rounded bg-neon-blue text-black font-semibold"
        >
          Start Simulation
        </button>
      </div>
    </div>
  );
}
