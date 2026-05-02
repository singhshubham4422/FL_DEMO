"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Home, Zap } from "lucide-react";

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildGraph(clients) {
  const nodes = Array.from({ length: clients }, (_, index) => {
    const angle = (index / clients) * Math.PI * 2;
    const ring = index % 2 === 0 ? 160 : 110;
    const wobble = seededRandom(index + clients) * 32 - 16;
    return {
      id: index,
      x: Math.cos(angle) * ring + wobble,
      y: Math.sin(angle) * ring + wobble / 2
    };
  });

  const edges = [];
  for (let i = 1; i < clients; i += 1) {
    edges.push([i, i - 1]);
    if (i > 2 && i % 2 === 0) {
      edges.push([i, Math.max(0, i - 2)]);
    }
  }

  return { nodes, edges };
}

function Packet({ from, to, active, delay = 0, soft = false }) {
  return active ? (
    <motion.div
      className={`absolute z-20 rounded-full ${soft ? "h-2 w-2 bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" : "h-3 w-3 bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.95)]"}`}
      initial={{ x: from.x, y: from.y, opacity: 0.35, scale: 0.75 }}
      animate={{
        x: to.x,
        y: to.y,
        opacity: [0.35, 1, 0.35],
        scale: [0.75, 1.35, 0.75]
      }}
      transition={{ duration: soft ? 1.6 : 1.1, repeat: Infinity, repeatDelay: delay, ease: "easeInOut" }}
      style={{ left: 200, top: 200, translateX: "-50%", translateY: "-50%" }}
    />
  ) : null;
}

