const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Wisata Alam', slug: 'wisata-alam', icon: 'map-pin' },
    { name: 'Wisata Budaya', slug: 'wisata-budaya', icon: 'map-pin' },
    { name: 'Wisata Edukasi', slug: 'wisata-edukasi', icon: 'map-pin' },
    { name: 'Kuliner', slug: 'kuliner', icon: 'map-pin' },
  ];

  for (const cat of categories) {
    await prisma.destinationCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
