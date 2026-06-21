import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: { select: { name: true } },
        phone: true,
        createdAt: true,
        // we don't select password
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
