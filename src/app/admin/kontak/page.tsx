"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Trash2, CheckCircle2, Circle, Mail, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await api.get(`/contacts`);
      return res.data.data as Contact[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      setDeletingId(null);
    },
  });

  const readMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: number; isRead: boolean }) => {
      await api.put(`/contacts/${id}`, { isRead });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const toggleRead = (id: number, currentReadStatus: boolean) => {
    readMutation.mutate({ id, isRead: !currentReadStatus });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Pesan Kontak</h1>
        <p className="text-muted-foreground mt-1">Kelola pesan dan pertanyaan dari pengunjung publik.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center p-12 text-destructive">Gagal memuat data pesan kontak.</div>
          ) : data?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Tidak ada pesan di kotak masuk.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Pengirim</TableHead>
                  <TableHead>Subjek & Pesan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id} className={item.isRead ? "bg-transparent" : "bg-primary/5 dark:bg-primary/10"}>
                    <TableCell>
                      <button 
                        onClick={() => toggleRead(item.id, item.isRead)}
                        className="focus:outline-none"
                        title={item.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                      >
                        {item.isRead ? (
                          <CheckCircle2 className="w-5 h-5 text-slate-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-primary fill-primary/20" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${!item.isRead && "text-slate-900 dark:text-white"}`}>{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                      {item.phone && <div className="text-xs text-muted-foreground">{item.phone}</div>}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className={`font-semibold text-sm ${!item.isRead && "text-slate-900 dark:text-white"}`}>
                        {item.subject}
                      </div>
                      <div className="text-sm text-muted-foreground truncate" title={item.message}>
                        {item.message}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(item.createdAt), "dd MMM yyyy", { locale: localeId })}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog open={deletingId === item.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" />} onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Pesan dari {item.name} akan dihapus secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Menghapus..." : "Hapus Pesan"}
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
