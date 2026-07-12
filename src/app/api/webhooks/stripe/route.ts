import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Missing stripe validation signature metrics.", {
      status: 400,
    });
  }

  let event;
  try {
    // Cryptographically verify that the request actually came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return new NextResponse(
      `Webhook security validation breakdown: ${err.message}`,
      { status: 400 },
    );
  }

  // Handle successful transactional events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // Direct database state update manipulation execution matching checkout pointers
    await db
      .update(invoices)
      .set({ status: "PAID" })
      .where(eq(invoices.stripeInvoiceId, session.id));

    console.log(
      `[✓] Invoice tracking node associated with token ${session.id} completely set to PAID.`,
    );
  }

  return NextResponse.json({ processed: true });
}
