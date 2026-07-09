import { create } from "zustand";
import { type Dimension, type TimeOfDay } from "@/types";

interface OnboardingState {
  currentStep: number;
  displayName: string;
  focusAreas: Dimension[];
  timePreference: TimeOfDay;
  templateId: string | null;
  isCompleted: boolean;
  setStep: (step: number) => void;
  setDisplayName: (name: string) => void;
  setFocusAreas: (areas: Dimension[]) => void;
  toggleFocusArea: (area: Dimension) => void;
  setTimePreference: (pref: TimeOfDay) => void;
  setTemplateId: (id: string | null) => void;
  complete: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  displayName: "",
  focusAreas: [] as Dimension[],
  timePreference: "morning" as TimeOfDay,
  templateId: null as string | null,
  isCompleted: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  setDisplayName: (name) => set({ displayName: name }),
  setFocusAreas: (areas) => set({ focusAreas: areas }),
  toggleFocusArea: (area) =>
    set((s) => ({
      focusAreas: s.focusAreas.includes(area)
        ? s.focusAreas.filter((a) => a !== area)
        : [...s.focusAreas, area],
    })),
  setTimePreference: (pref) => set({ timePreference: pref }),
  setTemplateId: (id) => set({ templateId: id }),
  complete: () => set({ isCompleted: true }),
  reset: () => set(initialState),
}));
