"use client";
import { motion } from "framer-motion";

export default function SystemFlow({ step = 0, dp = false, smpc = false }) {
  const steps = ["Local Training", "Upload Updates", "Aggregation"];

  return (
    <div className="p-4 glass space-y-4 w-full">
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <motion.div
              animate={{ scale: step === i ? 1.06 : 1 }}
              transition={{ duration: 0.6 }}
              className={`p-3 rounded ${step === i ? 'bg-white/5' : 'bg-transparent'}`}
            >
              <div className="text-sm">{s}</div>
              {i === 0 && step === 0 && <div className="mt-2 text-xs text-neon-green">nodes glow</div>}
              {i === 1 && step === 1 && <div className="mt-2 text-xs text-neon-blue">arrows move</div>}
              {i === 2 && step === 2 && <div className="mt-2 text-xs text-neon-blue">server aggregates</div>}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {dp && <div className="p-2 text-xs text-neon-blue">Noise injection active</div>}
        {smpc && <div className="p-2 text-xs text-neon-green">Masked updates visual</div>}
      </div>
    </div>
  );
}
