"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

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

function Packet({ from, to, active, delay = 0 }) {
  const path = `${from.x},${from.y} ${to.x},${to.y}`;

  return active ? (
    <motion.div
      className="absolute z-20 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.8)]"
      initial={{ x: from.x, y: from.y, opacity: 0.3, scale: 0.9 }}
      animate={{ x: to.x, y: to.y, opacity: [0.3, 1, 0.2], scale: [0.9, 1.3, 0.9] }}
      transition={{ duration: 1.1, repeat: Infinity, repeatDelay: delay, ease: "easeInOut" }}
      style={{ left: 200, top: 200, translateX: "-50%", translateY: "-50%" }}
      data-path={path}
    />
  ) : null;
}

export default function NetworkGraph({ clients = 8, active = 0, round = 0, dp = false, smpc = false }) {
  const { nodes, edges } = useMemo(() => buildGraph(clients), [clients]);
  const server = { x: 0, y: 0 };
  const sourceIndex = round > 0 ? (round - 1) % clients : 0;
  const route = useMemo(() => {
    if (!nodes.length) return [];
    const middle = Math.max(1, Math.floor(sourceIndex / 2));
    return [nodes[sourceIndex], nodes[middle], server];
  }, [nodes, sourceIndex]);

  return (
    <div className="premium-panel relative h-[520px] overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 p-5">
      <div className="absolute inset-0 grid-faint opacity-40" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <svg viewBox="-240 -240 480 480" className="absolute h-full w-full overflow-visible">
          {edges.map(([a, b], index) => {
            const from = nodes[a];
            const to = nodes[b];
            const activeEdge = route.some((node, routeIndex) => routeIndex > 0 && route[routeIndex - 1] && route[routeIndex - 1].id === a && node.id === b);
            return (
              <g key={`${a}-${b}-${index}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={activeEdge ? "#2563eb" : "#cbd5e1"}
                  strokeWidth={activeEdge ? 2.8 : 1.4}
                  strokeLinecap="round"
                  opacity={activeEdge ? 0.95 : 0.7}
                />
              </g>
            );
          })}
        </svg>

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
          return (
            <motion.div
              key={node.id}
              animate={{ y: [node.y, node.y - (isActive ? 8 : 2), node.y] }}
              transition={{ duration: isActive ? 2.3 : 3.2, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute z-20 flex h-14 w-14 items-center justify-center rounded-2xl border text-xs font-semibold shadow-lg ${isSource ? "border-blue-400 bg-blue-600 text-white" : isActive ? "border-emerald-200 bg-emerald-400 text-slate-900" : "border-slate-200 bg-white text-slate-600"}`}
              style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: "translate(-50%, -50%)" }}
            >
              H{node.id + 1}
            </motion.div>
          );
        })}

        {route.length > 1 && (
          <motion.div
            className="pointer-events-none absolute z-40 h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.9)]"
            initial={{ x: route[0].x, y: route[0].y }}
            animate={{ x: route[1].x, y: route[1].y }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
          />
        )}

        {route.slice(0, -1).map((point, index) => (
          <Packet
            key={`${round}-${index}`}
            from={point}
            to={route[index + 1]}
            active={route.length > 1}
            delay={index * 0.2}
          />
        ))}

        <div className="absolute left-6 top-6 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          Multi-hop routing active
        </div>
        {dp && <div className="absolute right-6 top-6 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">DP noise layer enabled</div>}
        {smpc && <div className="absolute right-6 bottom-6 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">SMPC masked updates enabled</div>}
      </div>
    </div>
  );
}
