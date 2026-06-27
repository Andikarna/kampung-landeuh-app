export const APP_NAME = "Kampung Edu Wisata Landeuh";
export const APP_DESCRIPTION = "Platform wisata digital Kampung Edu Wisata Landeuh - Wisata edukasi, spiritual, dan budaya berbasis komunitas Baduy mualaf di Kabupaten Lebak, Banten";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/destinasi", label: "Destinasi" },
  { href: "/event", label: "Event" },
  { href: "/fasilitas", label: "Fasilitas" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/destinasi", label: "Destinasi", icon: "MapPin" },
  { href: "/admin/kategori", label: "Kategori Wisata", icon: "Tag" },
  { href: "/admin/event", label: "Event", icon: "Calendar" },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: "Building" },
  { href: "/admin/galeri", label: "Galeri", icon: "Image" },
  { href: "/admin/reservasi", label: "Reservasi", icon: "BookOpen" },
  { href: "/admin/ulasan", label: "Ulasan", icon: "Star" },
  { href: "/admin/pengguna", label: "Pengguna", icon: "Users" },
  { href: "/admin/kontak", label: "Pesan Kontak", icon: "Mail" },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: "Settings" },
] as const;

export const DESTINATION_CATEGORIES = [
  { name: "Wisata Alam", slug: "wisata-alam", icon: "🌿" },
  { name: "Wisata Budaya", slug: "wisata-budaya", icon: "🎭" },
  { name: "Wisata Edukasi", slug: "wisata-edukasi", icon: "📚" },
  { name: "Wisata Kuliner", slug: "wisata-kuliner", icon: "🍜" },
  { name: "Agrowisata", slug: "agrowisata", icon: "🌾" },
  { name: "Wisata Religi", slug: "wisata-religi", icon: "🕌" },
  { name: "Ekowisata", slug: "ekowisata", icon: "🌍" },
] as const;

export const FACILITIES_LIST = [
  { name: "Area Parkir", icon: "Car" },
  { name: "Mushola", icon: "Moon" },
  { name: "Toilet", icon: "Bath" },
  { name: "Food Court", icon: "UtensilsCrossed" },
  { name: "Toko Oleh-oleh", icon: "ShoppingBag" },
  { name: "Homestay", icon: "Home" },
  { name: "Pusat Informasi", icon: "Info" },
] as const;

export const BOOKING_STATUSES = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  cancelled: "Dibatalkan",
  completed: "Selesai",
} as const;

export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/6281234567890",
  instagram: "https://instagram.com/kampunglandeuh",
  facebook: "https://facebook.com/kampunglandeuh",
  email: "info@kampunglandeuh.id",
  address: "Jl. Raya Ciboleger, Bojong Menteng, Kec. Leuwidamar, Kabupaten Lebak, Banten 42362",
  phone: "+62 812-3456-7890",
  mapsUrl: "https://www.google.com/maps/place/Kampung+Edu+Wisata+Landeuh/@-6.574834,106.197937,17z",
  mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5778979695683!2d106.197937!3d-6.574834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e42693435733a57%3A0xa4db0a15fa983216!2sKampung%20Edu%20Wisata%20Landeuh!5e0!3m2!1sid!2sid!4v1782534637596!5m2!1sid!2sid",
};
