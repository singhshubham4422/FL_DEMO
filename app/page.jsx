"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, BarChart3, BrainCircuit, Gauge, LineChart as LineChartIcon, ShieldCheck, Waves } from "lucide-react";
import Controls from "../components/Controls";
import NetworkGraph from "../components/NetworkGraph";
import { Chart } from "../components/Chart";
import SystemFlow from "../components/SystemFlow";
import { useSimulation } from "../lib/useSimulation";

function MetricCard({ icon: Icon, label, value, accent = "blue" }) {
  const accents = {
    blue: "from-blue-50 to-blue-100/60 text-blue-800 border-blue-200/60 shadow-blue-900/5",
    emerald: "from-emerald-50 to-emerald-100/60 text-emerald-800 border-emerald-200/60 shadow-emerald-900/5",
    slate: "from-slate-50 to-slate-100/60 text-slate-800 border-slate-200/60 shadow-slate-900/5",
    purple: "from-purple-50 to-purple-100/60 text-purple-800 border-purple-200/60 shadow-purple-900/5"
  };

  const iconColors = {
    blue: "text-blue-600 bg-white/90 shadow-sm border border-blue-100",
    emerald: "text-emerald-600 bg-white/90 shadow-sm border border-emerald-100",
    slate: "text-slate-600 bg-white/90 shadow-sm border border-slate-200",
    purple: "text-purple-600 bg-white/90 shadow-sm border border-purple-100"
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden rounded-[24px] border bg-gradient-to-br ${accents[accent]} p-4 shadow-md backdrop-blur-sm min-w-0 flex flex-col justify-between`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
        <div className="metric-label flex-1 break-words leading-tight !text-inherit opacity-80">{label}</div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${iconColors[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      </div>
    </motion.div>
  );
}

function ComputeBars({ data }) {
  const latest = data.slice(-6);

  return (
    <div className="premium-panel rounded-[28px] p-5">
      <div className="card-title mb-4">Compute Load</div>
      <div className="space-y-3">
        {latest.length ? latest.map((item) => (
          <div key={`${item.client}-${item.value}`} className="flex items-center gap-3">
            <div className="w-16 text-sm font-medium text-slate-600">C{item.client}</div>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <div className="w-10 text-right text-xs font-semibold text-slate-500">{item.value}%</div>
          </div>
        )) : (
          <div className="text-sm text-slate-500">Start the simulation to see client load distribution.</div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [clients, setClients] = useState(8);
  const [dp, setDp] = useState(true);
  const [smpc, setSmpc] = useState(true);
  const [running, setRunning] = useState(false);

  const simulation = useSimulation({ clients, dp, smpc, running });
  const systemStory = useMemo(() => ([
    "Clients training locally",
    dp ? "Applying differential privacy" : "Baseline updates moving cleanly",
    smpc ? "Sending encrypted updates" : "Sending model updates",
    "Aggregating global model"
  ]), [dp, smpc]);

  const currentStatus = useMemo(() => {
    if (!simulation.round) {
      return ["Ready to simulate", "Choose privacy settings", "Start the federated round"];
    }
    return simulation.status.length ? [...simulation.status, systemStory[simulation.round % 4]] : ["Running federated round..."];
  }, [simulation.round, simulation.status, systemStory]);

  const startSimulation = ({ clients: nextClients, dp: nextDp, smpc: nextSmpc }) => {
    setClients(nextClients);
    setDp(nextDp);
    setSmpc(nextSmpc);
    setRunning(false);
    requestAnimationFrame(() => setRunning(true));
  };

  const activeCount = simulation.activeClients.at(-1)?.value ?? clients;
  const mseValue = simulation.mse.at(-1)?.value ?? 1;
  const delayValue = simulation.delay.at(-1)?.value ?? 0;
  const epsilonValue = simulation.epsilon.at(-1)?.value ?? 0;
  const roundMarks = Array.from({ length: 20 }, (_, index) => index + 1);

  return (
    <div className="space-y-6 pb-10">
      <section className="premium-panel relative overflow-hidden rounded-[32px] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.68))]" />
        <motion.div
          className="absolute -left-16 top-8 h-36 w-36 rounded-full bg-blue-300/30 blur-3xl"
          animate={{ y: [0, 16, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-16 h-44 w-44 rounded-full bg-emerald-300/25 blur-3xl"
          animate={{ y: [0, -14, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
              <Waves className="h-4 w-4" /> Federated Learning Smart Grid Simulator
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Real-time grid intelligence with privacy-aware federated learning.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Watch nodes train locally, packets move through a multi-hop network, and the aggregator converge across 20 rounds with differential privacy and secure aggregation controls.
            </p>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[
                { label: "Simulation", value: running ? "Live" : "Ready" },
                { label: "Topology", value: `${clients} homes` },
                { label: "Privacy Mode", value: (!dp && !smpc) ? "Baseline" : `${dp ? "DP" : "OFF"} · ${smpc ? "SMPC" : "OFF"}` }
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:max-w-[520px]">
            <MetricCard icon={BrainCircuit} label="Current Round" value={simulation.round || 0} accent="blue" />
            <MetricCard icon={Gauge} label="Active Clients" value={activeCount} accent="emerald" />
            <MetricCard icon={LineChartIcon} label="MSE" value={mseValue.toFixed(3)} accent="slate" />
            <MetricCard icon={ShieldCheck} label="Epsilon" value={epsilonValue.toFixed(2)} accent="purple" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <Controls
            onStart={startSimulation}
            initialClients={clients}
            initialDP={dp}
            initialSMPC={smpc}
          />

          <div className="premium-panel rounded-[28px] p-5">
            <div className="card-title mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Live Status
            </div>
            <div className="space-y-3">
              {currentStatus.map((line, index) => (
                <div key={`${line}-${index}`} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
          
          <ComputeBars data={simulation.computeLoad} />
        </aside>

        <main className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-panel rounded-[28px] px-5 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="card-title">Federated round timeline</div>
                <div className="mt-2 text-sm text-slate-600">A live progression view across all 20 rounds.</div>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Round {simulation.round || 0} / 20
              </div>
            </div>
            <div className="mt-4 grid grid-cols-10 gap-2 md:grid-cols-20">
              {roundMarks.map((mark) => {
                const active = mark <= (simulation.round || 0);
                return (
                  <motion.div
                    key={mark}
                    whileHover={{ scale: 1.08 }}
                    className={`h-3 rounded-full transition-all ${active ? "bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_14px_rgba(59,130,246,0.35)]" : "bg-slate-200"}`}
                    title={`Round ${mark}`}
                  />
                );
              })}
            </div>
          </motion.div>

          <div className="relative">
            <NetworkGraph
              clients={clients}
              active={activeCount}
              round={simulation.round}
              dp={dp}
              smpc={smpc}
            />
            <div className="absolute left-6 top-6 rounded-2xl bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur">
              Training round {simulation.round || 0} of 20
            </div>
          </div>
          
          <div className="premium-panel rounded-[24px] p-5 text-sm text-slate-600 leading-relaxed border-l-4 border-l-blue-500">
            <strong>AODV Routing Simulation:</strong> Communication occurs through a dynamic multi-hop AODV routing protocol, where nodes relay updates through intermediate devices instead of direct transmission.
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard icon={BarChart3} label="Network Delay" value={`${delayValue.toFixed(2)} ms`} accent="emerald" />
            <MetricCard icon={Activity} label="Active Clients" value={`${activeCount}/${clients}`} accent="blue" />
            <MetricCard icon={ShieldCheck} label="Privacy Mode" value={(!dp && !smpc) ? "Baseline" : `${dp ? "DP ON" : "DP OFF"} · ${smpc ? "SMPC ON" : "SMPC OFF"}`} accent="slate" />
          </div>

          <SystemFlow step={simulation.step} dp={dp} smpc={smpc} />
        </main>
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="card-title flex items-center gap-2 px-1">
              <LineChartIcon className="h-5 w-5" /> Live Metrics & Performance Comparison
            </div>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl px-1">
              <strong className="text-slate-800">Baseline Explanation:</strong> Baseline represents federated learning without any privacy or security mechanisms. It serves as a reference to compare the impact of Differential Privacy (DP) and Secure Multi-Party Computation (SMPC).
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}><Chart data={simulation.mse} color="#2563eb" height={220} title="Comparative MSE Convergence" /></motion.div>
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}><Chart data={simulation.delay} color="#10b981" height={220} title="AODV Network Delay (ms)" /></motion.div>
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}><Chart data={simulation.activeClients} color="#0f766e" height={220} title="Active Clients per Round" /></motion.div>
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}><Chart data={simulation.epsilon} color="#7c3aed" height={220} title="Privacy Loss (Epsilon)" /></motion.div>
        </div>
      </div>
    </div>
  );
}
