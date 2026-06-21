"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      await login(data.email, data.password);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal masuk. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight">Selamat Datang</h2>
        <p className="text-muted-foreground mt-2">Masuk ke akun Anda untuk melanjutkan</p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="contoh@email.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link href="/lupa-password" className="text-xs text-primary hover:underline font-medium">
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Masuk
        </button>
      </form>

      <div className="text-center text-sm">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-primary hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
