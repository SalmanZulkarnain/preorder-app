import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    (await cookies()).delete("session_user");
    return NextResponse.json({ message: 'Logout berhasil' });
}