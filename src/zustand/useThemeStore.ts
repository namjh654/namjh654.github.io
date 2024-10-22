// store.ts
import { create } from "zustand";

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light", // 기본값을 'light'로 설정
  toggleTheme: () =>
    set((state: { theme: string }) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
}));
