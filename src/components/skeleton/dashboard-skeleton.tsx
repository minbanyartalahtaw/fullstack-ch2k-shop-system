import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-4">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="h-3.5 w-52" />
      </CardHeader>
      <CardContent>
        <SkeletonBlock className="h-[240px] w-full" />
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <SkeletonBlock className="h-5 w-24" />
        <SkeletonBlock className="h-4 w-4 rounded-sm" />
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="space-y-6">
        {/* Chart cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>

        {/* Stat cards */}
        <div className="grid">
          <ChartCardSkeleton />
        </div>
      </div>
    </div>
  );
}
