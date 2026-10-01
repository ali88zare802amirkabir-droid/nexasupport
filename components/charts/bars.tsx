// @ts-nocheck
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface CountBarChartProps {
  data: any[];
  height?: number;
  className?: string;
  layout?: "vertical" | "horizontal";
  maxValue?: number;
}

export function CountBarChart({ data, height = 220, className, layout = "vertical", maxValue }: CountBarChartProps) {
  const maxVal = maxValue ?? Math.max(...data.map((d) => d.value)) * 1.2;

  if (layout === "horizontal") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--edge)" horizontal={false} />
          <XAxis type="number" domain={[0, maxVal]} tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)", textAnchor: "start" }} axisLine={false} tickLine={false} width={80} />
          <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--edge)", borderRadius: "12px", boxShadow: "var(--elevated)", color: "var(--ink)" }} labelStyle={{ color: "var(--ink-3)", fontSize: 11 }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || "var(--accent)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--edge)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, maxVal]} tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--edge)", borderRadius: "12px", boxShadow: "var(--elevated)", color: "var(--ink)" }} labelStyle={{ color: "var(--ink-3)", fontSize: 11 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || "var(--accent)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}