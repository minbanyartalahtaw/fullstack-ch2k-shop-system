"use server";
import { signJwt } from "@/lib/jwt";
import { checkRate } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function checkHasUsers(): Promise<boolean> {
  const count = await prisma.staff.count({ take: 1 });
  return count > 0;
}

export async function loginAction(formData: FormData) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "unknown";

  const rate = checkRate(ip);
  if (!rate.allowed) {
    return { success: false, message: "တောင်းဆိုမှု များလွန်းသည်။", retryAfterMs: rate.retryAfterMs };
  }

  const phoneNumber = formData.get("phoneNumber");
  const password = formData.get("password");

  const result = await prisma.staff.findUnique({
    where: {
      phone: phoneNumber as string,
      password: password as string,
    },
    select: {
      role: true,
      staffId: true,
      name: true,
    },
  });

  if (!result) {
    return { success: false, message: "မှားယွင်းနေပါသည်" };
  }
  const token = await signJwt({
    staffId: result.staffId,
    name: result.name,
    role: result.role,
  });
  (await cookies()).set({
    name: "staff-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in production
    sameSite: "lax", // "strict" may block cross-device requests
    path: "/", // make sure cookie is sent for all routes
  });

  return { success: true, message: "Login successful" };
}

export async function logoutAction() {
  (await cookies()).delete("staff-token");
  console.log("logout successful");
  redirect("/");
}
