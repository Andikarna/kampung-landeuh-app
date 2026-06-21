import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-slate-950">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96 py-12">
          {children}
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block relative w-full h-full">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://picsum.photos/seed/auth-nature/2000/1500"
          alt="Nature"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-20 flex flex-col justify-end p-12">
          <h2 className="text-3xl font-bold font-heading text-white mb-2">{APP_NAME}</h2>
          <p className="text-slate-200 text-lg">Platform pintar untuk pengalaman wisata terbaik Anda.</p>
        </div>
      </div>
    </div>
  );
}
