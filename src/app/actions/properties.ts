"use server";

import { db } from "@/db";
import { properties } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

const createPropertySchema = z.object({
  name: z.string().min(3, "Property designation must exceed 3 letters length."),
  address: z
    .string()
    .min(5, "A definitive layout address tracking location is mandatory."),
});

export async function createPropertyAction(formData: {
  name: string;
  address: string;
}) {
  try {
    // 1. EXTRACT REAL SECURE LANDLORD SESSION ID
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized access: Session signature token missing.",
      };
    }

    const validatedData = createPropertySchema.parse(formData);

    // 2. Direct transactional record database injection write query using real context id
    await db.insert(properties).values({
      landlordId: userId, // SWAPPED: Actual validated clerk identity signature
      name: validatedData.name,
      address: validatedData.address,
    });

    revalidatePath("/dashboard/properties");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue ? firstIssue.message : "Invalid parameters.",
      };
    }
    return {
      success: false,
      error: "Internal system operations fault encountered.",
    };
  }
}
