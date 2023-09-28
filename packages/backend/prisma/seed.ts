import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const issuersData: Prisma.IssuerCreateInput[] = [
  {
    did: 'did:1234',
    name: 'Issuer 1',
  },
];

export async function main() {
  try {
    console.log(`Start seeding ...`);
    for (const u of issuersData) {
      const issuer = await prisma.issuer.create({
        data: u,
      });
      console.log(`Created tx with hash: ${issuer.did}`);
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
