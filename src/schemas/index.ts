import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama minimal 3 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(val),
        "Format nomor telepon tidak valid"
      ),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subjek wajib diisi"),
  message: z.string().min(1, "Pesan wajib diisi").min(10, "Pesan minimal 10 karakter"),
});

export const bookingSchema = z.object({
  destinationId: z.number().min(1, "Pilih destinasi"),
  visitDate: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  endDate: z.string().optional(),
  numberOfVisitors: z
    .number()
    .min(1, "Minimal 1 pengunjung")
    .max(100, "Maksimal 100 pengunjung"),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  destinationId: z.number().min(1, "Pilih destinasi"),
  rating: z.number().min(1, "Rating wajib diisi").max(5, "Rating maksimal 5"),
  comment: z.string().min(1, "Komentar wajib diisi").min(10, "Komentar minimal 10 karakter"),
});

export const destinationSchema = z.object({
  name: z.string().min(1, "Nama destinasi wajib diisi"),
  categoryId: z.number().min(1, "Kategori wajib dipilih"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  ticketPrice: z.number().min(0, "Harga tiket tidak valid"),
  openingHours: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.string().default("active"),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Judul event wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  eventDate: z.string().min(1, "Tanggal event wajib diisi"),
  eventTime: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(1, "Lokasi wajib diisi"),
  bannerUrl: z.string().optional(),
  status: z.string().default("upcoming"),
});

export const facilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi"),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type FacilityInput = z.infer<typeof facilitySchema>;
