const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.destinationCategory.findMany();
  console.log(cats);
}
main();
