"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import LayoutAdmin from "./LayoutAdmin";
import LayoutUser from "./LayoutUser";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? (
    <LayoutAdmin>{children}</LayoutAdmin>
  ) : (
    <LayoutUser>{children}</LayoutUser>
  );
}
