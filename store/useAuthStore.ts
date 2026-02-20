import { create } from "zustand";
import type { Session } from "better-auth/types";

interface AuthState {
    session: Session | null;
    user: any | null; // better auth user type
    isLoading: boolean;
    setAuth: (session: Session | null, user: any | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    isLoading: true,
    setAuth: (session, user) => set({ session, user, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ session: null, user: null, isLoading: false }),
}));
