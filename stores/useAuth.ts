import { User } from "next-auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,
            setUser: (user: User | null) => set({ user }),
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);