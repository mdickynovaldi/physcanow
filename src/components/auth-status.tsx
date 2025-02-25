"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Memuat...</div>;
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="block font-medium">
            Halo, {session.user.name || "Pengguna"}
          </span>
          <span className="text-gray-500">
            {session.user.role === "TEACHER" ? "Guru" : "Siswa"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link
              href={
                session.user.role === "TEACHER"
                  ? "/dashboard"
                  : "/dashboard-siswa"
              }
            >
              Dashboard
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Keluar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/login">Masuk</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">Daftar</Link>
      </Button>
    </div>
  );
}
