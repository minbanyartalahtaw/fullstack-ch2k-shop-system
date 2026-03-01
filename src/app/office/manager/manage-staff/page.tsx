"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Suspense } from "react";
//import { ManageStaffSkeleton } from "./components/manage-staff-skeleton";
import ManageStaffTable from "./components/manage-staff-table";

export default function ManageStaff() {
  return (
    <div className="w-full h-full overflow-auto  px-1">
<<<<<<< HEAD
      <Card variant={"noborder"}>
=======
      <Card>
>>>>>>> 19ef8e4 (add light mode & dark mode)
        <CardHeader>
          <CardTitle>ဝန်ထမ်းဆိုင်ရာ</CardTitle>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          {/* <Suspense fallback={<ManageStaffSkeleton />}> */}
          <ManageStaffTable />
          {/* </Suspense> */}
=======
          <Suspense fallback={<ManageStaffSkeleton />}>
            <ManageStaffTable />
          </Suspense>
>>>>>>> 19ef8e4 (add light mode & dark mode)
        </CardContent>
      </Card>
    </div>
  );
}
