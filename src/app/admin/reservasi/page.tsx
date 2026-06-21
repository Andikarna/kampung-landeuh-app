"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Search, Loader2, FileText, CheckCircle2, Clock, XCircle, Eye, Check, X, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

const STATUS_MAP: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings");
      return res.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/bookings/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  const filteredData = data?.filter((b: any) => 
    b.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.destination.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "confirmed":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3.5 h-3.5" /> {STATUS_MAP[status] || status}</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> {STATUS_MAP[status] || status}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3.5 h-3.5" /> {STATUS_MAP[status] || status}</span>;
    }
  };

  const handleAction = (booking: any, action: string) => {
    setSelectedBooking(booking);
    setActionType(action);
    setIsDetailOpen(false);
  };

  const confirmAction = () => {
    if (selectedBooking && actionType) {
      updateStatusMutation.mutate({
        id: selectedBooking.id,
        status: actionType,
      });
    }
    setSelectedBooking(null);
    setActionType(null);
  };

  const closeActionDialog = () => {
    setSelectedBooking(null);
    setActionType(null);
  };

  const getActionButtonLabel = () => {
    switch (actionType) {
      case "confirmed":
        return { title: "Konfirmasi Reservasi", description: "Apakah Anda yakin ingin mengkonfirmasi reservasi ini?", button: "Konfirmasi", variant: "default" as const };
      case "cancelled":
        return { title: "Batalkan Reservasi", description: "Apakah Anda yakin ingin membatalkan reservasi ini?", button: "Batalkan", variant: "destructive" as const };
      case "completed":
        return { title: "Selesaikan Reservasi", description: "Apakah Anda yakin ingin menandai reservasi ini sebagai selesai?", button: "Selesaikan", variant: "default" as const };
      default:
        return { title: "", description: "", button: "", variant: "default" as const };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Daftar Reservasi</h1>
        <p className="text-muted-foreground mt-1">Pantau tiket wisata yang dipesan oleh pengunjung.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari kode tiket, nama, atau wisata..."
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
            <div className="text-center p-12 text-destructive">Gagal memuat data reservasi.</div>
          ) : filteredData?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Tidak ada reservasi ditemukan.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Tiket</TableHead>
                  <TableHead>Pemesan</TableHead>
                  <TableHead>Wisata</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jumlah Orang</TableHead>
                  <TableHead>Total Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono font-medium text-primary">
                      {item.bookingNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.user.fullName}</div>
                      <div className="text-xs text-muted-foreground">{item.user.phone || item.user.email}</div>
                    </TableCell>
                    <TableCell className="font-medium">{item.destination.name}</TableCell>
                    <TableCell>{new Date(item.visitDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                    <TableCell>{item.numberOfVisitors} Orang</TableCell>
                    <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(item);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Detail
                        </Button>
                        
                        {item.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleAction(item, "confirmed")}
                            >
                              <Check className="w-4 h-4 mr-1.5" />
                              Konfirmasi
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleAction(item, "cancelled")}
                            >
                              <X className="w-4 h-4 mr-1.5" />
                              Batalkan
                            </Button>
                          </>
                        )}
                        
                        {item.status === "confirmed" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleAction(item, "completed")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Selesai
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Reservasi</DialogTitle>
            <DialogDescription>
              Kode Reservasi: <span className="font-mono font-medium">{selectedBooking.bookingNumber}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Pemesan</p>
                <p className="font-medium">{selectedBooking.user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedBooking.user.email}</p>
              </div>
              {selectedBooking.user.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{selectedBooking.user.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Wisata</p>
                <p className="font-medium">{selectedBooking.destination.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Kunjungan</p>
                <p className="font-medium">
                  {new Date(selectedBooking.visitDate).toLocaleDateString("id-ID", { 
                  weekday: "long", day: "numeric", month: "long", year: "numeric" 
                })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Pengunjung</p>
                <p className="font-medium">{selectedBooking.numberOfVisitors} Orang</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Harga</p>
                <p className="font-medium text-lg">{formatCurrency(selectedBooking.totalPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(selectedBooking.status)}
              </div>
            </div>
            {selectedBooking.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Catatan</p>
                <p className="font-medium">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedBooking.status === "pending" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    handleAction(selectedBooking, "confirmed");
                    setIsDetailOpen(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Konfirmasi
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleAction(selectedBooking, "cancelled");
                    setIsDetailOpen(false);
                  }}
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Batalkan
                </Button>
              </>
            )}
            {selectedBooking.status === "confirmed" && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  handleAction(selectedBooking, "completed");
                  setIsDetailOpen(false);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Selesai
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
        )}
      </Dialog>

      <AlertDialog open={!!selectedBooking && !!actionType} onOpenChange={closeActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionButtonLabel().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionButtonLabel().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStatusMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={updateStatusMutation.isPending}
              variant={getActionButtonLabel().variant}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {getActionButtonLabel().button}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
