import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get Settings Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { key, value } = await req.json();

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    console.error("Upsert Setting Error:", error);
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}