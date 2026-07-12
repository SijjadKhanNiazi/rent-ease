"use server";

import { db } from "@/db";
import { units } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createUnitSchema = z.object({
  propertyId: z.string().uuid("Invalid property reference pointer."),
  unitNumber: z.string().min(1, "Unit number/designation is mandatory."),
  rentAmount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Rent amount must be a positive valid number.",
    }),
});

export async function createUnitAction(formData: {
  propertyId: string;
  unitNumber: string;
  rentAmount: string;
}) {
  try {
    const validatedData = createUnitSchema.parse(formData);

    await db.insert(units).values({
      propertyId: validatedData.propertyId,
      unitNumber: validatedData.unitNumber,
      rentAmount: validatedData.rentAmount, // Stored as strict string/decimal in database
      status: "VACANT",
    });

    revalidatePath("/dashboard/properties");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue ? firstIssue.message : "Invalid validation data.",
      };
    }
    return {
      success: false,
      error: "Internal server operational fault adding property unit.",
    };
  }
}
