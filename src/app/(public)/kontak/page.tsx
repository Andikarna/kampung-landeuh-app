"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/schemas";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function KontakPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      setServerError(null);
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal mengirim pesan");
      }

      setSuccess(true);
      reset();
      
      // Sembunyikan notifikasi sukses setelah 5 detik
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      setServerError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-16">
      <div className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Hubungi Kami</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Punya pertanyaan, saran, atau ingin merencanakan kunjungan berkelompok? Tim Kampung Landeuh siap membantu Anda.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border">
              <h3 className="text-2xl font-bold font-heading mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Alamat</h4>
                    <p className="text-sm text-muted-foreground">Jl. Raya Ciboleger, Bojong Menteng, Kec. Leuwidamar, Kabupaten Lebak, Banten 42362</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Telepon / WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">+62 812 3456 7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground">info@kampunglandeuh.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Jam Operasional</h4>
                    <p className="text-sm text-muted-foreground">Setiap Hari: 08.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Maps Embed */}
            <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5778979695683!2d106.197937!3d-6.574834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e42693435733a57%3A0xa4db0a15fa983216!2sKampung%20Edu%20Wisata%20Landeuh!5e0!3m2!1sid!2sid!4v1782534637596!5m2!1sid!2sid"
                width="100%"
                height="256"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kampung Edu Wisata Landeuh"
              />
              <div className="p-3 flex items-center justify-between bg-white dark:bg-slate-900 border-t">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Kampung Edu Wisata Landeuh</span>
                </div>
                <a
                  href="https://www.google.com/maps/place/Kampung+Edu+Wisata+Landeuh/@-6.574834,106.197937,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border">
              <h3 className="text-2xl font-bold font-heading mb-6">Kirim Pesan</h3>
              
              {success && (
                <div className="mb-6 bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Pesan Terkirim!</h4>
                    <p className="text-sm">Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
                  </div>
                </div>
              )}

              {serverError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="Masukkan nama Anda"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nomor Telepon (Opsional)</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="Contoh: 08123456789"
                      {...register("phone")}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-medium">Alamat Email</label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="email@contoh.com"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-medium">Subjek</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="Perihal pesan"
                      {...register("subject")}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pesan Anda</label>
                  <textarea
                    rows={5}
                    className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                    placeholder="Tulis pesan, saran, atau pertanyaan Anda di sini..."
                    {...register("message")}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
