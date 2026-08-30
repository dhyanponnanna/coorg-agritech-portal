import prisma from "../config/prisma.js";

export const createWeatherAlert = async ({
  locationId,
  title,
  message,
  severity,
  weatherCode,
  temperature,
  windSpeed,
}) => {
  const existingAlert = await prisma.weatherAlert.findFirst({
    where: {
      locationId,
      title,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000),
      },
    },
  });

  if (existingAlert) {
    return null;
  }
  return prisma.weatherAlert.create({
    data: {
      locationId,
      title,
      message,
      severity,
      weatherCode,
      temperature,
      windSpeed,
    },
  });
  
  
};

export const getWeatherAlertsByLocation = async (
  locationId
) => {
  return prisma.weatherAlert.findMany({
    where: {
      locationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getRecentWeatherAlerts = async (
  hours = 24
) => {
  const startTime = new Date(
    Date.now() - hours * 60 * 60 * 1000
  );

  return prisma.weatherAlert.findMany({
    where: {
      createdAt: {
        gte: startTime,
      },
    },
    include: {
      location: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getWeatherAlertById = async (id) => {
  return prisma.weatherAlert.findUnique({
    where: {
      id,
    },
    include: {
      location: true,
    },
  });
};

export const deleteWeatherAlert = async (id) => {
  return prisma.weatherAlert.delete({
    where: {
      id,
    },
  });
};