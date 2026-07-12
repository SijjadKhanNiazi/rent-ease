"use client";

import { useState } from "react";
import { useCreateProperty } from "@/hooks/useProperties";
import styles from "./PropertyForm.module.css";
import { Loader2, PlusCircle } from "lucide-react";

export default function PropertyForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { mutate: createProperty, isPending } = useCreateProperty();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    createProperty(
      { name, address },
      {
        onSuccess: () => {
          setFeedback({
            type: "success",
            message: "Asset registered into database nodes successfully!",
          });
          setName("");
          setAddress("");
        },
        onError: (error) => {
          setFeedback({
            type: "error",
            message: error.message || "Operation failure encountered.",
          });
        },
      },
    );
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>Add New Property Asset</h3>

      {feedback && (
        <div
          className={
            feedback.type === "success"
              ? styles.successBanner
              : styles.errorBanner
          }
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="propertyName">Property Name</label>
          <input
            id="propertyName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isPending}
            placeholder="e.g., Pine Heights Corporate Unit"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="propertyAddress">Physical Address</label>
          <input
            id="propertyAddress"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            disabled={isPending}
            placeholder="e.g., Sector G-11, Islamabad"
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Processing Node...
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Deploy Asset
            </>
          )}
        </button>
      </form>
    </div>
  );
}
