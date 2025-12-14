import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_user");

  console.log(session);

  if (!session) {
    return NextResponse.json({ message: "Belum login" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.value },
    select: { id: true, name: true, email: true, role: true }
  });

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
