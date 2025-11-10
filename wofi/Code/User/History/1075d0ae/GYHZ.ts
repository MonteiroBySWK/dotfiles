import { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null,
  loading: boolean,
  initAuthListener: () => void,
}


export const useAuthStore = create();
