"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, ArrowRight, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Destination {
  id: number;
  name: string;
  slug: string;
  category: { name: string };
  coverImage: string;
  ticketPrice: number;
  averageRating: number;
  totalReviews: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const { data: destinations = [], isLoading: loadingDest } = useQuery({
    queryKey: ["public-destinations-list"],
    queryFn: async () => {
      const res = await api.get("/destinations");
      return res.data.data as Destination[];
    },
  });

  const { data: categories = [], isLoading: loadingCat } = useQuery({
    queryKey: ["destination-categories"],
    queryFn: async () => {
      const res = await api.get("/destination-categories");
      return res.data.data as Category[];
    },
  });

  const loading = loadingDest || loadingCat;

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || dest.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-16">
      {/* Page Header */}
      <div className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Destinasi Wisata</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Jelajahi keindahan alam, budaya, dan berbagai atraksi menarik di Kampung Landeuh. Temukan pengalaman tak terlupakan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-background p-4 rounded-xl shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari destinasi wisata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("Semua")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeCategory === "Semua"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeCategory === cat.name
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group flex flex-col bg-background rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={dest.coverImage || "https://picsum.photos/seed/dest-list/1000/800"} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-slate-800 shadow-sm">
                    {dest.category?.name || "Lainnya"}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{dest.averageRating}</span>
                    <span className="text-white/80">({dest.totalReviews} ulasan)</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-primary" /> Kampung Landeuh
                  </div>
                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">Mulai dari</span>
                      <span className="font-bold text-primary text-lg">
                        {Number(dest.ticketPrice) === 0 ? "Gratis" : formatCurrency(Number(dest.ticketPrice))}
                      </span>
                    </div>
                    <Link
                      href={`/destinasi/${dest.slug}`}
                      className="inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors p-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-20 bg-background rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">Destinasi Tidak Ditemukan</h3>
            <p className="text-muted-foreground">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("Semua"); }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
