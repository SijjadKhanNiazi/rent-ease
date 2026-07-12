"use client";

import Link from "next/link";
import { useDashboardStore } from "@/store/useDashboardStore";
import styles from "./Sidebar.module.css";
import { Building2, LayoutDashboard, Receipt, Users } from "lucide-react";

export default function Sidebar() {
  const isSidebarOpen = useDashboardStore((state) => state.isSidebarOpen);

  return (
    <aside
      className={`${styles.sidebar} ${!isSidebarOpen ? styles.closed : ""}`}
    >
      <div className={styles.brand}>
        <h2>Rent-Ease</h2>
      </div>
      <nav>
        <ul className={styles.navLinks}>
          <li className={styles.linkItem}>
            <Link href="/dashboard">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
          </li>
          <li className={styles.linkItem}>
            <Link href="/dashboard/properties">
              <Building2 size={20} /> Properties
            </Link>
          </li>
          <li className={styles.linkItem}>
            <Link href="/dashboard/tenants">
              <Users size={20} /> Tenants
            </Link>
          </li>
          <li className={styles.linkItem}>
            <Link href="/dashboard/invoices">
              <Receipt size={20} /> Invoices
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
