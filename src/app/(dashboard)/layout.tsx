"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useDashboardStore } from "@/store/useDashboardStore";
import styles from "./layout.module.css";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, toggleSidebar } = useDashboardStore();

  return (
    <div className={styles.layoutWrapper}>
      {/* 1. SIDEBAR ARCHITECTURE SLIDE PANEL */}
      <Sidebar />

      {/* 2. DYNAMIC CONTENT SECTION HOOKED TO STATE CONTAINER */}
      <div
        className={`${styles.mainContent} ${!isSidebarOpen ? styles.mainContentFull : ""}`}
      >
        {/* TOP INTERACTIVE CORE OPERATIONS CONTROL PANEL */}
        <header
          className={`${styles.topBar} ${!isSidebarOpen ? styles.topBarFull : ""}`}
        >
          <button
            onClick={toggleSidebar}
            className={styles.toggleBtn}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          <div className={styles.userInfo}>
            <span>Landlord Workspace</span>
          </div>
        </header>

        {/* INNER PAGE VIEWS MOUNT POINT */}
        <main>{children}</main>
      </div>
    </div>
  );
}
