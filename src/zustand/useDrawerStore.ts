// drawerStore.js
import { create } from "zustand";

interface DrawerState {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

const useDrawerStore = create<DrawerState>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  closeDrawer: () => set(() => ({ isDrawerOpen: false })),
}));

export default useDrawerStore;
