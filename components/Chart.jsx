"use client";
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function Chart({ data, color = "#00D4FF", height = 180 }) {
  const gradientId = `chart-gradient-${color.replace("#", "")}`;

  return (
    <div className="w-full h-full rounded-3xl border border-slate-200 bg-white/85 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.85} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="round" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.98)",
              border: "none",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
