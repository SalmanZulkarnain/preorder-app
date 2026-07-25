import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_user");

  if (!session) {
    return NextResponse.json({ message: "Belum login" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.value },
    select: { id: true, name: true, email: true }
  });

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
