import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const [
      totalDestinations,
      totalUsers,
      totalBookings,
      newReviews,
      upcomingEvents,
      recentBookings,
      bookingsByCategory,
    ] = await Promise.all([
      prisma.destination.count(),
      prisma.user.count({ where: { role: { name: "Wisatawan" } } }),
      prisma.booking.count(),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.event.count({ where: { status: "upcoming" } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true } },
          destination: { select: { name: true } },
        },
      }),
      prisma.destinationCategory.findMany({
        include: {
          _count: {
            select: { destinations: true }
          },
          destinations: {
            include: {
              _count: {
                select: { bookings: true }
              }
            }
          }
        }
      }),
    ]);

    // Format bookings data for chart
    const chartBookingsData = bookingsByCategory.map(cat => ({
      name: cat.name,
      value: cat.destinations.reduce((acc, dest) => acc + dest._count.bookings, 0)
    }));

    // For visitor chart we can just simulate recent 6 months with real user counts
    // But since it's a new system we might not have 6 months of data
    // We'll group users by month of creation for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentUsers = await prisma.user.findMany({
      where: {
        role: { name: "Wisatawan" },
        createdAt: { gte: sixMonthsAgo }
      },
      select: { createdAt: true }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    
    // Initialize last 6 months with 0
    const visitorsDataObj: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = monthNames[d.getMonth()];
      visitorsDataObj[monthName] = 0;
    }

    // Populate data
    recentUsers.forEach(u => {
      const monthName = monthNames[u.createdAt.getMonth()];
      if (visitorsDataObj[monthName] !== undefined) {
        visitorsDataObj[monthName]++;
      }
    });

    const chartVisitorsData = Object.entries(visitorsDataObj).map(([name, value]) => ({ name, value }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalDestinations,
          totalUsers,
          totalBookings,
          newReviews,
          upcomingEvents,
        },
        recentBookings,
        chartBookingsData,
        chartVisitorsData,
      }
    }, { status: 200 });

  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
