"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MapPin, Calendar, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data.data;
    },
  });

  const filteredData = data?.filter((e: any) => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setDeletingId(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Event</h1>
          <p className="text-muted-foreground mt-1">Kelola agenda acara dan festival lokal.</p>
        </div>
        <Link href="/admin/event/tambah" className={buttonVariants({ variant: "default" }) + " bg-primary hover:bg-primary/90 text-white"}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Event
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul event atau lokasi..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center p-12 text-destructive">Gagal memuat data event.</div>
          ) : filteredData?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Tidak ada event ditemukan.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Event</TableHead>
                  <TableHead>Tanggal Pelaksanaan</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {new Date(item.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-3 h-3 mr-1.5" />
                        {item.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {item.status === 'active' ? 'Aktif' : 'Selesai'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/event/${item.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Link>
                      
                      <AlertDialog open={deletingId === item.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" />} onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Event?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini akan menghapus event "{item.title}" secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Menghapus..." : "Hapus Event"}
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
