"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ManageStaffTable from "./components/manage-staff-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";

export default function ManageStaff() {
  return (
    <div className="w-full h-full overflow-auto pt-4">
      <Card>
        <CardHeader>
          <CardTitle>ဝန်ထမ်းဆိုင်ရာ</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <ManageStaffTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
