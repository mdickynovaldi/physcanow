"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DaftarSiswa } from "@/components/daftar-siswa/daftar-siswa";
import { KelolaSiswa } from "@/components/Kelola-siswa/kelola-siswa";
import { KelolaSoal } from "@/components/kelola-soal/kelola-soal";

export function DashboardGuruPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect ke login jika tidak ada session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // Redirect ke dashboard siswa jika role bukan TEACHER
    else if (status === "authenticated" && session?.user?.role !== "TEACHER") {
      router.push("/dashboard-siswa");
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
    <div className="container mx-auto py-10 px-4 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Selamat datang, {session?.user?.name}
          </span>
        </div>
      </div>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="daftar-siswa">Daftar Siswa</TabsTrigger>
          <TabsTrigger value="kelola-siswa">Kelola Siswa</TabsTrigger>
          <TabsTrigger value="kelola-soal">Kelola Soal</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Guru</CardTitle>
              <CardDescription>
                Informasi dan pengaturan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-semibold">Nama Lengkap</p>
                  <p>{session?.user?.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Email</p>
                  <p>{session?.user?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Role</p>
                  <p>Guru</p>
                </div>
              </div>
              <Button variant="outline">Edit Profil</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daftar-siswa" className="mt-6">
          <DaftarSiswa />
        </TabsContent>

        <TabsContent value="kelola-siswa" className="mt-6">
          <KelolaSiswa />
        </TabsContent>

        <TabsContent value="kelola-soal" className="mt-6">
          <KelolaSoal />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardGuruPage;
