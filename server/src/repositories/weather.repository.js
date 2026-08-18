import prisma from "../config/prisma.js";

export const createWeatherSnapshot = async (weather) => {
  return prisma.weatherSnapshot.create({
    data: {
      location: weather.location,
      locationId: weather.locationId,
      latitude: weather.latitude,
      longitude: weather.longitude,
      temperature: weather.temperature,
      humidity: weather.humidity,
      apparentTemperature: weather.apparentTemperature,
      precipitation: weather.precipitation,
      rain: weather.rain,
      weatherCode: weather.weatherCode,
      windSpeed: weather.windSpeed,
      windDirection: weather.windDirection,
    },
  });
};

export const getLocationByName = async (name) => {
  return prisma.location.findUnique({
    where: {
      name,
    },
  });
};

export const getWeatherHistory = async (
  locationId,
  hours = 24
) => {
  const startTime = new Date(
    Date.now() - hours * 60 * 60 * 1000
  );

  return prisma.weatherSnapshot.findMany({
    where: {
      locationId,
      recordedAt: {
        gte: startTime,
      },
    },
    orderBy: {
      recordedAt: "asc",
    },
  });
};

export const getLatestWeatherSnapshot = async (locationId) => {
  return prisma.weatherSnapshot.findFirst({
    where: {
      locationId,
    },
    orderBy: {
      recordedAt: "desc",
    },
  });
};