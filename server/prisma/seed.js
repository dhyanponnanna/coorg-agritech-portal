import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const locations = [
  {
    name: "Madikeri",
    slug: "madikeri",
    latitude: 12.4244,
    longitude: 75.7382,
  },
  {
    name: "Virajpet",
    slug: "virajpet",
    latitude: 12.1965,
    longitude: 75.8055,
  },
  {
    name: "Somwarpet",
    slug: "somwarpet",
    latitude: 12.5967,
    longitude: 75.8497,
  },
  {
    name: "Ponnampet",
    slug: "ponnampet",
    latitude: 12.14473,
    longitude: 75.94514,
  },
  {
    name: "Kushalnagar",
    slug: "kushalnagar",
    latitude: 12.4586,
    longitude: 75.9614,
  },
];

const main = async () => {
  for (const location of locations) {
    await prisma.location.upsert({
      where: {
        slug: location.slug,
      },
      update: location,
      create: location,
    });
  }

  console.log("Locations seeded successfully.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });