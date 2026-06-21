const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding full data...')
  
  // Cleanup existing data
  console.log('Cleaning up existing data...')
  await prisma.notification.deleteMany({})
  await prisma.contact.deleteMany({})
  await prisma.article.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.booking.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.gallery.deleteMany({})
  await prisma.destinationFacility.deleteMany({})
  await prisma.destination.deleteMany({})
  await prisma.facility.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.role.deleteMany({})
  await prisma.destinationCategory.deleteMany({})
  console.log('Data cleanup completed.')

  // ==================== ROLES ====================
  console.log('Seeding roles...')
  const adminRole = await prisma.role.create({
    data: { name: 'Admin' },
  })

  const touristRole = await prisma.role.create({
    data: { name: 'Tourist' },
  })

  // ==================== USERS ====================
  console.log('Seeding users...')
  const passwordHash = await bcrypt.hash('Admin123!', 10)
  const userPasswordHash = await bcrypt.hash('User123!', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@kampunglandeuh.id',
      fullName: 'Super Admin',
      phone: '081234567890',
      passwordHash,
      roleId: adminRole.id,
    },
  })

  const users = [
    { email: 'aji@example.com', fullName: 'Aji Permana', phone: '085678901234' },
    { email: 'siti@example.com', fullName: 'Siti Nurhaliza', phone: '087890123456' },
    { email: 'budi@example.com', fullName: 'Budi Santoso', phone: '089012345678' },
  ]

  const createdUsers = []
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash: userPasswordHash,
        roleId: touristRole.id,
      },
    })
    createdUsers.push(user)
  }

  // ==================== DESTINATION CATEGORIES ====================
  console.log('Seeding categories...')
  const categories = [
    { name: 'Wisata Alam', slug: 'wisata-alam', icon: '🌿' },
    { name: 'Wisata Budaya', slug: 'wisata-budaya', icon: '🎭' },
    { name: 'Wisata Edukasi', slug: 'wisata-edukasi', icon: '📚' },
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.destinationCategory.create({
      data: cat,
    })
    createdCategories.push(category)
  }

  // ==================== FACILITIES ====================
  console.log('Seeding facilities...')
  const facilities = [
    { name: 'Area Parkir', icon: 'Car' },
    { name: 'Toilet', icon: 'Bath' },
    { name: 'Mushola', icon: 'Moon' },
    { name: 'Food Court', icon: 'UtensilsCrossed' },
    { name: 'Wifi', icon: 'Wifi' },
    { name: 'Tempat Duduk', icon: 'Chair' },
  ]

  // Delete existing facilities first (for consistency)
  await prisma.destinationFacility.deleteMany({})
  await prisma.facility.deleteMany({})

  const createdFacilities = []
  for (const fac of facilities) {
    const facility = await prisma.facility.create({
      data: fac,
    })
    createdFacilities.push(facility)
  }

  // ==================== DESTINATIONS ====================
  console.log('Seeding destinations...')
  const destinations = [
    {
      name: 'Curug Cipendok',
      slug: 'curug-cipendok',
      categoryId: createdCategories[0].id,
      description: 'Curug Cipendok adalah air terjun indah di kawasan Banyumas dengan ketinggian sekitar 92 meter. Dikelilingi oleh pepohonan hijau yang rindang, menjadikannya tempat yang sempurna untuk bersantai dan menikmati keindahan alam.',
      location: 'Kabupaten Banyumas, Jawa Tengah',
      ticketPrice: 15000,
      openingHours: '08:00 - 17:00',
      coverImage: 'https://picsum.photos/seed/curug-cipendok/800/600',
      viewCount: 1250,
      averageRating: 4.5,
      totalReviews: 8,
    },
    {
      name: 'Kampung Wisata Landeuh',
      slug: 'kampung-wisata-landeuh',
      categoryId: createdCategories[1].id,
      description: 'Kampung Wisata Landeuh menawarkan pengalaman wisata budaya dengan nuansa pedesaan yang asri. Pengunjung dapat belajar tentang budaya lokal, mencoba makanan tradisional, dan menikmati keindahan sawah.',
      location: 'Kabupaten Banyumas, Jawa Tengah',
      ticketPrice: 10000,
      openingHours: '07:00 - 18:00',
      coverImage: 'https://picsum.photos/seed/kampung-landeuh/800/600',
      viewCount: 2340,
      averageRating: 4.8,
      totalReviews: 15,
    },
    {
      name: 'Taman Edukasi Alam',
      slug: 'taman-edukasi-alam',
      categoryId: createdCategories[2].id,
      description: 'Taman Edukasi Alam adalah tempat wisata yang cocok untuk anak-anak dan keluarga. Menawarkan berbagai fasilitas edukasi tentang alam dan lingkungan.',
      location: 'Kabupaten Banyumas, Jawa Tengah',
      ticketPrice: 20000,
      openingHours: '09:00 - 16:00',
      coverImage: 'https://picsum.photos/seed/taman-edukasi/800/600',
      viewCount: 980,
      averageRating: 4.3,
      totalReviews: 6,
    },
    {
      name: 'Puncak Gunung Slamet',
      slug: 'puncak-gunung-slamet',
      categoryId: createdCategories[0].id,
      description: 'Gunung Slamet adalah gunung tertinggi di Jawa Tengah dengan ketinggian 3.428 mdpl. Menawarkan pemandangan sunrise yang spektakuler.',
      location: 'Kabupaten Banyumas, Jawa Tengah',
      ticketPrice: 25000,
      openingHours: '24 Jam',
      coverImage: 'https://picsum.photos/seed/puncak-slamet/800/600',
      viewCount: 3100,
      averageRating: 4.9,
      totalReviews: 22,
    },
    {
      name: 'Museum Budaya Banyumas',
      slug: 'museum-budaya-banyumas',
      categoryId: createdCategories[1].id,
      description: 'Museum yang menampilkan berbagai koleksi budaya dan sejarah Kabupaten Banyumas dari masa ke masa.',
      location: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah',
      ticketPrice: 5000,
      openingHours: '08:00 - 15:00',
      coverImage: 'https://picsum.photos/seed/museum-budaya/800/600',
      viewCount: 760,
      averageRating: 4.2,
      totalReviews: 5,
    },
  ]

  const createdDestinations = []
  for (const dest of destinations) {
    const destination = await prisma.destination.create({
      data: dest,
    })
    createdDestinations.push(destination)
  }

  // ==================== DESTINATION FACILITIES ====================
  console.log('Seeding destination facilities...')
  for (let i = 0; i < createdDestinations.length; i++) {
    const dest = createdDestinations[i]
    const facilityCount = Math.floor(Math.random() * 3) + 2
    const selectedFacilities = createdFacilities.slice(0, facilityCount)
    
    for (const fac of selectedFacilities) {
      await prisma.destinationFacility.upsert({
        where: { 
          destinationId_facilityId: { 
            destinationId: dest.id, 
            facilityId: fac.id 
          } 
        },
        update: {},
        create: {
          destinationId: dest.id,
          facilityId: fac.id,
        },
      })
    }
  }

  // ==================== GALLERY ====================
  console.log('Seeding galleries...')
  const galleryImages = [
    'https://picsum.photos/seed/gallery1/800/600',
    'https://picsum.photos/seed/gallery2/800/600',
    'https://picsum.photos/seed/gallery3/800/600',
    'https://picsum.photos/seed/gallery4/800/600',
  ]

  for (const dest of createdDestinations) {
    for (let i = 0; i < 3; i++) {
      await prisma.gallery.create({
        data: {
          destinationId: dest.id,
          title: `${dest.name} - View ${i + 1}`,
          mediaUrl: galleryImages[i % galleryImages.length],
          mediaType: 'photo',
          sortOrder: i,
          isFeatured: i === 0,
        },
      })
    }
  }

  // ==================== EVENTS ====================
  console.log('Seeding events...')
  const events = [
    {
      title: 'Festival Budaya Landeuh',
      slug: 'festival-budaya-landeuh',
      description: 'Festival tahunan yang menampilkan berbagai kesenian dan budaya lokal Banyumas.',
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      eventTime: '19:00',
      location: 'Kampung Wisata Landeuh',
      bannerUrl: 'https://picsum.photos/seed/festival-budaya/800/600',
      status: 'upcoming',
    },
    {
      title: 'Lomba Mendaki Gunung Slamet',
      slug: 'lomba-mendaki-gunung-slamet',
      description: 'Lomba mendaki yang diadakan setiap tahun untuk memperingati hari jadi Kabupaten Banyumas.',
      eventDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      eventTime: '06:00',
      location: 'Basecamp Gunung Slamet',
      bannerUrl: 'https://picsum.photos/seed/lomba-mendaki/800/600',
      status: 'upcoming',
    },
    {
      title: 'Workshop Batik Tradisional',
      slug: 'workshop-batik-tradisional',
      description: 'Workshop belajar membuat batik dengan teknik tradisional khas Banyumas.',
      eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      eventTime: '10:00',
      location: 'Museum Budaya Banyumas',
      bannerUrl: 'https://picsum.photos/seed/workshop-batik/800/600',
      status: 'upcoming',
    },
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event,
    })
  }

  // ==================== BOOKINGS ====================
  console.log('Seeding bookings...')
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled']
  
  for (let i = 0; i < 8; i++) {
    const user = createdUsers[i % createdUsers.length]
    const destination = createdDestinations[i % createdDestinations.length]
    const status = statuses[i % statuses.length]
    const daysFromNow = [7, 5, 30, -10, 14, 2, 20, -5][i] // some in past, some in future
    const visitDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
    const numberOfVisitors = Math.floor(Math.random() * 5) + 1
    const totalPrice = numberOfVisitors * Number(destination.ticketPrice)
    
    const bookingNumber = `BK${String(Date.now()).slice(-6)}${String(i).padStart(3, '0')}`
    
    await prisma.booking.create({
      data: {
        bookingNumber,
        userId: user.id,
        destinationId: destination.id,
        visitDate,
        numberOfVisitors,
        totalPrice,
        status,
        notes: i % 3 === 0 ? 'Datang bersama keluarga besar' : null,
      },
    })
  }

  // ==================== REVIEWS ====================
  console.log('Seeding reviews...')
  const reviewComments = [
    'Tempatnya sangat indah dan bersih! Recommended banget.',
    'Pengalaman yang luar biasa, pemandangan sunrise-nya keren banget.',
    'Harga tiket terjangkau, fasilitas memadai.',
    'Wisata budaya yang menarik, banyak hal baru yang saya pelajari.',
    'Cocok untuk liburan keluarga, anak-anak senang.',
    'Makanan lokalnya enak-enak, harganya juga murah.',
    'Toiletnya bersih, parkirannya luas. Puas banget!',
    'Pemandangannya luar biasa, wajib datang lagi.',
  ]

  let reviewIndex = 0
  for (const user of createdUsers) {
    for (const dest of createdDestinations.slice(0, 2)) {
      if (reviewIndex < reviewComments.length) {
        await prisma.review.create({
          data: {
            userId: user.id,
            destinationId: dest.id,
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            comment: reviewComments[reviewIndex],
            isApproved: true,
          },
        })
        reviewIndex++
      }
    }
  }

  // ==================== ARTICLES ====================
  console.log('Seeding articles...')
  const articles = [
    {
      title: '5 Destinasi Wisata Terbaik di Banyumas yang Wajib Dikunjungi',
      slug: '5-destinasi-wisata-terbaik-banyumas',
      content: `
        <p>Kabupaten Banyumas memiliki banyak destinasi wisata yang menarik untuk dikunjungi. Berikut adalah 5 destinasi terbaik yang wajib Anda kunjungi:</p>
        <ol>
          <li><strong>Curug Cipendok</strong> - Air terjun yang indah dengan suasana sejuk</li>
          <li><strong>Kampung Wisata Landeuh</strong> - Wisata budaya dengan nuansa pedesaan</li>
          <li><strong>Gunung Slamet</strong> - Gunung tertinggi di Jawa Tengah</li>
          <li><strong>Museum Budaya Banyumas</strong> - Menjelajahi sejarah dan budaya lokal</li>
          <li><strong>Taman Edukasi Alam</strong> - Tempat wisata edukasi untuk anak-anak</li>
        </ol>
        <p>Semua destinasi ini menawarkan pengalaman wisata yang berbeda dan menarik. Jangan lupa untuk merencanakan liburan Anda dengan baik!</p>
      `,
      thumbnailUrl: 'https://picsum.photos/seed/article1/800/600',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Panduan Mendaki Gunung Slamet untuk Pemula',
      slug: 'panduan-mendaki-gunung-slamet-pemula',
      content: `
        <p>Gunung Slamet adalah salah satu gunung favorit untuk pendaki pemula. Berikut adalah panduan singkatnya:</p>
        <h3>Persiapan Fisik</h3>
        <p>Lakukan latihan fisik minimal 2 minggu sebelum pendakian. Fokus pada stamina dan kekuatan kaki.</p>
        <h3>Peralatan yang Dibutuhkan</h3>
        <ul>
          <li>Tenda dan sleeping bag</li>
          <li>Jaket hangat dan sepatu trekking</li>
          <li>Headlamp dan senter cadangan</li>
          <li>Air minum dan makanan cukup</li>
          <li>P3K dan obat-obatan pribadi</li>
        </ul>
        <h3>Rute Pendakian</h3>
        <p>Rute yang paling populer adalah melalui Basecamp Bambangan. Pastikan untuk selalu bersama kelompok dan mengikuti petunjuk dari guide.</p>
      `,
      thumbnailUrl: 'https://picsum.photos/seed/article2/800/600',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Menikmati Keindahan Budaya di Kampung Landeuh',
      slug: 'menikmati-keindahan-budaya-kampung-landeuh',
      content: `
        <p>Kampung Wisata Landeuh menawarkan pengalaman wisata budaya yang unik. Di sini, pengunjung dapat:</p>
        <ul>
          <li>Mempelajari cara membuat kerajinan tangan lokal</li>
          <li>Mencoba makanan tradisional khas Banyumas</li>
          <li>Berinteraksi dengan penduduk lokal</li>
          <li>Menonton pertunjukan kesenian tradisional</li>
        </ul>
        <p>Tempat ini sangat cocok untuk Anda yang ingin merasakan atmosfer pedesaan yang asri dan budaya yang masih kental.</p>
      `,
      thumbnailUrl: 'https://picsum.photos/seed/article3/800/600',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const article of articles) {
    await prisma.article.create({
      data: article,
    })
  }

  // ==================== CONTACTS ====================
  console.log('Seeding contacts...')
  const contacts = [
    {
      name: 'Rina Putri',
      email: 'rina@example.com',
      phone: '08123456789',
      subject: 'Tanya Tentang Reservasi',
      message: 'Halo, saya ingin bertanya tentang tata cara reservasi untuk rombongan sebanyak 20 orang. Mohon informasinya. Terima kasih.',
      isRead: true,
    },
    {
      name: 'Dedi Supriyatna',
      email: 'dedi@example.com',
      phone: '08987654321',
      subject: 'Kerja Sama Event',
      message: 'Kami dari pihak sekolah ingin mengadakan event di kampung wisata. Apakah bisa untuk berdiskusi lebih lanjut?',
      isRead: false,
    },
    {
      name: 'Sari Dewi',
      email: 'sari@example.com',
      subject: 'Pertanyaan Fasilitas',
      message: 'Apakah di Curug Cipendok tersedia tempat untuk makan? Dan apakah ada mushola?',
      isRead: true,
    },
  ]

  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact,
    })
  }

  // ==================== NOTIFICATIONS ====================
  console.log('Seeding notifications...')
  for (const user of createdUsers) {
    const notifications = [
      {
        title: 'Selamat Datang!',
        message: `Selamat datang di Kampung Wisata Landeuh, ${user.fullName}!`,
        type: 'info',
      },
      {
        title: 'Event Baru',
        message: 'Ada event baru: Festival Budaya Landeuh! Jangan lewatkan.',
        type: 'event',
      },
    ]
    
    for (const notif of notifications) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          ...notif,
        },
      })
    }
  }

  console.log('Seeding finished successfully!')
  console.log(`
    Summary:
    - ${createdCategories.length} Categories
    - ${createdUsers.length + 1} Users (including admin)
    - ${createdDestinations.length} Destinations
    - ${createdFacilities.length} Facilities
    - ${destinations.length * 3} Gallery Images
    - ${events.length} Events
    - 8 Bookings
    - ${reviewIndex} Reviews
    - ${articles.length} Articles
    - ${contacts.length} Contacts
    - ${createdUsers.length * 2} Notifications
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
