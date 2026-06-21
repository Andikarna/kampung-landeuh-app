import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let whereClause: any = {
      status: "active",
    };

    if (category && category !== "Semua") {
      whereClause.category = {
        name: category,
      };
    }

    if (search) {
      whereClause.name = {
        contains: search,
      };
    }

    const destinations = await prisma.destination.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        viewCount: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: destinations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Destinations Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const body = await req.json();
    
    // Default placeholder fields since we don't have a robust image upload yet
    const newDestination = await prisma.destination.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: body.description,
        ticketPrice: Number(body.price),
        categoryId: Number(body.categoryId),
        location: body.location || "Kampung Landeuh",
        latitude: body.latitude ? Number(body.latitude) : -6.81,
        longitude: body.longitude ? Number(body.longitude) : 107.12,
        coverImage: body.imageUrl || "https://picsum.photos/seed/destination-cover/1000/800",
        status: "active",
      },
    });

    return NextResponse.json(
      { success: true, data: newDestination },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Destination Error:", error);
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
