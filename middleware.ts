import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const session = await auth()

    if (pathname.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    if (pathname.startsWith("/auth") && session) {
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