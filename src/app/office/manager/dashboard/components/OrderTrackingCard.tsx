"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Pie, PieChart, Label } from "recharts";
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
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";

const COLORS = {
  completed: { light: "#10B981", dark: "#34D399" }, // Green
  remaining: { light: "#F43F5E", dark: "#FB7185" }, // Red
};

interface Props {
  orderedProducts: number;
  takenProducts: number;
}

export default function OrderTrackingCard({
  orderedProducts,
  takenProducts,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const remaining = Math.max(orderedProducts - takenProducts, 0);

  const completedColor = isDark ? COLORS.completed.dark : COLORS.completed.light;
  const remainingColor = isDark ? COLORS.remaining.dark : COLORS.remaining.light;

  const data = [
    { name: "ပစ္စည်းပေးပြီး", value: takenProducts, fill: completedColor },
    { name: "ကျန်အော်ဒါ", value: remaining, fill: remainingColor },
  ];

  const config: ChartConfig = {
    completed: { label: "ပစ္စည်းပေးပြီး", color: completedColor },
    remaining: { label: "ကျန်အော်ဒါ", color: remainingColor },
  };

  if (orderedProducts === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>အော်ဒါပစ္စည်းများ</CardDescription>
          
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center">
          <p className="text-sm text-muted-foreground">အော်ဒါမရှိသေးပါ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>အော်ဒါပစ္စည်းများ</CardDescription>

      </CardHeader>

      <CardContent>
        <div className="h-[200px] sm:h-[240px]">
          <ChartContainer config={config} className="aspect-auto h-full w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie
                data={data}
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
                            {orderedProducts}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2 text-xs">
          {data.map((d) => (
            <span key={d.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: d.fill }}
              />
              <span className="text-muted-foreground">
                {d.name} ({d.value})
              </span>
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Link href="/office/staff/order" className="w-full">
          <Button variant="outline" className="w-full">
            အသေးစိတ်ကြည့်ရန်
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
