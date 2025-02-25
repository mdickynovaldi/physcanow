import { NextResponse } from "next/server";
import { extendedRegisterSchema } from "@/types";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

// Gunakan singleton pattern untuk Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  try {
    // Parse body request
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Format request tidak valid" },
        { status: 400 }
      );
    }

    // Validasi data menggunakan Zod schema yang sudah ada
    const result = extendedRegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: result.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Simpan user ke database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT", // default role
      },
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error pada registrasi:", error);

    // Pastikan error message selalu string
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat pendaftaran";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
