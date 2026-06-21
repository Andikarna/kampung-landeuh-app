import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    
    // We only allow updating roles or status for now
    const updateData: any = {};
    if (body.role) {
      const role = await prisma.role.findUnique({ where: { name: body.role } });
      if (role) {
        updateData.roleId = role.id;
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      include: { role: true }
    });

    return NextResponse.json({ success: true, data: { id: user.id, role: user.role?.name } });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
