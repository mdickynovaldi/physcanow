"use client";

import { useState } from "react";
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
import { Search } from "lucide-react";

// Data dummy untuk contoh
const dummySiswa = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi@example.com",
    kelas: "Fisika Dasar",
  },
  {
    id: "2",
    name: "Ani Wijaya",
    email: "ani@example.com",
    kelas: "Fisika Dasar",
  },
  {
    id: "3",
    name: "Dedi Cahyono",
    email: "dedi@example.com",
    kelas: "Matematika Lanjut",
  },
  {
    id: "4",
    name: "Eka Putri",
    email: "eka@example.com",
    kelas: "Kimia Organik",
  },
  {
    id: "5",
    name: "Fandi Ahmad",
    email: "fandi@example.com",
    kelas: "Fisika Dasar",
  },
];

export function DaftarSiswa() {
  const [searchTerm, setSearchTerm] = useState("");
  const [siswa, setSiswa] = useState(dummySiswa);

  // Filter siswa berdasarkan pencarian
  const filteredSiswa = siswa.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button>Ekspor Data</Button>
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
              {filteredSiswa.length > 0 ? (
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
                    Tidak ada siswa yang ditemukan
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
