
import prisma from '@/lib/prisma'
import StaffEditForm from "./components/StaffEditForm"
import { getStaff, Staff } from "./action"

export default async function StaffEditPage() {
    const StaffData: Staff[] = await getStaff()
    if (StaffData.length === 0) return null
    return (
        <div className="px-1">
            <StaffEditForm staffData={StaffData} />
        </div>
    )
}