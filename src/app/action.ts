"use server"
import { signJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
    const phoneNumber = formData.get('phoneNumber');
    const password = formData.get('password');

    const result = await prisma.staff.findUnique({
        where: {
            phone: phoneNumber as string,
            password: password as string,
        },
        select: {
            role: true,
            staffId: true,
        }
    })
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (!result) {
        return { success: false, message: "မှားယွင်းနေပါသည်" }
    }
    const token = await signJwt({
        staffId: result.staffId,
        role: result.role,
    });
    (await cookies()).set({
        name: "staff-token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only secure in production
        sameSite: "lax", // "strict" may block cross-device requests
        path: "/",        // make sure cookie is sent for all routes
    });

    return { success: true, message: "Login successful" }
}