export default function NetworkGraph({ clients = 8, active = 0, round = 0, dp = false, smpc = false }) {
  const { nodes, edges } = useMemo(() => buildGraph(clients), [clients]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const server = { x: 0, y: 0 };
  const sourceIndex = round > 0 ? (round - 1) % clients : 0;
  const route = useMemo(() => {
    if (!nodes.length) return [];
    const middle = Math.max(1, Math.floor(sourceIndex / 2));
    return [nodes[sourceIndex], nodes[middle], server];
  }, [nodes, sourceIndex]);
  const storyStep = round % 4;
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        x: (index % 4) * 86 - 130,
        y: Math.floor(index / 4) * 70 - 95,
        delay: index * 0.35,
        duration: 3.4 + (index % 3) * 0.6
      })),
    []
  );

  return (
    <div
      className="premium-panel group relative h-[520px] overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 p-5"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 10, y: y * -10 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-white to-emerald-100/30"
        animate={{ opacity: dp ? [0.7, 0.9, 0.7] : [0.45, 0.65, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 grid-faint opacity-35" />
      <motion.div
        className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-blue-300/30 blur-3xl"
        animate={{ x: [0, 16, 0], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-4 bottom-10 h-40 w-40 rounded-full bg-emerald-300/25 blur-3xl"
        animate={{ x: [0, -14, 0], y: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {dp && (
        <motion.div
          className="absolute inset-0 bg-blue-200/25"
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        className="absolute inset-0"
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative z-10 flex h-full items-center justify-center">
          <svg viewBox="-240 -240 480 480" className="absolute h-full w-full overflow-visible">
            {edges.map(([a, b], index) => {
              const from = nodes[a];
              const to = nodes[b];
              const activeEdge = route.some(
                (node, routeIndex) => routeIndex > 0 && route[routeIndex - 1] && route[routeIndex - 1].id === a && node.id === b
              );
              return (
                <g key={`${a}-${b}-${index}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={activeEdge ? "#2563eb" : "#d6e0ef"}
                    strokeWidth={activeEdge ? 3.2 : 1.5}
                    strokeLinecap="round"
                    opacity={activeEdge ? 0.95 : 0.7}
                    strokeDasharray={smpc && !activeEdge ? "7 8" : undefined}
                  />
                </g>
              );
            })}
          </svg>

          {particles.map((particle, index) => (
            <motion.div
              key={particle.id}
              className="absolute z-10 h-1.5 w-1.5 rounded-full bg-blue-300/70 shadow-[0_0_14px_rgba(96,165,250,0.65)]"
              animate={{
                x: [particle.x, particle.x + (index % 2 === 0 ? 28 : -22), particle.x],
                y: [particle.y, particle.y - 18, particle.y],
                opacity: [0.15, 0.95, 0.15]
              }}
              transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
              style={{ left: "50%", top: "50%" }}
            />
          ))}

          <motion.div
            animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 0 rgba(59,130,246,0)", "0 0 28px rgba(59,130,246,0.25)", "0 0 0 rgba(59,130,246,0)"] }}
            transition={{ duration: 2.3, repeat: Infinity }}
            className="absolute z-30 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-2xl"
          >
            Grid
          </motion.div>

          {nodes.map((node, index) => {
            const isActive = index < active;
            const isSource = sourceIndex === index;
            const state = isSource
              ? "sending"
              : isActive
                ? storyStep === 0
                  ? "training"
                  : storyStep === 1
                    ? "sending"
                    : storyStep === 2
                      ? "aggregating"
                      : "training"
                : index === active
                  ? "dropped"
                  : "idle";

            const stateStyles = {
              training: "bg-emerald-100 text-emerald-700 border-emerald-200",
              sending: "bg-blue-100 text-blue-700 border-blue-200",
              aggregating: "bg-amber-100 text-amber-700 border-amber-200",
              dropped: "bg-rose-100 text-rose-700 border-rose-200",
              idle: "bg-slate-100 text-slate-500 border-slate-200"
            };

            return (
              <motion.div
                key={node.id}
                animate={{
                  y: [node.y, node.y - (isActive ? 10 : 4), node.y],
                  scale: isSource || isActive ? [1, 1.1, 1] : [1, 1, 1],
                  boxShadow: isSource || isActive
                    ? ["0 0 0px rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.55)", "0 0 0px rgba(34,197,94,0)"]
                    : ["0 0 0px rgba(148,163,184,0)", "0 0 12px rgba(148,163,184,0.25)", "0 0 0px rgba(148,163,184,0)"]
                }}
                transition={{ duration: isActive || isSource ? 2 : 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-20 flex flex-col items-center"
                style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: "translate(-50%, -50%)" }}
              >
                <div className={`rounded-2xl border bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 ${dp ? "opacity-90" : "opacity-100"} ${smpc ? "border-dashed" : ""} ${smpc ? "blur-[0.4px]" : ""}`}>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stateStyles[state]} border`}>
                    <Home className="h-5 w-5" />
                  </div>
                </div>
                <span className="mt-2 text-xs font-semibold text-slate-700">Home {node.id + 1}</span>
                <span className={`mt-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${stateStyles[state]}`}>{state}</span>
              </motion.div>
            );
          })}

          {route.length > 1 && (
            <>
              <motion.div
                className="pointer-events-none absolute z-40 h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.95)]"
                initial={{ x: route[0].x, y: route[0].y, scale: 0.85 }}
                animate={{ x: route[1].x, y: route[1].y, scale: [0.85, 1.1, 0.85] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
              />
              <Packet from={route[0]} to={route[1]} active delay={0} />
              <Packet from={route[1]} to={route[2]} active delay={0.2} soft />
            </>
          )}

          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
            {[
              "Clients training locally",
              dp ? "Applying differential privacy" : "No privacy noise",
              "Sending encrypted updates",
              "Aggregating global model"
            ].map((item, index) => (
              <div key={item} className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${index === storyStep ? "bg-blue-600 text-white" : "bg-white/85 text-slate-600"}`}>
                {index === storyStep && <Zap className="mr-1 inline-block h-3.5 w-3.5" />}
                {item}
              </div>
            ))}
          </div>

          <div className="absolute left-6 top-6 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
            Multi-hop routing active
          </div>
          {dp && <div className="absolute right-6 top-6 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">DP noise layer enabled</div>}
          {smpc && <div className="absolute right-6 bottom-6 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">SMPC masked updates enabled</div>}
        </div>
      </motion.div>
    </div>
  );
}
