"use client";

import { useAuth } from "@/lib/auth-context";
import LayoutAdmin from "./LayoutAdmin";
import LayoutUser from "./LayoutUser";

export default function LayoutContent({ children }) {
  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  if (loading) return null;

  return isAdmin ? (
    <LayoutAdmin>{children}</LayoutAdmin>
  ) : (
    <LayoutUser>{children}</LayoutUser>
  )
}
