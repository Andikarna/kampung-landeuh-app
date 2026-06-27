import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { generateBookingNumber } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: { fullName: true, email: true, phone: true }
        },
        destination: {
          select: { name: true, ticketPrice: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const { destinationId, visitDate, endDate, numberOfVisitors, notes } = body;

    // Get destination to calculate total price
    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) }
    });

    if (!destination) {
      return NextResponse.json({ success: false, error: "Destinasi tidak ditemukan" }, { status: 404 });
    }

    // Calculate number of days (min 1)
    const start = new Date(visitDate);
    const end = endDate ? new Date(endDate) : null;
    const days = end && end > start
      ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    const totalPrice = Number(destination.ticketPrice) * Number(numberOfVisitors) * days;
    const bookingNumber = generateBookingNumber();

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: session.userId,
        destinationId: Number(destinationId),
        visitDate: start,
        endDate: end,
        numberOfVisitors: Number(numberOfVisitors),
        totalPrice,
        status: "pending",
        notes
      }
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message || "Gagal membuat reservasi" }, { status: 500 });
  }
}
