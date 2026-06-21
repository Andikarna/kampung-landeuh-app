import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import { registerSchema } from "@/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi gagal",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password } = result.data;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Ambil atau buat role "Tourist"
    let touristRole = await prisma.role.findUnique({
      where: { name: "Tourist" },
    });

    if (!touristRole) {
      touristRole = await prisma.role.create({
        data: { name: "Tourist" },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        roleId: touristRole.id,
      },
      include: {
        role: true,
      },
    });

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
      fullName: user.fullName,
    });

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
