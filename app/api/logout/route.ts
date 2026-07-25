import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        cookieStore.set("session_user", "", {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0)
        });

        return NextResponse.json({
            message: 'Logout berhasil', 
            success: true
        });
    } catch (error) {
        console.error("Logout error:", error);

        return NextResponse.json(
            { message: "Gagal logout", success: false },
            { status: 500 }
        )
    }

}
