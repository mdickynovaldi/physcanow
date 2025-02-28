import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { hash } from "bcrypt";

// PATCH - Memperbarui data siswa
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Periksa apakah user sudah login dan memiliki role TEACHER
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Unauthorized, access denied" },
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await request.json();
    const { name, email, password, classId } = body;

    // Validasi input minimal
    if (!name && !email && !password && !classId) {
      return NextResponse.json(
        { message: "Minimal satu field harus diubah" },
        { status: 400 }
      );
    }

    // Jika email berubah, periksa apakah sudah digunakan
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "Email sudah digunakan oleh pengguna lain" },
          { status: 400 }
        );
      }
    }

    // Siapkan data untuk update
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      const hashedPassword = await hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Jika classId kosong (string kosong), hapus kelas siswa
    if (classId === "") {
      updateData.classId = null;
    } else if (classId) {
      updateData.classId = classId;
    }

    // Update data siswa
    const updatedStudent = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        classId: true,
        class: {
          select: {
            name: true,
          },
        },
      },
    });

    // Format data untuk respons
    const formattedStudent = {
      id: updatedStudent.id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      classId: updatedStudent.classId,
      kelas: updatedStudent.class?.name || "Belum ada kelas",
    };

    return NextResponse.json(formattedStudent, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui data siswa" },
      { status: 500 }
    );
  }
}

// DELETE - Menghapus siswa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Periksa apakah user sudah login dan memiliki role TEACHER
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Unauthorized, access denied" },
        { status: 401 }
      );
    }

    const id = params.id;

    // Periksa apakah siswa ada
    const student = await prisma.user.findFirst({
      where: {
        id,
        role: "STUDENT",
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus siswa
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Siswa berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus siswa" },
      { status: 500 }
    );
  }
}
