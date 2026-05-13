"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ManageStaffTable from "./components/manage-staff-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ManageStaff() {
    const isMobile = useIsMobile();
  return (
    <div className="w-full h-full overflow-auto ">
      <Card variant={'transparent'}>
{/*         <CardHeader>
          <CardTitle>ဝန်ထမ်းဆိုင်ရာ</CardTitle>
        </CardHeader> */}
        <CardContent className={`${isMobile ? "p-3" : ""}`}>
          <Suspense fallback={<TableSkeleton />}>
            <ManageStaffTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
