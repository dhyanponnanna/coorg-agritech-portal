import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const main = async () => {
  const snapshots = await prisma.weatherSnapshot.findMany({
    where: {
      locationId: null,
    },
  });

  for (const snapshot of snapshots) {
    const location = await prisma.location.findUnique({
      where: {
        name: snapshot.location,
      },
    });

    if (!location) {
      console.warn(
        `Location not found: ${snapshot.location}`
      );
      continue;
    }

    await prisma.weatherSnapshot.update({
      where: {
        id: snapshot.id,
      },
      data: {
        locationId: location.id,
      },
    });
  }

  console.log(
    `Linked ${snapshots.length} weather snapshots.`
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });