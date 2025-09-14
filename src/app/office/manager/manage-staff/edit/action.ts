import prisma from "@/lib/prisma";


export type Staff = {
    id: number;
    staffId: string;
    name: string;
    email: string | null;
    phone: string;
    address: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    isFire: boolean;
}


export async function getStaff() {
    try {
        await new Promise(resolve => setTimeout(resolve, 5000))
        const staffData: Staff[] = await prisma.staff.findMany({
            select: {
                id: true,
                staffId: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                isFire: true,
                password: false
            }
        })
        return staffData
    } catch (error) {
        console.error('Failed to fetch staff:', error)
        throw new Error('Failed to fetch staff')
    }
}