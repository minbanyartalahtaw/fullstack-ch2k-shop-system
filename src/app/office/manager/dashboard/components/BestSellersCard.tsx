"use client";

import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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

interface BestSeller {
  name: string;
  invoiceCount: number;
}

interface Props {
  data: BestSeller[];
}

export default function BestSellersCard({ data }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const getColor = (i: number) => {
    const p = PALETTE[i % PALETTE.length];
    return isDark ? p.dark : p.light;
  };

  const chartData = data.map((d, i) => ({
    name: d.name,
    value: d.invoiceCount,
    fill: getColor(i),
  }));

  const BarTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string }; value: number; fill: string }[];
  }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
      <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md flex items-center gap-1.5">
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-sm"
          style={{ backgroundColor: item.fill }}
        />
        <span className="font-medium">{item.payload.name}</span>
        <span className="text-muted-foreground">{item.value} ခု</span>
      </div>
    );
  };

  const config = Object.fromEntries(
    data.map((d, i) => [`item${i}`, { label: d.name, color: getColor(i) }]),
  ) as ChartConfig;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>ဝန်ထမ်းများအရောင်း</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center">
          <p className="text-sm text-muted-foreground">ဒေတာမရှိသေးပါ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>ဝန်ထမ်းများအရောင်းဘောက်ချာ</CardDescription>
        
      </CardHeader>

      <CardContent>
        <div className="h-[200px] sm:h-[240px]">
          <ChartContainer config={config} className="aspect-auto h-full w-full">
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
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                content={<BarTooltip />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={d.name} fill={getColor(i)} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2 text-xs">
          {data.map((d, i) => (
            <span key={d.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: getColor(i) }}
              />
              <span className="text-muted-foreground">
                {d.name} ({d.invoiceCount})
              </span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
