"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export function Chart({ data, color = "#00D4FF", height = 180, title }) {
  const gradientId = `chart-gradient-${color.replace("#", "")}`;
  const isMulti = data && data.length > 0 && "baseline" in data[0];

  return (
    <div className="w-full flex flex-col rounded-3xl border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-4 shadow-lg backdrop-blur-md">
      {title && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {title}
        </div>
      )}
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="grad-baseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="grad-dp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="grad-smpc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
            <XAxis 
              dataKey="round" 
              stroke="#94a3b8" 
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={8}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(226,232,240,0.8)",
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
                padding: "8px 12px"
              }}
              itemStyle={{ fontWeight: 700 }}
              cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.4 }}
            />
            {isMulti && (
              <Legend 
                verticalAlign="top" 
                height={20}
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748b', paddingBottom: '10px' }}
                iconType="circle"
              />
            )}
            
            {isMulti ? (
              <>
                <Area name="Baseline" type="monotone" dataKey="baseline" stroke="#2563eb" strokeWidth={2} fill="url(#grad-baseline)" activeDot={{ r: 4 }} />
                <Area name="DP" type="monotone" dataKey="dp" stroke="#10b981" strokeWidth={2} fill="url(#grad-dp)" activeDot={{ r: 4 }} />
                <Area name="DP + SMPC" type="monotone" dataKey="smpc" stroke="#ef4444" strokeWidth={2} fill="url(#grad-smpc)" activeDot={{ r: 4 }} />
              </>
            ) : (
              <Area 
                name="Value"
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={3} 
                fill={`url(#${gradientId})`} 
                activeDot={{ r: 5, strokeWidth: 0, fill: color, style: { filter: `drop-shadow(0px 4px 8px ${color}80)` } }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
