import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Ticket, 
  Star, 
  ArrowLeft,
  Calendar,
  Users
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { FACILITIES_LIST } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DestinasiDetailTabs from "./DestinasiDetailTabs";
import { cookies } from "next/headers";

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const dest = await prisma.destination.findUnique({
    where: { slug },
    include: {
      category: true,
      destinationFacilities: {
        include: {
          facility: true
        }
      },
      galleries: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { fullName: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!dest) {
    notFound();
  }

  // Convert Decimal to Number and Dates to Strings for client components
  const serializedDest = {
    ...dest,
    ticketPrice: Number(dest.ticketPrice),
    averageRating: Number(dest.averageRating),
    createdAt: dest.createdAt.toISOString(),
    updatedAt: dest.updatedAt.toISOString(),
    reviews: dest.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    })),
    galleries: dest.galleries.map(g => ({
      ...g,
      createdAt: g.createdAt.toISOString()
    })),
    destinationFacilities: dest.destinationFacilities.map(df => ({
      ...df,
      facility: {
        ...df.facility,
        createdAt: df.facility.createdAt.toISOString()
      }
    }))
  };

  // Get user session to check if they've reviewed
  let userReview = null;
  const tokenCookie = (await cookies()).get("token");
  
  if (tokenCookie) {
    try {
      const { getSession } = await import("@/lib/auth");
      const session = await getSession();
      
      if (session?.userId) {
        userReview = await prisma.review.findUnique({
          where: {
            userId_destinationId: {
              userId: session.userId,
              destinationId: dest.id
            }
          }
        });
      }
    } catch (error) {
      // Ignore errors
    }
  }

  // Formatting specific data
  const averageRating = dest.reviews.length > 0 
    ? dest.reviews.reduce((acc, r) => acc + r.rating, 0) / dest.reviews.length
    : 0;


  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 pb-20 pt-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={serializedDest.coverImage || "https://picsum.photos/seed/dest-detail/2000/1200"} 
          alt={serializedDest.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <Link href="/destinasi" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full mb-4">
                {serializedDest.category?.name || "Lainnya"}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white font-heading mb-4">
                {serializedDest.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Kampung Landeuh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-white">{averageRating.toFixed(1)}</span>
                  <span>({serializedDest.reviews.length} ulasan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <DestinasiDetailTabs dest={serializedDest} averageRating={averageRating} userReview={userReview} />
          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border overflow-hidden">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b">
                <p className="text-sm text-muted-foreground mb-1">Harga Tiket Masuk</p>
                <div className="text-3xl font-bold text-primary">
                  {serializedDest.ticketPrice === 0 ? "Gratis" : formatCurrency(serializedDest.ticketPrice)}
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Jam Operasional</p>
                      <p className="text-sm text-muted-foreground">07:00 - 17:00 WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">E-Ticket Tersedia</p>
                      <p className="text-sm text-muted-foreground">Langsung masuk tanpa antre</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/reservasi?destinasi=${serializedDest.id}`}
                  className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservasi Sekarang
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
