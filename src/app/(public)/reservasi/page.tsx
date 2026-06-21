"use client";

import { useState, Suspense } from "react";
import { formatCurrency, generateBookingNumber } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/schemas";
import { Calendar, Users, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

import { useQuery, useMutation } from "@tanstack/react-query";

function BookingFormContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultDestId = searchParams.get("destinasi");
  
  const [success, setSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      destinationId: defaultDestId ? parseInt(defaultDestId) : undefined,
      numberOfVisitors: 1,
    }
  });

  const selectedDestId = watch("destinationId");
  const numberOfVisitors = watch("numberOfVisitors");
  
  const { data: destinationsData, isLoading: isLoadingDestinations } = useQuery({
    queryKey: ["public-destinations"],
    queryFn: async () => {
      const res = await api.get("/destinations");
      return res.data.data;
    }
  });

  const destinations = destinationsData || [];
  
  const selectedDest = destinations.find((d: any) => d.id === Number(selectedDestId));
  const totalPrice = (selectedDest?.ticketPrice || 0) * (numberOfVisitors || 1);

  const mutation = useMutation({
    mutationFn: async (data: BookingInput) => {
      const res = await api.post("/bookings", data);
      return res.data;
    },
    onSuccess: (data) => {
      setBookingNumber(data.data.bookingNumber);
      setSuccess(true);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Gagal membuat reservasi. Silakan coba lagi.");
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Perlu Masuk</h2>
          <p className="text-muted-foreground mb-6">Anda harus masuk ke akun Anda terlebih dahulu untuk melakukan reservasi tiket.</p>
          <Link href="/masuk" className="block w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: BookingInput) => {
    mutation.mutate(data);
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-lg w-full border">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">Reservasi Berhasil!</h2>
          <p className="text-muted-foreground mb-6">Terima kasih telah melakukan reservasi. Tiket Anda sedang diproses.</p>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed mb-8 text-left">
            <p className="text-sm text-muted-foreground mb-1">Nomor Reservasi</p>
            <p className="text-xl font-bold font-mono tracking-widest text-primary">{bookingNumber}</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/reservasi/riwayat" className="flex-1 py-3 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              Lihat Tiket
            </Link>
            <Link href="/" className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading tracking-tight">Formulir Reservasi</h1>
          <p className="text-muted-foreground">Isi detail di bawah ini untuk memesan tiket wisata</p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-lg border border-destructive/30 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border">
              <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Destination */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Pilih Destinasi Wisata</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      {...register("destinationId", { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none appearance-none"
                    >
                      <option value="">-- Pilih Destinasi --</option>
                      {destinations.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.destinationId && <p className="text-xs text-destructive">{errors.destinationId.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Tanggal Kunjungan</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        {...register("visitDate")}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    {errors.visitDate && <p className="text-xs text-destructive">{errors.visitDate.message}</p>}
                  </div>

                  {/* Visitors */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Jumlah Pengunjung</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        {...register("numberOfVisitors", { valueAsNumber: true })}
                        type="number"
                        min="1"
                        max="100"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    {errors.numberOfVisitors && <p className="text-xs text-destructive">{errors.numberOfVisitors.message}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Catatan Tambahan (Opsional)</label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Contoh: Kami rombongan keluarga, butuh pendampingan khusus."
                    className="w-full p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                  ></textarea>
                </div>

              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border sticky top-24">
              <h3 className="text-xl font-bold font-heading mb-6 pb-4 border-b">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pemesan</span>
                  <span className="font-medium text-right">{user.fullName}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destinasi</span>
                  <span className="font-medium text-right">{selectedDest?.name || "-"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga Tiket</span>
                  <span className="font-medium text-right">
                    {selectedDest ? (selectedDest.ticketPrice === 0 ? "Gratis" : formatCurrency(selectedDest.ticketPrice)) : "-"}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah Orang</span>
                  <span className="font-medium text-right">{numberOfVisitors || 0} Orang</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Harga</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                form="booking-form"
                disabled={mutation.isPending || !selectedDestId}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                ) : (
                  "Konfirmasi Reservasi"
                )}
              </button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Dengan mengkonfirmasi, Anda menyetujui Syarat dan Ketentuan yang berlaku.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <BookingFormContent />
    </Suspense>
  );
}
