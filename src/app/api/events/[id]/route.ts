import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        eventDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        location: body.location,
        bannerUrl: body.imageUrl,
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Event berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
