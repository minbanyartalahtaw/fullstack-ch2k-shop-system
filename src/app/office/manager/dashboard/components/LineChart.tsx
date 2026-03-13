"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface LineChartData {
  month: string;
  total: number;
  order: number;
  sell: number;
}

const chartConfig = {
  total: {
    label: "စုစုပေါင်းဘောက်ချာ",
    theme: { light: "#3B82F6", dark: "#60A5FA" }, // Blue
  },
  order: {
    label: "အော်ဒါဘောက်ချာ",
    theme: { light: "#10B981", dark: "#34D399" }, // Emerald
  },
  sell: {
    label: "အရောင်းဘောက်ချာ",
    theme: { light: "#F59E0B", dark: "#FCD34D" }, // Amber
  },
} satisfies ChartConfig;

export default function LineChart({ data }: { data: LineChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ဘောက်ချာအရေအတွက်</CardTitle>
        <CardDescription>၆ လအတွင်း ဘောက်ချာများ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full sm:h-[300px]">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradOrder" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-order)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-order)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradSell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sell)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-sell)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 10 }}
                allowDecimals={false}
                width={28}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={
                  <ChartLegendContent className="flex-wrap gap-x-4 gap-y-1" />
                }
              />
              <Area
                dataKey="total"
                type="monotone"
                stroke="var(--color-total)"
                strokeWidth={2}
                fill="url(#gradTotal)"
                dot={{ r: 3, fill: "var(--color-total)" }}
                activeDot={{ r: 5 }}
              />
              <Area
                dataKey="order"
                type="monotone"
                stroke="var(--color-order)"
                strokeWidth={2}
                fill="url(#gradOrder)"
                dot={{ r: 3, fill: "var(--color-order)" }}
                activeDot={{ r: 5 }}
              />
              <Area
                dataKey="sell"
                type="monotone"
                stroke="var(--color-sell)"
                strokeWidth={2}
                fill="url(#gradSell)"
                dot={{ r: 3, fill: "var(--color-sell)" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
