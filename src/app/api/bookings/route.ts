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

    const { destinationId, visitDate, numberOfVisitors, notes } = body;

    // Get destination to calculate total price
    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) }
    });

    if (!destination) {
      return NextResponse.json({ success: false, error: "Destinasi tidak ditemukan" }, { status: 404 });
    }

    const totalPrice = Number(destination.ticketPrice) * Number(numberOfVisitors);
    const bookingNumber = generateBookingNumber();

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: session.userId,
        destinationId: Number(destinationId),
        visitDate: new Date(visitDate),
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
