import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // Coba parse formData, jika gagal coba parse json
    let data: any = {};
    try {
      const formData = await req.formData();
      data.name = formData.get("name") as string || undefined;
      data.description = formData.get("description") as string || undefined;
      data.price = formData.get("price") as string || undefined;
      data.categoryId = formData.get("categoryId") as string || undefined;
      data.location = formData.get("location") as string || undefined;
      data.latitude = formData.get("latitude") as string || undefined;
      data.longitude = formData.get("longitude") as string || undefined;
      data.status = formData.get("status") as string || undefined;
      data.facilityIds = formData.get("facilityIds") as string || undefined;
      
      // Handle file upload
      const coverImageFile = formData.get("coverImage") as File | null;
      if (coverImageFile && coverImageFile.size > 0) {
        const arrayBuffer = await coverImageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const mimeType = coverImageFile.type;
        data.coverImage = `data:${mimeType};base64,${base64}`;
      }
    } catch {
      // Jika formData gagal, coba json
      const body = await req.json();
      data = body;
    }

    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.ticketPrice = Number(data.price);
    if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);
    if (data.location !== undefined) updateData.location = data.location;
    if (data.latitude !== undefined) updateData.latitude = Number(data.latitude);
    if (data.longitude !== undefined) updateData.longitude = Number(data.longitude);
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.status !== undefined) updateData.status = data.status;

    // Handle facility updates
    let facilityIds: number[] = [];
    if (data.facilityIds) {
      try {
        facilityIds = JSON.parse(data.facilityIds);
      } catch (e) {
        // ignore invalid JSON
      }
    }

    if (data.facilityIds !== undefined) {
      // Delete existing and create new ones
      updateData.destinationFacilities = {
        deleteMany: {},
        create: facilityIds.map((facilityId) => ({
          facilityId,
        })),
      };
    }

    const updated = await prisma.destination.update({
      where: { id },
      data: updateData,
      include: {
        destinationFacilities: {
          include: {
            facility: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Update Destination Error:", error);
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Destinasi berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
