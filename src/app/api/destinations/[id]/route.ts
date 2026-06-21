import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.name ? body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined,
        description: body.description,
        ticketPrice: body.price !== undefined ? Number(body.price) : undefined,
        categoryId: body.categoryId !== undefined ? Number(body.categoryId) : undefined,
        location: body.location,
        latitude: body.latitude !== undefined ? Number(body.latitude) : undefined,
        longitude: body.longitude !== undefined ? Number(body.longitude) : undefined,
        coverImage: body.imageUrl,
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

    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Destinasi berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
