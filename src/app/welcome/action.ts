"use server";

import prisma from "@/lib/prisma";

export async function hasUsers(): Promise<boolean> {
  const count = await prisma.staff.count({ take: 1 });
  return count > 0;
}

export async function createFirstUser(formData: FormData) {
  const existing = await prisma.staff.count({ take: 1 });
  if (existing > 0) {
    return { success: false, error: "ဝန်ထမ်းရှိပြီးသားဖြစ်ပါသည်" };
  }

  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const password = formData.get("password") as string;

  if (!name) return { success: false, error: "အမည်ထည့်ပါ" };
  if (!phone) return { success: false, error: "ဖုန်းနံပါတ်ထည့်ပါ" };
  if (!address) return { success: false, error: "လိပ်စာထည့်ပါ" };
  if (!password || password.length < 6)
    return { success: false, error: "စကားဝှက် အနည်းဆုံး ၆ လုံးထည့်ပါ" };

  try {
    const staff = await prisma.staff.create({
      data: {
        name,
        phone,
        address,
        password,
        role: "MANAGER",
      },
      select: { name: true },
    });
    return { success: true, staff };
  } catch (error) {
    console.error("Failed to create first user:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
