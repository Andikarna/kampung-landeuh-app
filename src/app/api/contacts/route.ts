import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/schemas";

export async function GET() {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();

    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: contacts }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi gagal",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        subject: result.data.subject,
        message: result.data.message,
      },
    });

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
