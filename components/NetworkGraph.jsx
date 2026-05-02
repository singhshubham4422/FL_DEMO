"use client";
import { motion } from "framer-motion";

export default function NetworkGraph({ clients = 8, active = 0, round = 0, dp = false, smpc = false }) {
  const size = 400;
  const radius = 140;
  const center = { x: size / 2, y: size / 2 };
  const nodes = Array.from({ length: clients });

  return (
    <div className="relative w-full h-[420px] flex items-center justify-center">
      <svg width={size} height={size} className="absolute left-0 top-0">
        {nodes.map((_, i) => {
          const angle = (i / clients) * 2 * Math.PI;
          const x = center.x + Math.cos(angle) * radius;
          const y = center.y + Math.sin(angle) * radius;
          return (
            <line
              key={i}
              x1={center.x}
              y1={center.y}
              x2={x}
              y2={y}
              stroke={i < active ? "#00D4FF" : "rgba(255,255,255,0.06)"}
              strokeWidth={i < active ? 2.5 : 1}
              opacity={i < active ? 0.95 : 0.6}
            />
          );
        })}
      </svg>

      <div className="absolute flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00223B] to-[#003A5C] glass neon">
        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xs text-center">
          Server
        </motion.div>
      </div>

      {nodes.map((_, i) => {
        const angle = (i / clients) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = i < active;

        return (
          <motion.div
            key={i}
            animate={{ scale: isActive ? [1, 1.25, 1] : [1, 1, 1] }}
            transition={{ repeat: Infinity, duration: isActive ? 1.6 : 3 }}
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-neon-green text-black" : "bg-white/5 text-gray-300"}`}
            style={{ transform: `translate(${x + center.x - 16}px, ${y + center.y - 16}px)` }}
          >
            <div className="text-[10px]">H{i + 1}</div>
          </motion.div>
        );
      })}

      {/* DP / SMPC overlays */}
      {dp && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-6 top-6 text-xs text-neon-blue/70">DP: noise injections</div>
        </div>
      )}
      {smpc && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-6 bottom-6 text-xs text-neon-green/70">SMPC: masked updates</div>
        </div>
      )}
    </div>
  );
}
