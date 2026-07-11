import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Database Enums for strict type safety at the storage layer
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "PAID",
  "PENDING",
  "OVERDUE",
]);
export const unitStatusEnum = pgEnum("unit_status", [
  "VACANT",
  "OCCUPIED",
  "MAINTENANCE",
]);

// 1. PROPERTIES TABLE
export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: text("landlord_id").notNull(), // Linked to Auth provider ID
  name: text("name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. UNITS TABLE (Belongs to a specific Property)
export const units = pgTable("units", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  unitNumber: text("unit_number").notNull(),
  rentAmount: decimal("rent_amount", { precision: 10, scale: 2 }).notNull(),
  status: unitStatusEnum("status").default("VACANT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. TENANTS TABLE (Assigned to a specific Unit)
export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  unitId: uuid("unit_id").references(() => units.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. INVOICES TABLE (Generated for a Unit & Tenant)
export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  unitId: uuid("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: invoiceStatusEnum("status").default("PENDING").notNull(),
  stripeInvoiceId: text("stripe_invoice_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =========================================================================
// RELATIONS DEFINITIONS (Drizzle Queries API Relational Mapping)
// =========================================================================

export const propertiesRelations = relations(properties, ({ many }) => ({
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  property: one(properties, {
    fields: [units.propertyId],
    references: [properties.id],
  }),
  tenant: one(tenants),
  invoices: many(invoices),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  unit: one(units, { fields: [tenants.unitId], references: [units.id] }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  unit: one(units, { fields: [invoices.unitId], references: [units.id] }),
  tenant: one(tenants, {
    fields: [invoices.tenantId],
    references: [tenants.id],
  }),
}));
