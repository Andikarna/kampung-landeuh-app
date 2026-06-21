"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AddGalleryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    mediaType: "photo",
    isFeatured: false,
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/galleries", data);
      return res.data;
    },
    onSuccess: () => {
      router.push("/admin/galeri");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Gagal menyimpan galeri");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mediaUrl) {
      setError("URL Media wajib diisi");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/galeri" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Tambah Media Galeri</h1>
          <p className="text-muted-foreground text-sm mt-1">Unggah foto atau video baru.</p>
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
            <label className="text-sm font-medium">Judul Media (Opsional)</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              placeholder="Contoh: Festival Budaya 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL Media <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://..."
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipe Media</label>
            <select
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              value={formData.mediaType}
              onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
            >
              <option value="photo">Foto</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary rounded border-slate-300"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              Jadikan Unggulan (Tampil di Beranda)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Link href="/admin/galeri" className={buttonVariants({ variant: "outline" })}>
              Batal
            </Link>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Simpan Media</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
