// @ts-nocheck
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface DonutChartProps {
  data: any[];
  height?: number;
  className?: string;
  innerRadius?: number;
}

export function DonutChart({ data, height = 220, className, innerRadius = 70 }: DonutChartProps) {
  const COLORS = ["var(--accent)", "var(--cyan)", "var(--ok)", "var(--warn)", "var(--danger)", "var(--ink-3)"];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="label"
          label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--edge)", borderRadius: "12px", boxShadow: "var(--shadow-elevated)", color: "var(--ink)" }}
          formatter={(value: number) => [value, ""]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ paddingTop: 20 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}