"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Suspense } from "react";
//import { ManageStaffSkeleton } from "./components/manage-staff-skeleton";
import ManageStaffTable from "./components/manage-staff-table";

export default function ManageStaff() {
  return (
    <div className="w-full h-full overflow-auto  px-1">
      <Card variant={"noborder"}>
        <CardHeader>
          <CardTitle>ဝန်ထမ်းဆိုင်ရာ</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Suspense fallback={<ManageStaffSkeleton />}> */}
          <ManageStaffTable />
          {/* </Suspense> */}
        </CardContent>
      </Card>
    </div>
  );
}
