# Panduan Seeding Data Dummy

Script ini akan mengisi database dengan data dummy untuk semua fitur aplikasi Kampung Wisata Landeuh.

## Data yang Akan Dibuat

### 1. Roles & Users
- **Admin**: `admin@kampunglandeuh.id` / `Admin123!`
- **3 User Turis**:
  - `aji@example.com` / `User123!`
  - `siti@example.com` / `User123!`
  - `budi@example.com` / `User123!`

### 2. Destinations & Categories
- 3 Kategori Wisata
- 5 Destinasi Wisata (Curug Cipendok, Kampung Wisata Landeuh, Taman Edukasi Alam, Puncak Gunung Slamet, Museum Budaya Banyumas)
- 6 Fasilitas
- 15 Gambar Gallery

### 3. Events
- 3 Event Upcoming

### 4. Bookings
- 8 Reservasi dengan berbagai status (pending, confirmed, completed, cancelled)

### 5. Reviews
- 6 Ulasan yang sudah disetujui

### 6. Articles
- 3 Artikel Blog yang sudah dipublikasikan

### 7. Contacts
- 3 Pesan Kontak

### 8. Notifications
- 2 Notifikasi untuk setiap user

## Cara Menjalankan Seed

### Prasyarat
Pastikan:
1. Database sudah berjalan
2. Schema sudah di-push: `npx prisma db push`
3. Dependencies sudah diinstall: `npm install`

### Menjalankan Seed

#### Seed Sederhana (Seperti Semula)
```bash
npm run db:seed
```

#### Seed Lengkap (Semua Fitur)
```bash
npm run db:seed-full
```

### Melihat Data di Database
Buka Prisma Studio untuk melihat data:
```bash
npm run db:studio
```

## Catatan Penting

1. Seed menggunakan `upsert` untuk menghindari duplikat
2. Gambar menggunakan Unsplash URL (real images)
3. Semua password di-hash dengan bcrypt
4. Tanggal visit ada di masa lalu dan masa depan

## Reset Database
Jika ingin menghapus semua data dan mengulang:
```bash
npx prisma db push --force-reset
npm run db:seed-full
```
