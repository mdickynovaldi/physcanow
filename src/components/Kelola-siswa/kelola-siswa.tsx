"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

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
];

// Data dummy kelas
const dummyKelas = [
  { id: "1", name: "Fisika Dasar" },
  { id: "2", name: "Matematika Lanjut" },
  { id: "3", name: "Kimia Organik" },
];

export function KelolaSiswa() {
  const [siswa, setSiswa] = useState(dummySiswa);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    kelas: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, kelas: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      kelas: "",
      password: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // Update siswa yang sudah ada
      setSiswa(siswa.map((s) => (s.id === formData.id ? { ...formData } : s)));
    } else {
      // Tambah siswa baru
      const newSiswa = {
        ...formData,
        id: Date.now().toString(),
      };
      setSiswa([...siswa, newSiswa]);
    }

    resetForm();
  };

  const handleEdit = (id: string) => {
    const siswaToEdit = siswa.find((s) => s.id === id);
    if (siswaToEdit) {
      setFormData({
        ...siswaToEdit,
        password: "", // Reset password saat edit
      });
      setIsEditing(true);
    }
  };

  const handleDelete = (id: string) => {
    setSiswa(siswa.filter((s) => s.id !== id));
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Siswa" : "Tambah Siswa Baru"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Perbarui data siswa yang sudah ada"
              : "Isi formulir untuk menambahkan siswa baru"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? "Password Baru (opsional)" : "Password"}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Select
                  value={formData.kelas}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyKelas.map((kelas) => (
                      <SelectItem key={kelas.id} value={kelas.name}>
                        {kelas.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={resetForm}>
              {isEditing ? "Batal" : "Reset"}
            </Button>
            <Button type="submit">{isEditing ? "Perbarui" : "Tambah"}</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kelola Siswa</CardTitle>
          <CardDescription>Daftar siswa yang dapat dikelola</CardDescription>
        </CardHeader>
        <CardContent>
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
                {siswa.length > 0 ? (
                  siswa.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.kelas}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(s.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                <DialogDescription>
                                  Apakah Anda yakin ingin menghapus siswa ini?
                                  Tindakan ini tidak dapat dibatalkan.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setOpenDialog(false)}
                                >
                                  Batal
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(s.id)}
                                >
                                  Hapus
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Belum ada siswa yang ditambahkan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
