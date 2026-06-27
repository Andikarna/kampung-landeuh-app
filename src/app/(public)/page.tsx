"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Star, Users, Mountain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/destinations")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          // Take top 3
          setDestinations(res.data.slice(0, 3));
        }
      });
  }, []);
  return (
    <div className="relative w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900 z-10" />
          <img 
          src="https://picsum.photos/seed/landeuh-hero/2000/1200" 
          alt="Kampung Landeuh" 
          className="w-full h-full object-cover"
        />
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Kampung Edu Wisata di Kabupaten Lebak, Banten</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight font-heading">
              Eksplorasi Keajaiban <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">
                Kampung Landeuh
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto">
              Wisata edukasi, spiritual, dan budaya di Desa Bojong Menteng, Kecamatan Leuwidamar, Kabupaten Lebak, Banten. Rasakan pengalaman unik bersama komunitas Baduy mualaf dalam lingkungan pedesaan yang asri dan bermakna.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/destinasi" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                Jelajahi Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/reservasi" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-medium transition-all flex items-center justify-center">
                Reservasi Tiket
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Destinasi Wisata", value: "15+", icon: Mountain },
              { label: "Pengunjung Tahunan", value: "50k+", icon: Users },
              { label: "Event Tahunan", value: "24", icon: Calendar },
              { label: "Ulasan Positif", value: "4.9", icon: Star },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-2 p-6 rounded-2xl bg-muted/50 border hover:border-primary/50 transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary mb-2">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold font-heading">{stat.value}</h3>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" />
                Kab. Lebak, Banten
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Tentang Kampung Edu Wisata Landeuh
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Kampung Edu Wisata Landeuh adalah sebuah kampung yang terletak di Desa Bojong Menteng, Kecamatan Leuwidamar, Kabupaten Lebak, Banten. Kampung ini dihuni oleh warga Baduy yang telah menganut agama Islam (mualaf) dan difasilitasi oleh Yayasan At Taubah 60.
                </p>
                <p>
                  Yayasan At Taubah 60 yang berbasis di BSD Tangerang membangun 45 rumah untuk 27 Kartu Keluarga di lahan seluas lima hektar. Kampung ini telah berdiri selama enam tahun dan kini berkembang menjadi destinasi wisata edukasi, spiritual, dan budaya yang unik.
                </p>
                <p>
                  Dengan konsep wisata berbasis masyarakat, setiap kunjungan berkontribusi langsung pada peningkatan kesejahteraan warga Baduy mualaf dan pelestarian budaya lokal yang autentik.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
                  <p className="text-xs text-muted-foreground mb-1">Lokasi</p>
                  <p className="font-semibold text-sm">Kab. Lebak, Banten</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
                  <p className="text-xs text-muted-foreground mb-1">Jam Operasional</p>
                  <p className="font-semibold text-sm">07.00 – 17.00 WIB</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
                  <p className="text-xs text-muted-foreground mb-1">Jenis Wisata</p>
                  <p className="font-semibold text-sm">Edukasi, Spiritual & Budaya</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
                  <p className="text-xs text-muted-foreground mb-1">Cocok Untuk</p>
                  <p className="font-semibold text-sm">Keluarga & Pelajar</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://picsum.photos/seed/landeuh-about/1200/900"
                  alt="Kampung Edu Wisata Landeuh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xl border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">4.8 / 5</p>
                    <p className="text-xs text-muted-foreground">Rating Pengunjung</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Destinasi Favorit</h2>
              <p className="text-muted-foreground">Pilihan destinasi terbaik yang wajib Anda kunjungi saat berada di Kampung Landeuh.</p>
            </div>
            <Link href="/destinasi" className="hidden md:flex items-center gap-2 text-primary hover:underline font-medium">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-background border shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={dest.coverImage || "https://picsum.photos/seed/placeholder-dest/1000/800"} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-slate-800">
                    {dest.category?.name || "Lainnya"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" /> Kampung Landeuh
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <span className="font-semibold text-primary">{Number(dest.ticketPrice) === 0 ? "Gratis" : formatCurrency(Number(dest.ticketPrice))}</span>
                    <Link href={`/destinasi/${dest.slug}`} className="text-sm font-medium hover:underline">
                      Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/destinasi" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
              Lihat Semua Destinasi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
