"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const eventSchema = z.object({
  title: z.string().min(3, "Judul event minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
});

type EventInput = z.infer<typeof eventSchema>;

export default function TambahEventPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventInput) => {
    try {
      setError(null);
      await api.post("/events", data);
      router.push("/admin/event");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan event");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/event" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Event</h1>
          <p className="text-muted-foreground text-sm">Tambahkan agenda acara wisata baru.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Event / Festival</label>
            <Input {...register("title")} placeholder="Contoh: Festival Budaya Sunda 2026" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Input {...register("startDate")} type="date" />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Selesai</label>
              <Input {...register("endDate")} type="date" />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lokasi Pelaksanaan</label>
            <Input {...register("location")} placeholder="Contoh: Alun-Alun Kampung Landeuh" />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Lengkap</label>
            <textarea
              {...register("description")}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
              placeholder="Ceritakan tentang acara yang akan diselenggarakan..."
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Link href="/admin/event" className={buttonVariants({ variant: "outline" })}>Batal</Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
