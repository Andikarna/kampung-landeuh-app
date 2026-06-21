"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Trash2, CheckCircle, XCircle, Star, Loader2 } from "lucide-react";
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

interface Review {
  id: number;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: { fullName: string; email: string };
  destination: { name: string };
}

export default function AdminReviewPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await api.get(`/reviews`);
      return res.data.data as Review[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setDeletingId(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: number; isApproved: boolean }) => {
      await api.put(`/reviews/${id}`, { isApproved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleStatus = (id: number, isApproved: boolean) => {
    statusMutation.mutate({ id, isApproved });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Moderasi Ulasan</h1>
        <p className="text-muted-foreground mt-1">Kelola rating dan komentar pengunjung terhadap destinasi wisata.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center p-12 text-destructive">Gagal memuat data ulasan.</div>
          ) : data?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Belum ada ulasan yang masuk.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengunjung</TableHead>
                  <TableHead>Destinasi</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Komentar</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.user?.fullName}</div>
                      <div className="text-xs text-muted-foreground">{item.user?.email}</div>
                    </TableCell>
                    <TableCell className="font-medium">{item.destination?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.comment}>
                      {item.comment}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(item.createdAt), "dd MMM yyyy", { locale: localeId })}
                    </TableCell>
                    <TableCell>
                      {item.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Disetujui
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Menunggu
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {!item.isApproved && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleStatus(item.id, true)}
                          title="Setujui"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {item.isApproved && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => handleStatus(item.id, false)}
                          title="Batal Setujui"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <AlertDialog open={deletingId === item.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" />} onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Ulasan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Komentar dan rating ini akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Menghapus..." : "Hapus Ulasan"}
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
