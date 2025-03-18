import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
export async function middleware(request: NextRequest) {
    const cookieStore = await cookies()
    const user = JSON.parse(cookieStore.get("user-app")?.value || "{}")
    const { pathname } = request.nextUrl

    if (pathname.startsWith("/admin1208") && user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin1208", request.url))
    }
    if (pathname.startsWith("/dashboard") && !user) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    if (pathname.startsWith("/auth") && user) {
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}