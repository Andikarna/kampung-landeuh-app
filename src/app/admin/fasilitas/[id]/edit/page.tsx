"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);

  const [formData, setFormData] = useState({
    name: "",
    icon: "Building",
    description: "",
  });
  const [error, setError] = useState("");

  const { data: facility, isLoading } = useQuery({
    queryKey: ["facility", id],
    queryFn: async () => {
      // In a real app we might have a GET /facilities/:id, but for now we can just fetch all and find it
      const res = await api.get("/facilities");
      const found = res.data.data.find((f: any) => f.id === Number(id));
      if (!found) throw new Error("Not found");
      return found;
    },
  });

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || "",
        icon: facility.icon || "Building",
        description: facility.description || "",
      });
    }
  }, [facility]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/facilities/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      router.push("/admin/fasilitas");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Gagal memperbarui fasilitas");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Nama fasilitas wajib diisi");
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/fasilitas" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Edit Fasilitas</h1>
          <p className="text-muted-foreground text-sm mt-1">Perbarui data fasilitas.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6">
        {error && (
          <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Fasilitas <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              placeholder="Contoh: Area Parkir Luas"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ikon (Lucide Icon Name)</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              placeholder="Contoh: Building, Car, Bath"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              rows={4}
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Deskripsi singkat fasilitas..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Link href="/admin/fasilitas" className={buttonVariants({ variant: "outline" })}>
              Batal
            </Link>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
