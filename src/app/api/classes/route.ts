import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET - Mengambil semua kelas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Periksa apakah user sudah login
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized, access denied" },
        { status: 401 }
      );
    }

    // Ambil semua kelas
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Format data kelas
    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      studentCount: cls._count.students,
    }));

    return NextResponse.json(formattedClasses, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data kelas" },
      { status: 500 }
    );
  }
}
