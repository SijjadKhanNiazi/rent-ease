"use client";

import { useState } from "react";
import { useGenerateInvoice } from "@/hooks/useInvoices";
import styles from "./InvoiceManager.module.css";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

interface InvoiceManagerProps {
  initialTenants: Array<{ id: string; name: string; email: string }>;
  initialInvoices: Array<{
    id: string;
    amount: string;
    status: "PAID" | "PENDING" | "OVERDUE";
    dueDate: Date;
    stripeInvoiceId: string | null;
    tenant: { name: string };
  }>;
}

export default function InvoiceManager({
  initialTenants,
  initialInvoices,
}: InvoiceManagerProps) {
  const [tenantId, setTenantId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDateStr, setDueDateStr] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const { mutate: generateInvoice, isPending } = useGenerateInvoice();

  const handleInvoiceCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    generateInvoice(
      { tenantId, amount, dueDateStr },
      {
        onSuccess: (res) => {
          if (res.success) {
            setNotice(
              "Invoice initialized! Checkout checkout window generated.",
            );
            setAmount("");
            setDueDateStr("");
          } else {
            setNotice(`Error: ${res.error}`);
          }
        },
      },
    );
  };

  return (
    <div className={styles.invoiceGrid}>
      {/* 1. SIDE CONTROLS CONFIGURATION INPUT CARD */}
      <div className={styles.managerForm}>
        <h3
          style={{
            fontSize: "1.15rem",
            fontWeight: 600,
            marginBottom: "1.25rem",
          }}
        >
          Issue New Tenant Bill
        </h3>
        {notice && (
          <p
            style={{
              fontSize: "0.875rem",
              marginBottom: "1rem",
              color: "var(--primary)",
            }}
          >
            {notice}
          </p>
        )}

        <form
          onSubmit={handleInvoiceCreate}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
              htmlFor="tenantSelector"
            >
              Select Tenant
            </label>
            <select
              id="tenantSelector"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              required
              style={{
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              <option value="">-- Choose Active Tenant --</option>
              {initialTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
              htmlFor="billAmount"
            >
              Billing Sum (USD)
            </label>
            <input
              id="billAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1400.00"
              step="0.01"
              required
              style={{
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
              htmlFor="dueDate"
            >
              Target Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDateStr}
              onChange={(e) => setDueDateStr(e.target.value)}
              required
              style={{
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              padding: "0.75rem",
              backgroundColor: "var(--foreground)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <CreditCard size={16} />
            )}
            Generate Billing Node
          </button>
        </form>
      </div>

      {/* 2. PRODUCTION LIVE TABLE BILLING LIST MATRIX */}
      <div className={styles.tableWrapper}>
        <table className={styles.billingTable}>
          <thead>
            <tr>
              <th>Tenant Reference</th>
              <th>Amount Balance</th>
              <th>Target Due Date</th>
              <th>Stripe Status</th>
            </tr>
          </thead>
          <tbody>
            {initialInvoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 500 }}>
                  {inv.tenant?.name || "Anonymous Occupant"}
                </td>
                <td>${parseFloat(inv.amount).toFixed(2)}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${styles[`status${inv.status}`]}`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
