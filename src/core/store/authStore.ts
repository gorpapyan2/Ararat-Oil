import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Auth state store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
    }
  )
); 