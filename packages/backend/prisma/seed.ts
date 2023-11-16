import { PrismaClient } from '@prisma/client';

import { issuerData } from './data';
import { credentialsData } from './seed.helpers';

const prisma = new PrismaClient();

export async function main() {
  try {
    console.log(`Start seeding ...`);
    const createdIssuer = await prisma.issuer.create({ data: issuerData });

    console.log(`Created issuer with DID: ${createdIssuer.did}`);

    const created = await prisma.credential.createMany({ data: credentialsData(createdIssuer) });

    console.log(`Created ${created.count} credentials.`);

    console.log(`Seeding finished.`);
  } catch (err) {
    console.error(err);
    return;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => console.error(e));
