import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const txData: Prisma.TxCreateInput[] = [
  {
    hash: '0x1d512af0841d275deb74f34153c33b865f3b5e50ba30c87ea86e212cebf043fc',
    wallet: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    status: 'succeed',
  },
];

export async function main() {
  try {
    console.log(`Start seeding ...`);
    for (const u of txData) {
      const tx = await prisma.tx.create({
        data: u,
      });
      console.log(`Created tx with hash: ${tx.hash}`);
    }
    console.log(`Seeding finished.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
