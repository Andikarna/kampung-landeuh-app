"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);

  const [formData, setFormData] = useState({
    title: "",
    mediaType: "photo",
    isFeatured: false,
    sortOrder: "0",
    destinationId: "",
  });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { data: gallery, isLoading: galleryLoading } = useQuery({
    queryKey: ["gallery", id],
    queryFn: async () => {
      const res = await api.get("/galleries");
      const found = res.data.data.find((f: any) => f.id === Number(id));
      if (!found) throw new Error("Not found");
      return found;
    },
  });

  const { data: destinations } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: async () => {
      const res = await api.get("/destinations");
      return res.data.data;
    }
  });

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || "",
        mediaType: gallery.mediaType || "photo",
        isFeatured: gallery.isFeatured || false,
        sortOrder: String(gallery.sortOrder || 0),
        destinationId: gallery.destinationId ? String(gallery.destinationId) : "",
      });
      if (gallery.mediaUrl) {
        setMediaPreview(gallery.mediaUrl);
      }
    }
  }, [gallery]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const res = await api.put(`/galleries/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-galleries"] });
      router.push("/admin/galeri");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Gagal memperbarui galeri");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("mediaType", formData.mediaType);
    formDataToSend.append("isFeatured", String(formData.isFeatured));
    formDataToSend.append("sortOrder", formData.sortOrder);
    if (formData.destinationId) {
      formDataToSend.append("destinationId", formData.destinationId);
    }
    if (mediaFile) {
      formDataToSend.append("mediaFile", mediaFile);
    }

    mutation.mutate(formDataToSend);
  };

  if (galleryLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/galeri" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Edit Media Galeri</h1>
          <p className="text-muted-foreground text-sm mt-1">Perbarui foto atau video.</p>
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
            <label className="text-sm font-medium">Unggah Media (Opsional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              {mediaPreview && (
                <div className="relative rounded-lg overflow-hidden border">
                  {formData.mediaType === "video" ? (
                    <video src={mediaPreview} className="w-full h-40 object-cover" controls />
                  ) : (
                    <img src={mediaPreview} alt="Preview" className="w-full h-40 object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>

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
            <label className="text-sm font-medium">Destinasi (Opsional)</label>
            <select
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              value={formData.destinationId}
              onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
            >
              <option value="">Tidak terkait destinasi</option>
              {destinations?.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">Urutan</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
                placeholder="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
              />
            </div>
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
                <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
