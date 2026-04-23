"use client";

import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isGlobalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  isGlobalLoading: false,
  setGlobalLoading: (value) => set({ isGlobalLoading: value }),
}));
