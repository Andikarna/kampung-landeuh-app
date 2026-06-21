import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.userId
      },
      include: {
        destination: {
          select: { name: true, coverImage: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
