export const APP_NAME = "Kampung Landeuh Smart Tourism";
export const APP_DESCRIPTION = "Platform wisata digital Kampung Landeuh - Temukan destinasi wisata, event budaya, dan pengalaman alam terbaik";
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
  { href: "/admin/event", label: "Event", icon: "Calendar" },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: "Building" },
  { href: "/admin/galeri", label: "Galeri", icon: "Image" },
  { href: "/admin/reservasi", label: "Reservasi", icon: "BookOpen" },
  { href: "/admin/ulasan", label: "Ulasan", icon: "Star" },
  { href: "/admin/pengguna", label: "Pengguna", icon: "Users" },
  { href: "/admin/kontak", label: "Pesan Kontak", icon: "Mail" },
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
  address: "Kampung Landeuh, Kabupaten Sukabumi, Jawa Barat, Indonesia",
  phone: "+62 812-3456-7890",
};
