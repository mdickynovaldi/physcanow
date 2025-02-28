import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { hash } from "bcrypt";

// GET - Mengambil semua siswa
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Periksa apakah user sudah login dan memiliki role TEACHER
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Unauthorized, access denied" },
        { status: 401 }
      );
    }

    // Ambil semua siswa dengan role STUDENT
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
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
      orderBy: {
        name: "asc",
      },
    });

    // Format data siswa untuk frontend
    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      classId: student.classId,
      kelas: student.class?.name || "Belum ada kelas",
    }));

    return NextResponse.json(formattedStudents, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data siswa" },
      { status: 500 }
    );
  }
}

// POST - Menambahkan siswa baru
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Periksa apakah user sudah login dan memiliki role TEACHER
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Unauthorized, access denied" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, password, classId } = body;

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password harus diisi" },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Buat user baru dengan role STUDENT
    const newStudent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        ...(classId ? { classId } : {}),
      },
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
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      classId: newStudent.classId,
      kelas: newStudent.class?.name || "Belum ada kelas",
    };

    return NextResponse.json(formattedStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat siswa baru" },
      { status: 500 }
    );
  }
}
