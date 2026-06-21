const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  })

  const touristRole = await prisma.role.upsert({
    where: { name: 'Tourist' },
    update: {},
    create: { name: 'Tourist' },
  })

  // Admin User
  const passwordHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kampunglandeuh.id' },
    update: {},
    create: {
      email: 'admin@kampunglandeuh.id',
      fullName: 'Super Admin',
      passwordHash,
      roleId: adminRole.id,
    },
  })

  // Categories
  const categories = [
    { name: 'Wisata Alam', slug: 'wisata-alam', icon: '🌿' },
    { name: 'Wisata Budaya', slug: 'wisata-budaya', icon: '🎭' },
    { name: 'Wisata Edukasi', slug: 'wisata-edukasi', icon: '📚' },
  ]

  for (const cat of categories) {
    await prisma.destinationCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Facilities
  const facilities = [
    { name: 'Area Parkir', icon: 'Car' },
    { name: 'Toilet', icon: 'Bath' },
    { name: 'Mushola', icon: 'Moon' },
    { name: 'Food Court', icon: 'UtensilsCrossed' },
  ]

  for (const fac of facilities) {
    await prisma.facility.create({
      data: fac,
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
