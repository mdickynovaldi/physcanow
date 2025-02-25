import { NextResponse } from "next/server";
import { loginSchema } from "@/types";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi data menggunakan Zod schema
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: result.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Cek apakah email terdaftar
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Verifikasi password
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    // Generate token JWT jika diperlukan
    // const accessToken = signJwtAccessToken(userWithoutPassword);

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: userWithoutPassword,
        // accessToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error pada login:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
