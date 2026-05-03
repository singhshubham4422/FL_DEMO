"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Home, Zap, UtilityPole, Radio, Activity, ShieldCheck } from "lucide-react";

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
  // Build a mesh-like topology instead of simple ring
  for (let i = 0; i < clients; i += 1) {
    // connect to next
    edges.push([i, (i + 1) % clients]);
    // connect across
    edges.push([i, (i + Math.floor(clients / 3)) % clients]);
    // random extra connection for mesh feel
    if (i % 2 !== 0) {
      edges.push([i, (i + Math.floor(clients / 2)) % clients]);
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
  
  // Generate a dynamic route per round
  const route = useMemo(() => {
    if (!nodes.length) return [];
    
    // Create a 2-4 hop route randomly based on the round
    const numHops = 2 + (round % 3); 
    const currentRoute = [nodes[sourceIndex]];
    let current = sourceIndex;
    
    for(let i = 0; i < numHops - 1; i++) {
        const nextNodeIdx = (current + 2 + i) % clients;
        currentRoute.push(nodes[nextNodeIdx]);
        current = nextNodeIdx;
    }
    currentRoute.push(server);
    return currentRoute;
  }, [nodes, sourceIndex, round, clients]);

  const storyStep = round % 4;
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: index,
        x: (index % 4) * 100 - 150,
        y: Math.floor(index / 4) * 100 - 50,
        delay: index * 0.35,
        duration: 3 + (index % 2) * 1.5,
        color: index % 2 === 0 ? "bg-blue-400" : "bg-emerald-400"
      })),
    []
  );

  return (
    <div
      className="premium-panel group relative h-[520px] md:h-[640px] lg:h-[720px] overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 p-5 shadow-2xl shadow-blue-900/5"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 15, y: y * -15 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-emerald-50/40"
        animate={{ opacity: dp ? [0.6, 1, 0.6] : [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Animated Scanlines */}
      <div className="absolute inset-0 grid-faint opacity-40 mix-blend-overlay" />
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)] h-[200%] w-full pointer-events-none"
        animate={{ translateY: ["-50%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-blue-400/20 blur-[60px]"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-4 bottom-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-[60px]"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {dp && (
        <motion.div
          className="absolute inset-0 bg-blue-300/10 mix-blend-multiply"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        className="absolute inset-0"
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative z-10 flex h-full w-full items-center justify-center p-2">
          <div className="relative w-full max-w-[480px] aspect-square">
            <svg viewBox="-240 -240 480 480" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-sm">
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
                      stroke={activeEdge ? "#3b82f6" : "#cbd5e1"}
                      strokeWidth={activeEdge ? 4 : 1.5}
                      strokeLinecap="round"
                      opacity={activeEdge ? 0.9 : 0.5}
                      strokeDasharray={smpc && !activeEdge ? "4 6" : undefined}
                    />
                    {activeEdge && (
                       <line
                         x1={from.x}
                         y1={from.y}
                         x2={to.x}
                         y2={to.y}
                         stroke="#60a5fa"
                         strokeWidth={12}
                         strokeLinecap="round"
                         opacity={0.3}
                         style={{ filter: "blur(4px)" }}
                       />
                    )}
                  </g>
                );
              })}
            </svg>

            {particles.map((particle, index) => (
              <motion.div
                key={particle.id}
                className={`absolute z-10 h-2 w-2 rounded-full ${particle.color} mix-blend-multiply blur-[1px]`}
                style={{ transform: "translate(-50%, -50%)" }}
                animate={{
                  left: [`${50 + (particle.x / 240) * 50}%`, `${50 + ((particle.x + (index % 2 === 0 ? 25 : -20)) / 240) * 50}%`, `${50 + (particle.x / 240) * 50}%`],
                  top: [`${50 + (particle.y / 240) * 50}%`, `${50 + ((particle.y - 20) / 240) * 50}%`, `${50 + (particle.y / 240) * 50}%`],
                  opacity: [0, 0.6, 0],
                  scale: [0.8, 1.5, 0.8]
                }}
                transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
              />
            ))}

            {/* Central Grid Server */}
            <motion.div 
              className="absolute z-30 flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-[4px] border-blue-500/80 shadow-[0_0_40px_rgba(59,130,246,0.6)]"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              animate={{ 
                scale: [1, 1.08, 1], 
                boxShadow: ["0 0 40px rgba(59,130,246,0.4)", "0 0 70px rgba(59,130,246,0.8)", "0 0 40px rgba(59,130,246,0.4)"] 
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
               <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md" />
               <Zap className="relative z-10 h-6 w-6 md:h-8 md:w-8 text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
            </motion.div>

            {nodes.map((node, index) => {
              const isActive = index < active;
              const isSource = sourceIndex === index;
              const isRelay = route.some(r => r.id === node.id && r.id !== undefined && !isSource);
              
              const state = isSource
                ? "sending"
                : isRelay 
                  ? "relay"
                  : isActive
                    ? storyStep === 0
                      ? "training"
                      : storyStep === 1
                        ? "idle"
                        : storyStep === 2
                          ? "aggregating"
                          : "training"
                    : index === active
                      ? "dropped"
                      : "idle";

              const stateStyles = {
                training: "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-emerald-500/20",
                sending: "bg-blue-50 text-blue-700 border-blue-300 shadow-blue-500/30",
                relay: "bg-cyan-50 text-cyan-700 border-cyan-300 shadow-cyan-500/20",
                aggregating: "bg-amber-50 text-amber-700 border-amber-300 shadow-amber-500/20",
                dropped: "bg-rose-50 text-rose-700 border-rose-300 shadow-rose-500/20",
                idle: "bg-slate-50 text-slate-500 border-slate-200 shadow-slate-500/5"
              };

              return (
                <motion.div
                  key={node.id}
                  animate={{
                    top: [`${50 + (node.y / 240) * 50}%`, `${50 + ((node.y - (isActive ? 12 : 4)) / 240) * 50}%`, `${50 + (node.y / 240) * 50}%`],
                    scale: isSource || isRelay ? [1, 1.15, 1] : isActive ? [1, 1.05, 1] : [1, 1, 1]
                  }}
                  transition={{ duration: isActive || isSource || isRelay ? 2.5 : 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute z-20 flex flex-col items-center"
                  style={{ left: `${50 + (node.x / 240) * 50}%`, transform: "translate(-50%, -50%)" }}
                >
                  {/* Glowing Aura for Active Routes */}
                  {(isSource || isRelay) && (
                     <motion.div 
                       className={`absolute inset-0 -z-10 rounded-full blur-xl opacity-60 ${isSource ? 'bg-blue-500' : 'bg-cyan-400'}`} 
                       animate={{ scale: [1, 1.5, 1] }} 
                       transition={{ duration: 2, repeat: Infinity }} 
                     />
                  )}
                  <div className={`rounded-xl md:rounded-[20px] border-2 bg-white/90 p-1 md:p-[6px] backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 ${dp ? "opacity-95" : "opacity-100"} ${smpc ? "border-dashed" : "border-solid"} ${smpc ? "blur-[0.5px]" : ""}`}>
                    <div className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl ${stateStyles[state]} border`}>
                      <Home className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </div>
                  <span className="mt-2 md:mt-3 rounded-md bg-white/60 px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs font-bold text-slate-800 backdrop-blur-sm shadow-sm hidden sm:block">Home {node.id + 1}</span>
                  <span className={`mt-1 md:mt-1.5 rounded-full border px-2 py-0.5 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm backdrop-blur-sm hidden sm:block ${stateStyles[state]}`}>{state}</span>
                </motion.div>
              );
            })}

            {/* Render Packets along the entire route */}
            {route.length > 1 && route.map((node, i) => {
              if(i === route.length - 1) return null;
              return <Packet key={`packet-${i}`} from={node} to={route[i+1]} active delay={i * 0.25} soft={i > 0} />;
            })}
          </div>

          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex flex-wrap gap-2 pr-4">
            {[
              "Clients training locally",
              dp ? "Applying differential privacy" : "No privacy noise",
              "AODV Route Discovery & Sending",
              "Aggregating global model"
            ].map((item, index) => (
              <div key={item} className={`rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold shadow-md transition-all ${index === storyStep ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-105" : "bg-white/90 text-slate-600 backdrop-blur-md border border-slate-200/60 hidden sm:block"}`}>
                {index === storyStep && <Activity className="mr-1 md:mr-1.5 inline-block h-3 w-3 md:h-4 md:w-4" />}
                {item}
              </div>
            ))}
          </div>

          <div className="absolute left-4 top-4 md:left-6 md:top-6 rounded-2xl bg-white/90 p-3 md:p-4 shadow-xl backdrop-blur-md max-w-[200px] md:max-w-xs border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] mb-1.5">
              <Radio className="h-3 w-3 md:h-4 md:w-4 animate-pulse" /> <span className="hidden sm:inline">AODV Active</span> Route
            </div>
            <div className="text-xs md:text-sm font-medium text-slate-600">
               <strong className="text-slate-900">{route.length - 1} hops</strong> <span className="hidden sm:inline">dynamically generated this round.</span>
            </div>
          </div>
          {dp && <div className="absolute right-4 top-4 md:right-6 md:top-6 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-blue-700 shadow-lg flex items-center gap-1.5 md:gap-2"><ShieldCheck className="h-3 w-3 md:h-4 md:w-4"/> <span className="hidden sm:inline">DP Noise Layer Active</span><span className="sm:hidden">DP</span></div>}
          {smpc && <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-emerald-700 shadow-lg flex items-center gap-1.5 md:gap-2"><ShieldCheck className="h-3 w-3 md:h-4 md:w-4"/> <span className="hidden sm:inline">SMPC Masked Updates</span><span className="sm:hidden">SMPC</span></div>}
          {!dp && !smpc && <div className="absolute right-4 top-4 md:right-6 md:top-6 rounded-full bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-slate-700 shadow-lg flex items-center gap-1.5 md:gap-2"><ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-slate-400"/> <span className="hidden sm:inline">Baseline Mode</span><span className="sm:hidden">Baseline</span></div>}
        </div>
      </motion.div>
    </div>
  );
}
