import { db } from "@/db";
import { invoices, tenants } from "@/db/schema";
import InvoiceManager from "@/components/dashboard/InvoiceManager";
import { desc } from "drizzle-orm";

export const revalidate = 0; // Force layout page boundary to be dynamic

export default async function InvoicesPage() {
  // Parallel asynchronous database Lookups using pre-warmed pool driver connections
  const [tenantsData, invoicesData] = await Promise.all([
    db.select().from(tenants),
    db.query.invoices.findMany({
      with: { tenant: true },
      orderBy: [desc(invoices.createdAt)],
    }),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
        Invoices & Revenue Pipelines
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
        Track tenant ledger balances, dispatch real-time Stripe billing
        checkouts, and inspect webhook payment responses natively.
      </p>

      {/* MOUNT OUR ASSEMBLED MANAGEMENT PANEL CONTAINER */}
      <InvoiceManager
        initialTenants={tenantsData}
        initialInvoices={invoicesData as any}
      />
    </div>
  );
}
