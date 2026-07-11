import { create } from "zustand";

interface DashboardState {
  isSidebarOpen: boolean;
  activePropertyId: string | null;
  toggleSidebar: () => void;
  setActiveProperty: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isSidebarOpen: true,
  activePropertyId: null,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveProperty: (id) => set({ activePropertyId: id }),
}));
