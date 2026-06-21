import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    
    const gallery = await prisma.gallery.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        mediaUrl: body.mediaUrl,
        mediaType: body.mediaType,
        isFeatured: body.isFeatured,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      }
    });

    return NextResponse.json({ success: true, data: gallery });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;
    await prisma.gallery.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
