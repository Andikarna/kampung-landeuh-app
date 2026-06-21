import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        eventDate: "asc",
      },
    });

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const newEvent = await prisma.event.create({
      data: {
        title: body.title,
        slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
        description: body.description,
        eventDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        location: body.location,
        bannerUrl: body.imageUrl || "https://picsum.photos/seed/event-banner/1000/800",
        status: body.status || "upcoming",
      },
    });

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
