import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Event & Festival - Kampung Landeuh",
  description: "Daftar acara, festival, dan kegiatan menarik di Kampung Landeuh Smart Tourism.",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      status: "upcoming"
    },
    orderBy: {
      eventDate: "asc"
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-16">
      {/* Page Header */}
      <div className="bg-primary text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Event & Festival</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Jangan lewatkan berbagai perayaan budaya, festival kuliner, dan acara spesial yang akan datang di Kampung Landeuh.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">Belum Ada Event Mendatang</h3>
            <p className="text-muted-foreground">Saat ini belum ada event atau festival yang dijadwalkan. Silakan cek kembali nanti!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event) => (
              <div 
                key={event.id}
                className="group flex flex-col sm:flex-row bg-background rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative sm:w-2/5 h-64 sm:h-auto overflow-hidden shrink-0">
                  <img 
                    src={event.bannerUrl || "https://picsum.photos/seed/event-placeholder/1000/800"} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white font-bold px-3 py-2 rounded-lg text-center shadow-sm">
                    <div className="text-2xl leading-none">{format(event.eventDate, "dd", { locale: id })}</div>
                    <div className="text-xs uppercase mt-1">{format(event.eventDate, "MMM yyyy", { locale: id })}</div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 text-primary font-medium text-sm">
                    <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">Event Mendatang</span>
                  </div>
                  
                  <h3 className="text-xl font-bold font-heading mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mt-auto pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{event.eventTime ? event.eventTime : "Sepanjang hari"}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
