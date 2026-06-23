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
        destinationFacilities: {
          include: {
            facility: true,
          },
        },
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

    const formData = await req.formData();
    
    // Ambil data dari form
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const location = formData.get("location") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const coverImageFile = formData.get("coverImage") as File | null;
    const facilityIdsJson = formData.get("facilityIds") as string | null;
    
    // Convert file to base64
    let coverImage = null;
    if (coverImageFile) {
      const arrayBuffer = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const mimeType = coverImageFile.type;
      coverImage = `data:${mimeType};base64,${base64}`;
    }

    // Parse facility ids
    let facilityIds: number[] = [];
    if (facilityIdsJson) {
      try {
        facilityIds = JSON.parse(facilityIdsJson);
      } catch (e) {
        // ignore invalid JSON
      }
    }

    const newDestination = await prisma.destination.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        ticketPrice: Number(price),
        categoryId: Number(categoryId),
        location: location || "Kampung Landeuh",
        latitude: latitude ? Number(latitude) : -6.81,
        longitude: longitude ? Number(longitude) : 107.12,
        coverImage: coverImage || "https://picsum.photos/seed/destination-cover/1000/800",
        status: "active",
        destinationFacilities: facilityIds.length > 0 ? {
          create: facilityIds.map((facilityId) => ({
            facilityId,
          })),
        } : undefined,
      },
      include: {
        destinationFacilities: {
          include: {
            facility: true,
          },
        },
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
