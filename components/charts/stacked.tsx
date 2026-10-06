// @ts-nocheck
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface StackedBarChartProps {
  data: any[];
  keys: string[];
  colors: string[];
  height?: number;
  className?: string;
}

export function StackedBarChart({ data, keys, colors, height = 220, className }: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--edge)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--edge)", borderRadius: "12px", boxShadow: "var(--shadow-elevated)", color: "var(--ink)" }}
          labelStyle={{ color: "var(--ink-3)", fontSize: 11 }}
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ paddingBottom: 10 }}
        />
        {keys.map((key, index) => (
          <Bar key={key} dataKey={key} stackId="a" fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} barSize={32} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}