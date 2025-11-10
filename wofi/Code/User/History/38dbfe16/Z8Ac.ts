import { create } from "zustand";

interface User {
  email: string;
  password: string;
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<UserStore>((set) => ({
  user: null,
}));
