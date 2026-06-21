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

    const body = await req.json();
    const gallery = await prisma.gallery.create({
      data: {
        title: body.title,
        mediaUrl: body.mediaUrl || "https://picsum.photos/seed/gallery-placeholder/1000/800",
        mediaType: body.mediaType || "photo",
        isFeatured: body.isFeatured || false,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      }
    });

    return NextResponse.json({ success: true, data: gallery }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
