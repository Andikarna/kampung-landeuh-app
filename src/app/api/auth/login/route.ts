import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import { loginSchema } from "@/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

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

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Akun Anda dinonaktifkan" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

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
      { status: 200 }
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
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
