import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwt";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("staff-token")?.value;
    if (!token) return NextResponse.redirect(new URL("/", req.url));

    const payload = await verifyJwt(token);

    if (!payload) return NextResponse.redirect(new URL("/", req.url));

    const path = req.nextUrl.pathname;

    if (payload.role === "STAFF") {
        // Staff can access anything under /office/staff/*
        if (!path.startsWith("/office/staff")) {
            // If they go outside /office/staff, push them back to staff dashboard
            return NextResponse.redirect(new URL("/office/staff/invoice/new", req.url));
        }
    } else if (payload.role === "MANAGER") {
        // Manager can access /office/staff/* or /office/manager/*
        if (!path.startsWith("/office")) {
            return NextResponse.redirect(new URL("/office/manager", req.url));
        }
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/office/:path*",],
};
