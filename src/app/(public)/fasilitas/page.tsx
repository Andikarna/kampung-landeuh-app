import prisma from "@/lib/prisma";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Fasilitas - Kampung Landeuh",
  description: "Fasilitas penunjang kenyamanan wisata di Kampung Landeuh.",
};

export default async function FasilitasPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-16">
      <div className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Fasilitas Desa Wisata</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Kami menyediakan berbagai fasilitas memadai untuk menunjang kenyamanan dan kepuasan pengunjung selama berwisata di Kampung Landeuh.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {facilities.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">Data Fasilitas Kosong</h3>
            <p className="text-muted-foreground">Informasi fasilitas belum ditambahkan ke dalam sistem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {facilities.map((fac) => (
              <div 
                key={fac.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  {/* We would ideally render dynamic lucide icons based on fac.icon string, but for simplicity we use a checkmark or placeholder */}
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">{fac.name}</h3>
                {fac.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {fac.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
