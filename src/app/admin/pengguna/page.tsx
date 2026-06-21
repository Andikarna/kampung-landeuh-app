"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Shield, ShieldAlert, Loader2, User as UserIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get(`/users`);
      return res.data.data.map((u: any) => ({
        ...u,
        role: u.role?.name || "Wisatawan"
      })) as User[];
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      await api.put(`/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const handleRoleChange = (id: number, newRole: string) => {
    // Prevent accidentally changing own role could be added here
    if (confirm(`Apakah Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) {
      roleMutation.mutate({ id, role: newRole });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Manajemen Pengguna</h1>
        <p className="text-muted-foreground mt-1">Kelola akun, hak akses, dan profil pengguna aplikasi.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center p-12 text-destructive">Gagal memuat data pengguna.</div>
          ) : data?.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">Belum ada pengguna terdaftar.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Tanggal Mendaftar</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "dd MMM yyyy", { locale: localeId })}
                    </TableCell>
                    <TableCell>
                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                          Wisatawan
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === "Wisatawan" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleRoleChange(user.id, "Admin")}
                          disabled={roleMutation.isPending}
                        >
                          <ShieldAlert className="w-4 h-4 mr-2" /> Jadikan Admin
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRoleChange(user.id, "Wisatawan")}
                          disabled={roleMutation.isPending}
                        >
                          <UserIcon className="w-4 h-4 mr-2" /> Jadikan Wisatawan
                        </Button>
                      )}
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
