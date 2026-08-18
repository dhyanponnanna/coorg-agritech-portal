import prisma from "../config/prisma.js";

export const createWeatherSnapshot = async (weather) => {
  return prisma.weatherSnapshot.create({
    data: weather,
  });
};

export const getWeatherHistory = async (location, hours = 24) => {
  const startTime = new Date(
    Date.now() - hours * 60 * 60 * 1000
  );

  return prisma.weatherSnapshot.findMany({
    where: {
      location,
      recordedAt: {
        gte: startTime,
      },
    },
    orderBy: {
      recordedAt: "asc",
    },
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