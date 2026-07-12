"use client";

import { useGetProperties } from "@/hooks/useProperties";
import styles from "./PropertyList.module.css";
import { Building, Home, Loader2, ServerCrash } from "lucide-react";

export default function PropertyList() {
  const {
    data: propertiesList,
    isLoading,
    isError,
    error,
  } = useGetProperties();

  // 1. LOADING PIPELINE CHECKPOINT VIEW FRAME
  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader2 className={styles.loadingSpinner} size={40} />
        <p>Streaming assets context metadata matrices safely...</p>
      </div>
    );
  }

  // 2. ERROR STATE VIEW EXCEPTION FRAME
  if (isError) {
    return (
      <div
        className={styles.loadingWrapper}
        style={{ borderColor: "var(--danger)" }}
      >
        <ServerCrash style={{ color: "var(--danger)" }} size={40} />
        <p style={{ color: "var(--danger)" }}>
          {error?.message || "Failed to populate database grids."}
        </p>
      </div>
    );
  }

  // 3. EMPTY STATE FALLBACK VIEW FRAME
  if (!propertiesList || propertiesList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Building size={40} />
        <h3>No Property Assets Found</h3>
        <p>
          Deploy your first structural property asset tracking schema container
          above.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      {propertiesList.map((property) => (
        <article key={property.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.title}>{property.name}</h3>
            <p className={styles.address}>{property.address}</p>
          </div>

          <div className={styles.cardBody}>
            <span className={styles.badge}>
              ID: {property.id.substring(0, 8)}...
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              <Home size={16} />
              <span>{property.units?.length || 0} Units</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
