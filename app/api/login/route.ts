import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = body?.email?.toString().trim().toLowerCase();
        const password = body?.password?.toString();
    
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email dan password wajib diisi", success: false },
                { status: 400 }
            )
        }
    
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, role: true, password: true }
        });
    
        if (!user) {
            return NextResponse.json({
                message: 'User tidak ditemukan'
            }, { status: 401 });
        }
    
        const valid = await bcrypt.compare(password, user.password);
    
        if (!valid) {
            return NextResponse.json(
                { message: 'Password salah', success: false },
                { status: 401 }
            );
        }
    
        const cookieStore = await cookies();
        cookieStore.set("session_user", user.email, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24
        });
    
        return NextResponse.json({
            message: 'Login sukses',
            success: true,
            user: {
                id: user.id,
                name: user.name, 
                email: user.email, 
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan saat login", success: false }, 
            { status: 500 }
        )
    }
}