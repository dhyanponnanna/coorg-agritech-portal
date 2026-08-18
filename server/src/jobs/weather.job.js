import cron from "node-cron";
import { LOCATIONS } from "../config/locations.js";
import { createWeatherSnapshot } from "../repositories/weather.repository.js";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const collectWeatherForLocation = async (location) => {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    timezone: "Asia/Kolkata",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params}`);

  if (!response.ok) {
    throw new Error(
      `Weather provider failed for ${location.name}`
    );
  }

  const data = await response.json();

  await createWeatherSnapshot({
    location: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    apparentTemperature: data.current.apparent_temperature,
    precipitation: data.current.precipitation,
    rain: data.current.rain,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
  });

  console.log(
    `Weather collected: ${location.name}`
  );
};

export const startWeatherJob = () => {
  collectAllWeather();

  cron.schedule("*/15 * * * *", async () => {
    await collectAllWeather();
  });

  console.log("Weather collection job started.");
};

const collectAllWeather = async () => {
  console.log("Starting weather collection...");

  for (const location of Object.values(LOCATIONS)) {
    try {
      await collectWeatherForLocation(location);
    } catch (error) {
      console.error(
        `Failed to collect weather for ${location.name}:`,
        error.message
      );
    }
  }

  console.log("Weather collection completed.");
};