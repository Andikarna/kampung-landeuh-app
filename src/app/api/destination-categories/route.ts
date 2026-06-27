import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await prisma.destinationCategory.findMany({
      include: { _count: { select: { destinations: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    console.error("Get Categories Error:", error);
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

    const { name, icon } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const slug = generateSlug(name);
    const category = await prisma.destinationCategory.create({
      data: { name, slug, icon: icon || null },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Nama kategori sudah ada" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
