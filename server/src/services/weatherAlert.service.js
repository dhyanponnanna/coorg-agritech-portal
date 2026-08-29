import {
  createWeatherAlert,
  getWeatherAlertsByLocation,
  getRecentWeatherAlerts,
  getWeatherAlertById,
  deleteWeatherAlert,
} from "../repositories/weatherAlert.repository.js";

import {
  getLatestWeatherSnapshot,
  getLocationByName,
} from "../repositories/weather.repository.js";

export const generateWeatherAlertsService = async (
  locationId
) => {
  if (!locationId) {
    const error = new Error("Location ID is required");
    error.statusCode = 400;
    throw error;
  }

  const weather = await getLatestWeatherSnapshot(locationId);

  if (!weather) {
    const error = new Error(
      "No weather data found for this location"
    );
    error.statusCode = 404;
    throw error;
  }

  const alerts = [];

  if (
    weather.temperature !== null &&
    weather.temperature >= 35
  ) {
    alerts.push({
      title: "High Temperature Alert",
      message:
        "High temperature detected. Take precautions to protect crops and ensure adequate irrigation.",
      severity: "WARNING",
      weatherCode: weather.weatherCode,
      temperature: weather.temperature,
      windSpeed: weather.windSpeed,
    });
  }

  if (
    weather.temperature !== null &&
    weather.temperature <= 10
  ) {
    alerts.push({
      title: "Low Temperature Alert",
      message:
        "Low temperature detected. Sensitive crops may require protection.",
      severity: "WARNING",
      weatherCode: weather.weatherCode,
      temperature: weather.temperature,
      windSpeed: weather.windSpeed,
    });
  }

  if (
    weather.rain !== null &&
    weather.rain >= 20
  ) {
    alerts.push({
      title: "Heavy Rain Alert",
      message:
        "Heavy rainfall detected. Check drainage and avoid unnecessary field activities.",
      severity: "WARNING",
      weatherCode: weather.weatherCode,
      temperature: weather.temperature,
      windSpeed: weather.windSpeed,
    });
  }

  if (
    weather.windSpeed !== null &&
    weather.windSpeed >= 40
  ) {
    alerts.push({
      title: "Strong Wind Alert",
      message:
        "Strong winds detected. Protect vulnerable crops and farm structures.",
      severity: "CRITICAL",
      weatherCode: weather.weatherCode,
      temperature: weather.temperature,
      windSpeed: weather.windSpeed,
    });
  }

  const createdAlerts = [];

  for (const alert of alerts) {
    const created = await createWeatherAlert({
      locationId,
      ...alert,
    });

    createdAlerts.push(created);
  }

  return createdAlerts;
};

export const getLocationWeatherAlertsService = async (
  locationId
) => {
  if (!locationId) {
    const error = new Error("Location ID is required");
    error.statusCode = 400;
    throw error;
  }

  return getWeatherAlertsByLocation(locationId);
};

export const getRecentWeatherAlertsService = async (
  hours = 24
) => {
  const parsedHours = Number(hours);

  if (
    !Number.isFinite(parsedHours) ||
    parsedHours <= 0
  ) {
    const error = new Error(
      "Hours must be a positive number"
    );
    error.statusCode = 400;
    throw error;
  }

  return getRecentWeatherAlerts(parsedHours);
};

export const getWeatherAlertByIdService = async (id) => {
  if (!id) {
    const error = new Error("Alert ID is required");
    error.statusCode = 400;
    throw error;
  }

  const alert = await getWeatherAlertById(id);

  if (!alert) {
    const error = new Error("Weather alert not found");
    error.statusCode = 404;
    throw error;
  }

  return alert;
};

export const deleteWeatherAlertService = async (id) => {
  if (!id) {
    const error = new Error("Alert ID is required");
    error.statusCode = 400;
    throw error;
  }

  const alert = await getWeatherAlertById(id);

  if (!alert) {
    const error = new Error("Weather alert not found");
    error.statusCode = 404;
    throw error;
  }

  return deleteWeatherAlert(id);
};