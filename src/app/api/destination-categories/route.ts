import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.destinationCategory.findMany();
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
