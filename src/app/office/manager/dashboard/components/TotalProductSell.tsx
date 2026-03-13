"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Pie,
  PieChart,
  Label,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppIcon } from "@/components/app-icons";

const PALETTE = [
  { light: "#3B82F6", dark: "#60A5FA" }, // Blue
  { light: "#10B981", dark: "#34D399" }, // Emerald
  { light: "#F59E0B", dark: "#FCD34D" }, // Amber
  { light: "#F43F5E", dark: "#FB7185" }, // Rose
  { light: "#8B5CF6", dark: "#A78BFA" }, // Violet
  { light: "#F97316", dark: "#FB923C" }, // Orange
  { light: "#0EA5E9", dark: "#38BDF8" }, // Sky
  { light: "#14B8A6", dark: "#2DD4BF" }, // Teal
];

interface DoughnutChartProps {
  data: { name: string; value: number }[];
}

export default function TotalProductSell({ data }: DoughnutChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [chartType, setChartType] = useState<"donut" | "bar">("donut");

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const getColor = (i: number) => {
    const p = PALETTE[i % PALETTE.length];
    return isDark ? p.dark : p.light;
  };

  const chartData = data.map((d, i) => ({ ...d, fill: getColor(i) }));

  const config = Object.fromEntries(
    data.map((d, i) => [`item${i}`, { label: d.name, color: getColor(i) }]),
  ) as ChartConfig;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
          <CardDescription>
            ပစ္စည်းများ၏ အမျိုးအစားအလိုက် ခွဲခြမ်းမှု
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            ပစ္စည်းအမျိုးအစား မရှိသေးပါ
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
          <CardDescription>
            ပစ္စည်းများ၏ အမျိုးအစားအလိုက် ခွဲခြမ်းမှု
          </CardDescription>
        </div>
        <div className="flex gap-1">
          <Button
            variant={chartType === "donut" ? "outline" : "ghost"}
            size="sm"
            onClick={() => setChartType("donut")}>
            <AppIcon name="Pie" />
          </Button>
          <Button
            variant={chartType === "bar" ? "outline" : "ghost"}
            size="sm"
            onClick={() => setChartType("bar")}>
            <AppIcon name="LineChart" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[200px] sm:h-[240px]">
          <ChartContainer config={config} className="aspect-auto h-full w-full">
            {chartType === "donut" ? (
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="52%"
                  outerRadius="80%"
                  strokeWidth={2}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const cx = viewBox.cx ?? 0;
                        const cy = viewBox.cy ?? 0;
                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle">
                            <tspan
                              x={cx}
                              y={cy - 10}
                              style={{
                                fill: "var(--muted-foreground)",
                                fontSize: "12px",
                              }}>
                              စုစုပေါင်း
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 16}
                              style={{
                                fill: "var(--foreground)",
                                fontSize: "28px",
                                fontWeight: "bold",
                              }}>
                              {total}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={d.name} fill={getColor(i)} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ChartContainer>
        </div>

        {/* Legend rendered outside SVG so CSS vars from PALETTE apply correctly */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2 text-xs">
          {data.map((d, i) => (
            <span key={d.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: getColor(i) }}
              />
              <span className="text-muted-foreground">{d.name}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
