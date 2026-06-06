"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import type { SessionUser } from "@/types/user";

type AuthContextType = {
    user: SessionUser | null;
    setUser: React.Dispatch<React.SetStateAction<SessionUser | null>>;
    fetchUser: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);

    async function fetchUser() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                headers: { "ngrok-skip-browser-warning": "true" },
            });

            if (!res.ok) {
                setUser(null);
                return;
            }

            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            console.error("Auth check failed: ", error);
        } finally {
            setLoading(false);
            setChecked(true);
        }
    }

    useEffect(() => {
        if (!checked) {
            fetchUser();
        }
    }, [checked]);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
