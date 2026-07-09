import { create } from "zustand";
import { type Theme } from "@/types";

interface UIState {
  sidebarCollapsed: boolean;
  theme: Theme;
  activeHabitModal: boolean;
  editingHabitId: string | null;
  activeRoutineModal: boolean;
  editingRoutineId: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  openHabitModal: (habitId?: string) => void;
  closeHabitModal: () => void;
  openRoutineModal: (routineId?: string) => void;
  closeRoutineModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  theme: "system",
  activeHabitModal: false,
  editingHabitId: null,
  activeRoutineModal: false,
  editingRoutineId: null,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setTheme: (theme) => set({ theme }),
  openHabitModal: (habitId) => set({ activeHabitModal: true, editingHabitId: habitId || null }),
  closeHabitModal: () => set({ activeHabitModal: false, editingHabitId: null }),
  openRoutineModal: (routineId) => set({ activeRoutineModal: true, editingRoutineId: routineId || null }),
  closeRoutineModal: () => set({ activeRoutineModal: false, editingRoutineId: null }),
}));
