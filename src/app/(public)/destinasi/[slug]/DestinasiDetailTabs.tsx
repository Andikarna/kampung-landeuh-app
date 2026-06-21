"use client";

import { useState } from "react";
import { Star, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { FACILITIES_LIST } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/schemas";
import api from "@/lib/api";
import Link from "next/link";

export default function DestinasiDetailTabs({ dest, averageRating, userReview }: { dest: any, averageRating: number, userReview?: any }) {
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      destinationId: dest.id,
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewInput) => {
    if (data.rating === 0) return;
    setIsSubmitting(true);
    try {
      await api.post("/reviews", data);
      setSuccess(true);
      reset();
      setRating(0);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      alert(error.response?.data?.error || "Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
    setValue("rating", newRating);
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto scrollbar-hide">
        {['deskripsi', 'galeri', 'ulasan'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border">
        
        {activeTab === 'deskripsi' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold font-heading mb-4">Tentang Destinasi</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {dest.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading mb-4">Fasilitas Tersedia</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {dest.destinationFacilities?.map((df: any) => (
                  <div key={df.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      ✓
                    </div>
                    <span className="font-medium text-sm">{df.facility?.name}</span>
                  </div>
                ))}
                {(!dest.destinationFacilities || dest.destinationFacilities.length === 0) && (
                  <p className="text-muted-foreground col-span-3">Tidak ada fasilitas tercatat.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading mb-4">Lokasi Peta</h3>
              <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative border flex items-center justify-center">
                {/* Leaflet map placeholder */}
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium">Peta Interaktif Dimuat...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'galeri' && (
          <div className="grid grid-cols-2 gap-4">
            {dest.galleries?.map((img: any) => (
              <div key={img.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer">
                <img src={img.url} alt={img.title || "Gallery"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
            {(!dest.galleries || dest.galleries.length === 0) && (
              <p className="text-muted-foreground col-span-2">Belum ada foto galeri.</p>
            )}
          </div>
        )}

        {activeTab === 'ulasan' && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-bold font-heading">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex text-amber-400 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">Berdasarkan {dest.reviews?.length || 0} ulasan</p>
              </div>
            </div>

            {/* Review Form */}
            {user ? (
              userReview ? (
                <div className="p-4 rounded-xl border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300">Anda sudah memberikan ulasan</h4>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        {userReview.isApproved 
                          ? "Ulasan Anda sudah disetujui dan ditampilkan."
                          : "Ulasan Anda menunggu persetujuan admin."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-bold mb-4">Berikan Ulasan</h4>
                  
                  {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Ulasan berhasil dikirim dan menunggu persetujuan admin!
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                          >
                            <Star 
                              className={`w-8 h-8 cursor-pointer transition-all ${
                                star <= (hoverRating || rating) 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-2">Komentar</label>
                      <textarea
                        {...register("comment")}
                        rows={4}
                        className="w-full p-3 rounded-lg border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        placeholder="Ceritakan pengalaman Anda..."
                      />
                      {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                      ) : (
                        "Kirim Ulasan"
                      )}
                    </button>
                  </form>
                </div>
              )
            ) : (
              <div className="p-6 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-center">
                <p className="text-muted-foreground mb-4">Silakan masuk untuk memberikan ulasan</p>
                <Link href="/masuk" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Masuk Sekarang
                </Link>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {dest.reviews?.map((review: any) => (
                <div key={review.id} className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {review.user?.fullName?.charAt(0) || "A"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.user?.fullName || "Anonim"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">{review.comment}</p>
                </div>
              ))}
              {(!dest.reviews || dest.reviews.length === 0) && (
                <p className="text-muted-foreground">Belum ada ulasan untuk destinasi ini.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
