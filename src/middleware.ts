import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Halaman yang dapat diakses tanpa login
const publicRoutes = ["/", "/login", "/register"];

// Halaman yang hanya dapat diakses oleh guru
const teacherRoutes = ["/dashboard"];

// Halaman yang hanya dapat diakses oleh siswa
const studentRoutes = ["/dashboard-siswa"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah rute saat ini adalah rute publik
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Cek apakah rute saat ini adalah rute guru
  const isTeacherRoute = teacherRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Cek apakah rute saat ini adalah rute siswa
  const isStudentRoute = studentRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Dapatkan token dari NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Jika pengguna belum login dan mencoba mengakses rute yang dilindungi
  if (!token && !isPublicRoute) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login atau register
  if (token && (pathname === "/login" || pathname === "/register")) {
    // Redirect ke dashboard sesuai role
    if (token.role === "TEACHER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (token.role === "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard-siswa", request.url));
    }
  }

  // Jika guru mencoba mengakses halaman siswa
  if (token && token.role === "TEACHER" && isStudentRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika siswa mencoba mengakses halaman guru
  if (token && token.role === "STUDENT" && isTeacherRoute) {
    return NextResponse.redirect(new URL("/dashboard-siswa", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi middleware untuk berjalan pada rute tertentu
export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali:
     * 1. /api routes
     * 2. /_next (Next.js internal routes)
     * 3. /_static (Jika Anda menggunakan Vercel untuk static assets)
     * 4. /favicon.ico, /sitemap.xml (file statis)
     */
    "/((?!api|_next|_static|favicon.ico|sitemap.xml).*)",
  ],
};
