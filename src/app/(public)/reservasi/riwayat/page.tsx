"use client";

import { useAuth } from "@/providers/AuthProvider";
import { formatCurrency, formatDateTime, getStatusBadgeColor, getStatusLabel } from "@/lib/utils";
import { MapPin, Calendar, Users, ChevronRight, BookOpen, Eye, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function BookingHistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/masuk");
    }
  }, [user, loading, router]);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/me");
      return res.data.data;
    },
    enabled: !!user,
  });

  const bookings = historyData || [];

  const generateWhatsAppMessage = (booking: any) => {
    const message = `Halo Admin, saya ingin melakukan pembayaran untuk reservasi tiket wisata dengan detail berikut:\n\n*Kode Reservasi:* ${booking.bookingNumber}\n*Nama Pemesan:* ${user?.fullName || ''}\n*Email:* ${user?.email || ''}\n*Telepon:* ${user?.phone || ''}\n\n*Detail Reservasi:*\n*Destinasi:* ${booking.destination.name}\n*Tanggal Kunjungan:* ${new Date(booking.visitDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}\n*Jumlah Pengunjung:* ${booking.numberOfVisitors} Orang\n*Total Pembayaran:* ${formatCurrency(booking.totalPrice)}\n\nMohon bantu untuk proses pembayaran selanjutnya. Terima kasih!`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppPayment = (booking: any) => {
    const phoneNumber = "6282211129043"; // Format: kode negara + nomor tanpa awalan 0
    const message = generateWhatsAppMessage(booking);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading || isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading tracking-tight mb-2">Riwayat Reservasi</h1>
          <p className="text-muted-foreground">Kelola tiket dan lihat riwayat kunjungan wisata Anda</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm border border-dashed">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Belum ada reservasi</h3>
            <p className="text-muted-foreground mb-6">Anda belum pernah melakukan reservasi tiket wisata.</p>
            <Link href="/destinasi" className="inline-flex px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Cari Destinasi
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all">
                
                {/* Image */}
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={booking.destination.coverImage || "https://picsum.photos/seed/booking-placeholder/1000/800"} alt={booking.destination.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span>{booking.bookingNumber}</span>
                        <span>•</span>
                        <span>Dipesan: {formatDateTime(booking.createdAt)}</span>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold font-heading mb-4">{booking.destination.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(booking.visitDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{booking.numberOfVisitors} Orang</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Total Pembayaran</span>
                      <span className="font-bold text-primary">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Detail
                      </Button>
                      
                      {booking.status === "pending" && (
                        <Button
                          size="sm"
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                          onClick={() => handleWhatsAppPayment(booking)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1.5" />
                          Bayar via WA
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detail Reservasi</DialogTitle>
              <DialogDescription>
                Kode Reservasi: <span className="font-mono font-medium">{selectedBooking.bookingNumber}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={selectedBooking.destination.coverImage || "https://picsum.photos/seed/booking-detail/1000/800"} 
                  alt={selectedBooking.destination.name} 
                  className="w-full h-48 object-cover" 
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold font-heading">{selectedBooking.destination.name}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusBadgeColor(selectedBooking.status)}`}>
                      {getStatusLabel(selectedBooking.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Dipesan</p>
                    <p className="font-medium">{formatDateTime(selectedBooking.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Kunjungan</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.visitDate).toLocaleDateString("id-ID", { 
                      weekday: "long", day: "numeric", month: "long", year: "numeric" 
                    })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Pengunjung</p>
                    <p className="font-medium">{selectedBooking.numberOfVisitors} Orang</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                    <p className="font-bold text-lg text-primary">{formatCurrency(selectedBooking.totalPrice)}</p>
                  </div>
                </div>
                
                {selectedBooking.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">Catatan</p>
                    <p className="font-medium">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              {selectedBooking.status === "pending" && (
                <Button
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleWhatsAppPayment(selectedBooking);
                    setIsDetailOpen(false);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Bayar via WhatsApp
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsDetailOpen(false)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
