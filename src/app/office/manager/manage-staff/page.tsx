"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ManageStaffTable from "./components/manage-staff-table";
import { ManageStaffSkeleton } from "./components/manage-staff-skeleton";

export default function ManageStaff() {
    return (
        <div className="w-full h-full overflow-auto  px-1">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Staff</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<ManageStaffSkeleton />}>
                        <ManageStaffTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}











