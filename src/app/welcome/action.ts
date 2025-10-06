"use server";

import prisma from "@/lib/prisma";

export interface StaffFormData {
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  password: string;
  role: "STAFF" | "MANAGER";
}

function validateStaffData(data: StaffFormData): {
  success: boolean;
  message: string;
} {
  if (!data.name) {
    return { success: false, message: "ဝန်ထမ်းအမည်ထည့်ပါ" };
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, message: "Invalid email format" };
  }

  if (!data.phone) {
    return { success: false, message: "ဖုန်းနံပါတ်ထည့်ပါ" };
  }

  if (!data.address) {
    return { success: false, message: "လိပ်စာထည့်ပါ" };
  }

  if (!data.password || data.password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters",
    };
  }

  if (data.role !== "STAFF" && data.role !== "MANAGER") {
    return { success: false, message: "Invalid role" };
  }

  return { success: true, message: "Validation successful" };
}

export async function createStaff(data: StaffFormData) {
  try {
    const isUserExit = await prisma.staff.findFirst();
    if (isUserExit) {
      return { success: false, error: "You Can't Create User From This" };
    }
    // Validate input data
    const validation = validateStaffData(data);

    if (!validation.success) {
      return { success: false, error: validation.message };
    }

    // Create staff record
    const staff = await prisma.staff.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        password: data.password, // Note: Should be hashed in production
        role: data.role || "STAFF",
      },
      select: {
        name: true,
      },
    });

    return { success: true, staff };
  } catch (error) {
    console.error("Failed to create staff:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
