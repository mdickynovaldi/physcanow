"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "next-auth/react";

export default function DashboardSiswaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect ke login jika tidak ada session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // Redirect ke dashboard guru jika role bukan STUDENT
    else if (status === "authenticated" && session?.user?.role !== "STUDENT") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Siswa</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Saya</CardTitle>
            <CardDescription>Informasi akun dan profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Nama:</span>{" "}
                {session?.user?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {session?.user?.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> Siswa
              </p>
            </div>
            <Button className="mt-4 w-full" variant="outline">
              Edit Profil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kelas Saya</CardTitle>
            <CardDescription>Daftar kelas yang Anda ikuti</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-3 bg-secondary rounded-md">Fisika Dasar</li>
              <li className="p-3 bg-secondary rounded-md">Matematika Lanjut</li>
              <li className="p-3 bg-secondary rounded-md">Kimia Organik</li>
            </ul>
            <Button className="mt-4 w-full">Lihat Semua Kelas</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tugas Terbaru</CardTitle>
            <CardDescription>Tugas yang perlu diselesaikan</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-3 bg-secondary rounded-md flex justify-between">
                <span>Tugas Fisika</span>
                <span className="text-red-500">Deadline: 2 hari lagi</span>
              </li>
              <li className="p-3 bg-secondary rounded-md flex justify-between">
                <span>Tugas Matematika</span>
                <span className="text-yellow-500">Deadline: 5 hari lagi</span>
              </li>
            </ul>
            <Button className="mt-4 w-full">Lihat Semua Tugas</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
