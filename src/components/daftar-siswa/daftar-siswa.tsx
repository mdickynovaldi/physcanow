"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  kelas: string;
}

export function DaftarSiswa() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [siswa, setSiswa] = useState<Student[]>([]);
  const [filteredSiswa, setFilteredSiswa] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mengambil data siswa dari API
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/students");
      if (!response.ok) {
        throw new Error("Gagal mengambil data siswa");
      }
      const data = await response.json();
      setSiswa(data);
      setFilteredSiswa(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data siswa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter siswa berdasarkan pencarian
  useEffect(() => {
    const filtered = siswa.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSiswa(filtered);
  }, [searchTerm, siswa]);

  // Fungsi untuk ekspor data ke CSV
  const exportToCSV = () => {
    if (filteredSiswa.length === 0) {
      toast({
        title: "Perhatian",
        description: "Tidak ada data siswa untuk diekspor",
      });
      return;
    }

    // Header CSV
    const csvHeader = ["Nama", "Email", "Kelas"].join(",");

    // Baris data CSV
    const csvRows = filteredSiswa.map((student) => {
      return [
        `"${student.name}"`,
        `"${student.email}"`,
        `"${student.kelas}"`,
      ].join(",");
    });

    // Gabungkan header dan baris
    const csvString = [csvHeader, ...csvRows].join("\n");

    // Buat Blob dan link untuk download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "daftar_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Siswa</CardTitle>
        <CardDescription>
          Lihat dan kelola semua siswa yang terdaftar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari siswa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
          <Button onClick={exportToCSV}>Ekspor Data</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSiswa.length > 0 ? (
                filteredSiswa.map((siswa) => (
                  <TableRow key={siswa.id}>
                    <TableCell className="font-medium">{siswa.name}</TableCell>
                    <TableCell>{siswa.email}</TableCell>
                    <TableCell>{siswa.kelas}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {searchTerm
                      ? "Tidak ada siswa yang ditemukan"
                      : "Belum ada siswa yang ditambahkan"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
