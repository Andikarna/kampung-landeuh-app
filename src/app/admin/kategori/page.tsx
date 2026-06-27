"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Plus, Edit2, Trash2, Loader2, Tag, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  _count: { destinations: number };
}

export default function AdminKategoriPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await api.get("/destination-categories");
      return res.data.data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ name, icon }: { name: string; icon: string }) => {
      await api.post("/destination-categories", { name, icon });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["destination-categories"] });
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.error || "Gagal menyimpan kategori");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, icon }: { id: number; name: string; icon: string }) => {
      await api.put(`/destination-categories/${id}`, { name, icon });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["destination-categories"] });
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.error || "Gagal memperbarui kategori");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/destination-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["destination-categories"] });
      setDeletingId(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Gagal menghapus kategori");
      setDeletingId(null);
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormIcon("");
    setFormError(null);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormIcon(cat.icon || "");
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Nama kategori wajib diisi");
      return;
    }
    setFormError(null);
    if (editingId) {
      updateMutation.mutate({ id: editingId, name: formName.trim(), icon: formIcon.trim() });
    } else {
      createMutation.mutate({ name: formName.trim(), icon: formIcon.trim() });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Kategori Wisata</h1>
          <p className="text-muted-foreground mt-1">Kelola kategori untuk pengelompokan destinasi wisata.</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Form Tambah / Edit */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6 max-w-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
          </h2>
          {formError && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nama Kategori <span className="text-destructive">*</span></label>
              <Input
                placeholder="Contoh: Wisata Alam"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                autoFocus
              />
            </div>
            <EmojiPicker
              value={formIcon}
              onChange={(emoji) => setFormIcon(emoji)}
              label="Ikon Emoji (Opsional)"
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {editingId ? "Perbarui" : "Simpan"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" /> Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Kategori */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center p-12 text-destructive">Gagal memuat data kategori.</div>
        ) : data?.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">Belum ada kategori wisata.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Jumlah Destinasi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                        {cat.icon || <Tag className="w-4 h-4 text-primary" />}
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {cat._count?.destinations ?? 0} destinasi
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>

                      <AlertDialog open={deletingId === cat.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger
                          render={<Button variant="ghost" size="icon" />}
                          onClick={() => setDeletingId(cat.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Kategori <strong>{cat.name}</strong> akan dihapus permanen.
                              {cat._count?.destinations > 0 && (
                                <span className="block mt-2 text-destructive font-medium">
                                  Kategori ini memiliki {cat._count.destinations} destinasi dan tidak bisa dihapus.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(cat.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={deleteMutation.isPending || (cat._count?.destinations ?? 0) > 0}
                            >
                              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
