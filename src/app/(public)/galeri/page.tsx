import prisma from "@/lib/prisma";

export const metadata = {
  title: "Galeri - Kampung Landeuh",
  description: "Kumpulan momen dan pemandangan menakjubkan dari Kampung Landeuh.",
};

export default async function GalleryPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: [
      { isFeatured: "desc" },
      { sortOrder: "asc" },
      { createdAt: "desc" }
    ]
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-16">
      <div className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Galeri Dokumentasi</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Tangkap keindahan setiap sudut desa, pesona alam, serta kemeriahan festival yang tak terlupakan di Kampung Landeuh.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {galleries.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">Galeri Masih Kosong</h3>
            <p className="text-muted-foreground">Belum ada foto atau video yang diunggah ke dalam galeri.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {galleries.map((item) => (
              <div 
                key={item.id} 
                className="break-inside-avoid group relative overflow-hidden rounded-xl border bg-white dark:bg-slate-800 shadow-sm"
              >
                <img 
                  src={item.mediaUrl} 
                  alt={item.title || "Galeri Kampung Landeuh"} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">
                    {item.title || "Pesona Kampung Landeuh"}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
