import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: facilities }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const body = await req.json();
    const facility = await prisma.facility.create({
      data: {
        name: body.name,
        icon: body.icon,
        description: body.description,
      }
    });

    return NextResponse.json({ success: true, data: facility }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
