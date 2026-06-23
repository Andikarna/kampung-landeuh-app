import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;
    
    // Coba parse formData, jika gagal coba parse json
    let data: any = {};
    try {
      const formData = await req.formData();
      data.title = formData.get("title") as string || undefined;
      data.mediaType = formData.get("mediaType") as string || undefined;
      data.isFeatured = formData.get("isFeatured") === "true";
      data.sortOrder = formData.get("sortOrder") as string || undefined;
      data.destinationId = formData.get("destinationId") as string || undefined;
      
      // Handle file upload
      const mediaFile = formData.get("mediaFile") as File | null;
      if (mediaFile && mediaFile.size > 0) {
        const arrayBuffer = await mediaFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const mimeType = mediaFile.type;
        data.mediaUrl = `data:${mimeType};base64,${base64}`;
      }
    } catch {
      // Jika formData gagal, coba json
      const body = await req.json();
      data = body;
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.mediaUrl !== undefined) updateData.mediaUrl = data.mediaUrl;
    if (data.mediaType !== undefined) updateData.mediaType = data.mediaType;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder);
    if (data.destinationId !== undefined) updateData.destinationId = data.destinationId ? Number(data.destinationId) : null;

    const gallery = await prisma.gallery.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: gallery });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Update Gallery Error:", error);
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
