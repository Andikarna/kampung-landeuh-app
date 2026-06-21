"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/masuk");
    } else if (user) {
      reset({
        fullName: user.fullName,
        phone: user.phone || "",
      });
    }
  }, [user, loading, router, reset]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const onSubmit = async (data: ProfileInput) => {
    try {
      setSuccess(false);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading tracking-tight mb-2">Profil Saya</h1>
          <p className="text-muted-foreground">Kelola informasi pribadi dan pengaturan akun Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-sm border">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user.fullName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{user.fullName}</h2>
              <p className="text-muted-foreground text-sm mb-4">{user.role?.name || "Tourist"}</p>
              
              <div className="inline-flex px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                Akun Aktif
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-primary/10 text-primary rounded-xl transition-colors">
                <User className="w-5 h-5" /> Informasi Pribadi
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" /> Keluar Akun
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold font-heading">Informasi Pribadi</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit Profil
                  </button>
                )}
              </div>

              <div className="p-6">
                {success && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
                    Profil berhasil diperbarui.
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            {...register("fullName")}
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <div className="relative opacity-60 cursor-not-allowed">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-slate-50 outline-none"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            {...register("phone")}
                            type="tel"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          reset();
                        }}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Nama Lengkap</p>
                        <p className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" /> {user.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" /> {user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Nomor Telepon</p>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" /> {user.phone || "Belum diatur"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bergabung Sejak</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" /> 21 Juni 2026
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
