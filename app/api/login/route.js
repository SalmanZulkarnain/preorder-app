import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function GET() {
    const user = await prisma.user.findMany();

    return NextResponse.json({
        user
    });
}

export async function POST(request) {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return NextResponse.json({
            message: 'User tidak ditemukan'
        }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return NextResponse.json({
            message: 'Password salah',  
        }, { status: 401 });
    }
    
    const cookieStore = await cookies();
    const session = cookieStore.set("session_user", user.email, {
        httpOnly: true, 
        path: "/", 
        maxAge: 60 * 60 * 24
    });

    return NextResponse.json({
        message: 'Login sukses',
        success: true,
        user, 
        valid, 
        session
    });
}