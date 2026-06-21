"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal mendaftar. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight">Daftar Akun</h2>
        <p className="text-muted-foreground mt-2">Buat akun untuk melakukan reservasi dan memberi ulasan</p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lengkap</label>
          <input
            {...register("fullName")}
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="contoh@email.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nomor WhatsApp (Opsional)</label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="081234567890"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Konfirmasi Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Daftar
        </button>
      </form>

      <div className="text-center text-sm mt-4">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-primary hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
