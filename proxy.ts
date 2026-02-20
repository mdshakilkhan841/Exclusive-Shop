import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    // Edge-compatible session check by hitting our own API
    const cookie = request.headers.get("cookie") || "";
    const sessionRes = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
            headers: { cookie },
        },
    );

    const sessionData = await sessionRes.json().catch(() => null);

    if (!sessionData || !sessionData.session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Future feature: Role-based routing checks based on sessionData.user.role
    // e.g. if user is CASHIER, they shouldn't access /settings

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/pos/:path*",
        "/products/:path*",
        "/sales/:path*",
        "/customers/:path*",
        "/suppliers/:path*",
        "/reports/:path*",
        "/expenses/:path*",
        "/settings/:path*",
    ],
};
