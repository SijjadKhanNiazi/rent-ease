"use server";

import { db } from "@/db";
import { invoices, tenants, units } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function generateTenantInvoiceAction(formData: {
  tenantId: string;
  amount: string;
  dueDateStr: string;
}) {
  try {
    // 1. Fetch exact tenant & associated unit pricing metrics safely
    const tenantData = await db.query.tenants.findFirst({
      where: eq(tenants.id, formData.tenantId),
      with: { unit: true },
    });

    if (!tenantData)
      return {
        success: false,
        error: "Target tenant metadata records not found.",
      };

    // 2. Initializing Stripe Checkout session configurations context maps
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Rent Payment for Unit - ${tenantData.unit?.unitNumber || "Residential Space"}`,
            },
            unit_amount: Math.round(parseFloat(formData.amount) * 100), // Converted to exact integer cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        tenantId: tenantData.id,
        unitId: tenantData.unitId || "",
      },
    });

    // 3. Write native pending invoice tracker transaction logs to Drizzle
    await db.insert(invoices).values({
      unitId: tenantData.unitId!,
      tenantId: tenantData.id,
      amount: formData.amount,
      dueDate: new Date(formData.dueDateStr),
      status: "PENDING",
      stripeInvoiceId: session.id, // Store session hash as tracking pointer mapping
    });

    revalidatePath("/dashboard/invoices");
    return { success: true, checkoutUrl: session.url };
  } catch (error) {
    console.error("Stripe generation processing failure:", error);
    return {
      success: false,
      error: "Failed to authorize financial checkout loops.",
    };
  }
}
