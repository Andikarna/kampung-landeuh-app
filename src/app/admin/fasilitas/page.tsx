"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Plus, Edit, Trash2, Building, Loader2 } from "lucide-react";
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

interface Facility {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export default function AdminFacilitiesPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-facilities"],
    queryFn: async () => {
      const res = await api.get(`/facilities`);
      return res.data.data as Facility[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/facilities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
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
          <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Fasilitas</h1>
          <p className="text-muted-foreground mt-1">Kelola data fasilitas sarana prasarana desa wisata.</p>
        </div>
        <Link href="/admin/fasilitas/tambah" className={buttonVariants({ variant: "default" }) + " bg-primary hover:bg-primary/90 text-white"}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Fasilitas
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center p-12 text-destructive">Gagal memuat data fasilitas.</div>
          ) : data?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Tidak ada fasilitas yang ditemukan.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ikon</TableHead>
                  <TableHead>Nama Fasilitas</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Building className="w-5 h-5" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {item.description || "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/fasilitas/${item.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Link>
                      
                      <AlertDialog open={deletingId === item.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" />} onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Fasilitas?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Fasilitas "{item.name}" akan dihapus secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Menghapus..." : "Hapus Fasilitas"}
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
