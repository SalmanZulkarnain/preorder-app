import { NextResponse } from "next/server";

export function middleware(req) {
    const session = req.cookies.get("session_user");

    if (req.nextUrl.pathname.startsWith("/admin") && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"]
}