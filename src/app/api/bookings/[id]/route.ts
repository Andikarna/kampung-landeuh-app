import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: idString } = await params;
    const body = await req.json();
    const { status } = body;

    console.log("PATCH request:", { idString, status });

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status tidak boleh kosong" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const id = Number(idString);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Check if booking exists first
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Reservasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH error:", error);
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
