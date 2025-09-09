"use server"

import prisma from "@/lib/prisma"

// Define the interface for staff data
export interface StaffFormData {
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  password: string;
  role: "STAFF" | "MANAGER";
}

// Validate staff data
function validateStaffData(data: StaffFormData) {
  const errors: string[] = [];

  if (!data.name) {
    errors.push("Name is required");
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.phone) {
    errors.push("Phone number is required");
  }

  if (!data.address) {
    errors.push("Address is required");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (data.role !== "STAFF" && data.role !== "MANAGER") {
    errors.push("Invalid role");
  }

  return errors;
}

export async function createStaff(data: StaffFormData) {
  try {
    // Validate the input data
    const validationErrors = validateStaffData(data);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: "Validation error",
        validationErrors
      }
    }

    // Check if phone number already exists
    const existingStaffByPhone = await prisma.staff.findUnique({
      where: { phone: data.phone },
    })

    if (existingStaffByPhone) {
      return { success: false, error: "Phone number already exists" }
    }

    // Check if email already exists (if provided)
    if (data.email) {
      const existingStaffByEmail = await prisma.staff.findUnique({
        where: { email: data.email },
      })

      if (existingStaffByEmail) {
        return { success: false, error: "Email already exists" }
      }
    }

    // Create the staff record
    const staff = await prisma.staff.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password, // In a real app, you should hash this password
        role: data.role || "STAFF",
      },
    })

    return { success: true, staff }
  } catch (error) {
    console.error("Failed to create staff:", error)
    return { success: false, error: (error as Error).message }
  }
}