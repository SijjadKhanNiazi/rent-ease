import PropertyForm from "@/components/dashboard/PropertyForm";
import PropertyList from "@/components/dashboard/PropertyList";
import UnitForm from "@/components/dashboard/UnitForm";

export default function PropertiesPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
        Properties Assets Management
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          marginTop: "0.25rem",
          marginBottom: "2rem",
        }}
      >
        Register and inspect real estate structures directly down to localized
        layout units schema maps natively.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <PropertyForm />
        <UnitForm />
        <PropertyList />
      </div>
    </div>
  );
}
