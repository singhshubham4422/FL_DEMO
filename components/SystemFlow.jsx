"use client";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, UploadCloud, Sparkles } from "lucide-react";

export default function SystemFlow({ step = 0, dp = false, smpc = false }) {
  const steps = [
    { title: "Local Training", icon: Sparkles, hint: "nodes glow and learn" },
    { title: "Upload Updates", icon: UploadCloud, hint: "packets flow to the grid" },
    { title: "Aggregation", icon: ShieldCheck, hint: "server merges secure updates" }
  ];

  return (
    <div className="premium-panel p-5 space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="metric-label">Simulation Story</div>
          <div className="text-lg font-semibold text-slate-900">What is happening in the federated round?</div>
        </div>
        <div className="text-xs font-semibold rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-100">Round {step + 1} / 3</div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {steps.map(({ title, icon: Icon, hint }, index) => {
          const active = step === index;
          return (
            <motion.div
              key={title}
              animate={{ y: active ? -4 : 0, scale: active ? 1.02 : 1 }}
              transition={{ duration: 0.35 }}
              className={`rounded-2xl border p-4 ${active ? 'bg-white shadow-xl shadow-blue-100 border-blue-200' : 'bg-white/70 border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{title}</div>
                  <div className="text-xs text-slate-500">{hint}</div>
                </div>
              </div>
              {active && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" /> Active step in progress
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {dp && <div className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold border border-blue-100">DP noise injection enabled</div>}
        {smpc && <div className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold border border-emerald-100">SMPC masked updates enabled</div>}
        {!dp && !smpc && <div className="rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-semibold border border-slate-200">Baseline federated flow</div>}
      </div>
    </div>
  );
}
