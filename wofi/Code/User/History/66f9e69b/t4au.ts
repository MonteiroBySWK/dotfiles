import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light" | "system";
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
}));
