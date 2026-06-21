"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const destinationSchema = z.object({
  name: z.string().min(3, "Nama destinasi minimal 3 karakter"),
  categoryId: z.number().min(1, "Pilih kategori wisata"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  location: z.string().min(3, "Lokasi wajib diisi"),
});

type DestinationInput = z.infer<typeof destinationSchema>;

export default function TambahDestinasiPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["destination-categories"],
    queryFn: async () => {
      const res = await api.get("/destination-categories");
      return res.data.data;
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DestinationInput>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      price: 0,
      categoryId: 1, // Default to Alam
    }
  });

  const onSubmit = async (data: DestinationInput) => {
    try {
      setError(null);
      await api.post("/destinations", data);
      router.push("/admin/destinasi");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan destinasi");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/destinasi" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Destinasi</h1>
          <p className="text-muted-foreground text-sm">Tambahkan destinasi wisata baru ke dalam sistem.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Wisata</label>
              <Input {...register("name")} placeholder="Contoh: Curug Landeuh" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {categories ? categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                )) : (
                  <option value={1}>Wisata Alam</option>
                )}
              </select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Tiket (Rp)</label>
              <Input {...register("price", { valueAsNumber: true })} type="number" min="0" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lokasi / Alamat</label>
              <Input {...register("location")} placeholder="Contoh: RT 01 / RW 02" />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              {...register("description")}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
              placeholder="Jelaskan daya tarik dan informasi lengkap mengenai wisata ini..."
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Link href="/admin/destinasi" className={buttonVariants({ variant: "outline" })}>Batal</Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Destinasi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
