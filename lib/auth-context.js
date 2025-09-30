"use client";
import { NextResponse } from "next/server";
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);

    async function fetchUser() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`);

            if (!res.ok) {
                setUser(null);
                return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 })
            }

            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            console.error('Auth check failed: ', error);
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
        <AuthContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}