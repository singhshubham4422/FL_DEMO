"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function Chart({ data, color = "#00D4FF", height = 180 }) {
  return (
    <div className="w-full h-full rounded-3xl bg-white/60 border border-white/60 shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-3">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="round" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(255,255,255,0.96)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 16,
              boxShadow: '0 18px 30px rgba(15,23,42,0.12)'
            }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
