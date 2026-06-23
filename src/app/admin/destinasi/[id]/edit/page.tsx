"use client";

import { useState, useEffect, use } from "react";
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
  status: z.string().optional(),
  facilityIds: z.array(z.number()).optional(),
});

type DestinationInput = z.infer<typeof destinationSchema>;

export default function EditDestinasiPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [error, setError] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["destination-categories"],
    queryFn: async () => {
      const res = await api.get("/destination-categories");
      return res.data.data;
    }
  });

  const { data: facilities } = useQuery({
    queryKey: ["admin-facilities"],
    queryFn: async () => {
      const res = await api.get("/facilities");
      return res.data.data;
    }
  });

  const { data: destination, isLoading: destLoading } = useQuery({
    queryKey: ["destination", id],
    queryFn: async () => {
      const res = await api.get("/destinations");
      const found = res.data.data.find((d: any) => d.id === Number(id));
      if (!found) throw new Error("Destinasi tidak ditemukan");
      return found;
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<DestinationInput>({
    resolver: zodResolver(destinationSchema),
  });

  const selectedFacilityIds = watch("facilityIds", []);

  const toggleFacility = (facilityId: number) => {
    const current = selectedFacilityIds || [];
    if (current.includes(facilityId)) {
      setValue("facilityIds", current.filter(id => id !== facilityId));
    } else {
      setValue("facilityIds", [...current, facilityId]);
    }
  };

  useEffect(() => {
    if (destination) {
      const existingFacilityIds = destination.destinationFacilities?.map((df: any) => df.facilityId) || [];
      reset({
        name: destination.name,
        categoryId: destination.categoryId,
        description: destination.description,
        price: Number(destination.ticketPrice),
        location: destination.location,
        status: destination.status || "active",
        facilityIds: existingFacilityIds,
      });
      if (destination.coverImage) {
        setCoverImagePreview(destination.coverImage);
      }
    }
  }, [destination, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: DestinationInput) => {
    try {
      setError(null);
      const formData = new FormData();
      
      // Add text fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("categoryId", String(data.categoryId));
      formData.append("location", data.location);
      if (data.status) formData.append("status", data.status);
      
      // Add facility ids
      if (data.facilityIds) {
        formData.append("facilityIds", JSON.stringify(data.facilityIds));
      }
      
      // Add image file if selected
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      await api.put(`/destinations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/admin/destinasi");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal memperbarui destinasi");
    }
  };

  if (destLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/destinasi" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Destinasi</h1>
          <p className="text-muted-foreground text-sm">Perbarui informasi destinasi wisata.</p>
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
            <label className="text-sm font-medium">Gambar Cover</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              {coverImagePreview && (
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={coverImagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

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
            <label className="text-sm font-medium">Fasilitas Tersedia</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {facilities?.map((facility: any) => (
                <label 
                  key={facility.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedFacilityIds?.includes(facility.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFacilityIds?.includes(facility.id) || false}
                    onChange={() => toggleFacility(facility.id)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">{facility.name}</span>
                </label>
              ))}
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
              Perbarui Destinasi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
