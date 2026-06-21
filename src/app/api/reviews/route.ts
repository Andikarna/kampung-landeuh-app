import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { reviewSchema } from "@/schemas";

export async function GET() {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        destination: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { requireAuth, getSession } = await import("@/lib/auth");
    const session = await requireAuth();

    const body = await req.json();
    
    // Convert string numbers to actual numbers
    const parsedBody = {
      ...body,
      destinationId: Number(body.destinationId),
      rating: Number(body.rating)
    };
    
    const validatedData = reviewSchema.parse(parsedBody);

    // Check if user already reviewed this destination
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_destinationId: {
          userId: session.userId,
          destinationId: validatedData.destinationId
        }
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "Anda sudah memberikan ulasan untuk destinasi ini" },
        { status: 400 }
      );
    }

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id: validatedData.destinationId }
    });

    if (!destination) {
      return NextResponse.json(
        { success: false, error: "Destinasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.userId,
        destinationId: validatedData.destinationId,
        rating: validatedData.rating,
        comment: validatedData.comment,
        isApproved: false // Admin needs to approve first
      }
    });

    return NextResponse.json(
      { success: true, data: review, message: "Ulasan berhasil dikirim dan menunggu persetujuan" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Review error:", error);
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Silakan masuk terlebih dahulu" }, { status: 401 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Anda sudah memberikan ulasan untuk destinasi ini" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Gagal mengirim ulasan: " + error.message },
      { status: 500 }
    );
  }
}
