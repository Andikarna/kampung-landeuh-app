import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    
    const contact = await prisma.contact.update({
      where: { id: Number(id) },
      data: { isRead: body.isRead }
    });

    return NextResponse.json({ success: true, data: contact });
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
    await prisma.contact.delete({
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
