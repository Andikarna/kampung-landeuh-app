import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ]
    });
    return NextResponse.json({ success: true, data: galleries }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const formData = await req.formData();
    
    // Ambil data dari form
    const title = formData.get("title") as string;
    const mediaType = formData.get("mediaType") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const sortOrder = formData.get("sortOrder") as string;
    const destinationId = formData.get("destinationId") as string;
    const mediaFile = formData.get("mediaFile") as File | null;
    
    // Convert file to base64
    let mediaUrl = null;
    if (mediaFile) {
      const arrayBuffer = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const mimeType = mediaFile.type;
      mediaUrl = `data:${mimeType};base64,${base64}`;
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        mediaUrl: mediaUrl || "https://picsum.photos/seed/gallery-placeholder/1000/800",
        mediaType: mediaType || "photo",
        isFeatured,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        destinationId: destinationId ? Number(destinationId) : null,
      }
    });

    return NextResponse.json({ success: true, data: gallery }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    console.error("Create Gallery Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
