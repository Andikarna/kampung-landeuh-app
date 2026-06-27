import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;
    const { name, icon } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const slug = generateSlug(name);
    const category = await prisma.destinationCategory.update({
      where: { id: Number(id) },
      data: { name, slug, icon: icon || null },
    });

    return NextResponse.json({ success: true, data: category });
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;

    // Check if category has destinations
    const count = await prisma.destination.count({ where: { categoryId: Number(id) } });
    if (count > 0) {
      return NextResponse.json(
        { success: false, error: `Kategori tidak bisa dihapus karena masih memiliki ${count} destinasi` },
        { status: 400 }
      );
    }

    await prisma.destinationCategory.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
