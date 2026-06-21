"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
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

interface Gallery {
  id: number;
  title: string;
  mediaUrl: string;
  mediaType: string;
  isFeatured: boolean;
}

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-galleries"],
    queryFn: async () => {
      const res = await api.get(`/galleries`);
      return res.data.data as Gallery[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/galleries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-galleries"] });
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Galeri</h1>
          <p className="text-muted-foreground mt-1">Kelola foto dan video dokumentasi Kampung Landeuh.</p>
        </div>
        <Link href="/admin/galeri/tambah" className={buttonVariants({ variant: "default" }) + " bg-primary hover:bg-primary/90 text-white"}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Media
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center p-12 text-destructive">Gagal memuat data galeri.</div>
          ) : data?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Tidak ada media yang ditemukan di galeri.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                        {item.mediaUrl ? (
                          <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title || "Tanpa Judul"}</TableCell>
                    <TableCell>
                      <span className="uppercase text-xs font-bold text-slate-500">{item.mediaType}</span>
                    </TableCell>
                    <TableCell>
                      {item.isFeatured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                          Biasa
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/galeri/${item.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Link>
                      
                      <AlertDialog open={deletingId === item.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" />} onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Media?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Media ini akan dihapus dari galeri publik secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Menghapus..." : "Hapus Media"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
