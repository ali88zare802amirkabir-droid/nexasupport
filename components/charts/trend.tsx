// @ts-nocheck
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  data: any[];
  color?: string;
  height?: number;
  className?: string;
  showArea?: boolean;
}

export function TrendChart({ data, color = "#55a1ff", height = 200, className, showArea = true }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--edge)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-sans)" }}
          axisLine={false}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--edge)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-elevated)",
            color: "var(--ink)",
          }}
          labelStyle={{ color: "var(--ink-3)", fontSize: 11 }}
          formatter={(value: number) => [value, ""]}
        />
        {showArea && (
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={0.15}
            fill={color}
            connectNulls
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, stroke: color, fill: "var(--bg)" }}
          activeDot={{ r: 6, strokeWidth: 3 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}