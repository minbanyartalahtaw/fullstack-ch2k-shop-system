"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import {
  ChartConfig,
  ChartContainer,
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

const PALETTE = [
  { light: "#3B82F6", dark: "#60A5FA" },
  { light: "#10B981", dark: "#34D399" },
  { light: "#F59E0B", dark: "#FCD34D" },
  { light: "#F43F5E", dark: "#FB7185" },
  { light: "#8B5CF6", dark: "#A78BFA" },
  { light: "#F97316", dark: "#FB923C" },
  { light: "#0EA5E9", dark: "#38BDF8" },
  { light: "#14B8A6", dark: "#2DD4BF" },
];

export default function ProductTypeSalesChart({
  data,
  types,
}: {
  data: Record<string, string | number>[];
  types: string[];
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const getColor = (i: number) => {
    const p = PALETTE[i % PALETTE.length];
    return isDark ? p.dark : p.light;
  };

  const chartConfig = Object.fromEntries(
    types.map((type, i) => [type, { label: type, color: getColor(i) }]),
  ) as ChartConfig;

  if (data.length === 0 || types.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
          <CardDescription>၆ လအတွင်းရောင်းရသောပစ္စည်းအမျိုးအစားများ</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">ဒေတာမရှိသေးပါ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
        <CardDescription>၆ လအတွင်းရောင်းရသောပစ္စည်းအမျိုးအစားများ</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full sm:h-[300px]"
        >
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              allowDecimals={false}
              width={28}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {types.map((type, i) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="a"
                fill={getColor(i)}
                radius={i === types.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ChartContainer>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {types.map((type, i) => (
            <span key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: getColor(i) }}
              />
              <span className="text-muted-foreground">{type}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
