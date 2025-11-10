import { onAuthStateChanged, User } from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  persist((set, get) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user, loading: false }),
  logout: () => set({ user: null, loading: false }),
})));
