import prisma from "../config/prisma.js";

export const createWeatherSnapshot = async (weather) => {
  return prisma.weatherSnapshot.create({
    data: weather,
  });
};

export const getRecentWeatherSnapshots = async (location, limit = 24) => {
  return prisma.weatherSnapshot.findMany({
    where: {
      location,
    },
    orderBy: {
      recordedAt: "desc",
    },
    take: limit,
  });
};

export const getLatestWeatherSnapshot = async (location) => {
  return prisma.weatherSnapshot.findFirst({
    where: {
      location,
    },
    orderBy: {
      recordedAt: "desc",
    },
  });
};