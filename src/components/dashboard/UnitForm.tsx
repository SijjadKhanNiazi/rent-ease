"use client";

import { useState } from "react";
import { useGetProperties } from "@/hooks/useProperties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnitAction } from "@/app/actions/units";
import styles from "./UnitForm.module.css";
import { Loader2, ShieldCheck } from "lucide-react";

export default function UnitForm() {
  const queryClient = useQueryClient();
  const { data: propertiesList } = useGetProperties();

  const [propertyId, setPropertyId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const { mutate: createUnit, isPending } = useMutation({
    mutationFn: createUnitAction,
    onSuccess: (res) => {
      if (res.success) {
        setStatusMsg("Unit deployed successfully inside spatial nodes.");
        setUnitNumber("");
        setRentAmount("");
        queryClient.invalidateQueries({ queryKey: ["properties"] });
      } else {
        setStatusMsg(`Error: ${res.error}`);
      }
    },
  });

  const handleUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId)
      return setStatusMsg("Select a target parent property context pointer.");
    setStatusMsg(null);
    createUnit({ propertyId, unitNumber, rentAmount });
  };

  return (
    <div className={styles.formBox}>
      <h3
        style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "1rem" }}
      >
        Add Unit to Existing Asset
      </h3>
      {statusMsg && (
        <p
          style={{
            fontSize: "0.875rem",
            marginBottom: "1rem",
            color: "var(--primary)",
          }}
        >
          {statusMsg}
        </p>
      )}

      <form onSubmit={handleUnitSubmit} className={styles.rowInputs}>
        <div className={styles.flexItem}>
          <label htmlFor="parentProperty">Parent Property Context</label>
          <select
            id="parentProperty"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
          >
            <option value="">-- Choose Property --</option>
            {propertiesList?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.flexItem}>
          <label htmlFor="unitNumber">Unit Tag / Number</label>
          <input
            id="unitNumber"
            type="text"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            placeholder="e.g., Suite 404"
            required
          />
        </div>

        <div className={styles.flexItem}>
          <label htmlFor="rentAmount">Monthly Billing Rent ($)</label>
          <input
            id="rentAmount"
            type="number"
            value={rentAmount}
            onChange={(e) => setRentAmount(e.target.value)}
            placeholder="e.g., 1250.00"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className={styles.inlineBtn} disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          Add Unit
        </button>
      </form>
    </div>
  );
}
