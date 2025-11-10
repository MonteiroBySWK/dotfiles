import { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
}));
