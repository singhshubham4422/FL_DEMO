"use client";
import { useEffect, useState, useRef } from "react";
import Controls from "../components/Controls";
import NetworkGraph from "../components/NetworkGraph";
import { Chart } from "../components/Chart";
import SystemFlow from "../components/SystemFlow";
import { generateSimulationData } from "../lib/simulation";

export default function Page() {
  const [clients, setClients] = useState(8);
  const [dp, setDp] = useState(false);
  const [smpc, setSmpc] = useState(false);
  const [running, setRunning] = useState(false);

  const [fullData, setFullData] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);

  const [display, setDisplay] = useState({ mse: [], delay: [], active: [], epsilon: [] });
  const timerRef = useRef(null);

  function startSimulation({ clients, dp, smpc }) {
    setClients(clients);
    setDp(dp);
    setSmpc(smpc);
    const data = generateSimulationData({ clients, dp, smpc });
    setFullData(data);
    setDisplay({ mse: [], delay: [], active: [], epsilon: [] });
    setRoundIndex(0);
    setRunning(true);
  }

  useEffect(() => {
    if (!running || !fullData) return;

    timerRef.current = setInterval(() => {
      setRoundIndex((ri) => {
        const next = ri + 1;
        if (next > fullData.mse.length) {
          clearInterval(timerRef.current);
          setRunning(false);
          return ri;
        }

        setDisplay({
          mse: fullData.mse.slice(0, next),
          delay: fullData.delay.slice(0, next),
          active: fullData.active.slice(0, next),
          epsilon: fullData.epsilon.slice(0, next)
        });

        return next;
      });
    }, 800);

    return () => clearInterval(timerRef.current);
  }, [running, fullData]);

  const activeCount = display.active.length ? display.active[display.active.length - 1].value : clients;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Controls onStart={startSimulation} initialClients={clients} initialDP={dp} initialSMPC={smpc} />
          <div className="mt-4 glass p-3">
            <div className="card-title">Simulation Control</div>
            <div className="text-sm text-gray-300 mt-2">Rounds: 20 • Running: {running ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass p-4">
            <div className="card-title mb-3">Network Visualization</div>
            <NetworkGraph clients={clients} active={activeCount} round={roundIndex} dp={dp} smpc={smpc} />
          </div>
        </div>

        <div className="col-span-3 space-y-4">
          <div className="glass p-3">
            <div className="card-title">MSE vs Rounds</div>
            <div className="h-40"><Chart data={display.mse} color="#00D4FF" height={140} /></div>
          </div>

          <div className="glass p-3">
            <div className="card-title">Network Delay</div>
            <div className="h-28"><Chart data={display.delay} color="#00FFA3" height={110} /></div>
          </div>

          <div className="glass p-3">
            <div className="card-title">Active Clients</div>
            <div className="h-28"><Chart data={display.active} color="#9AE6B4" height={110} /></div>
          </div>

          <div className="glass p-3">
            <div className="card-title">Privacy Budget (Epsilon)</div>
            <div className="h-28"><Chart data={display.epsilon} color="#7DD3FC" height={110} /></div>
          </div>
        </div>
      </div>

      <div className="glass p-4">
        <div className="card-title mb-3">System Flow</div>
        <SystemFlow step={Math.min(2, Math.max(0, roundIndex % 3))} dp={dp} smpc={smpc} />
      </div>
    </div>
  );
}
