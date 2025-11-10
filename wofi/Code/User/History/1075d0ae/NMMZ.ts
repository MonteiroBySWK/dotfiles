import { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  loading: boolean;
  initAuthListener: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(
  
);
