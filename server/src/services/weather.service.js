import { LOCATIONS } from "../config/locations.js";
import { analyzeCurrentConditions } from "./agriculture.service.js";
import { getWeatherDescription } from "../utils/weather-code.js";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export const getCurrentWeather = async (location) => {
  const locationKey = location.toLowerCase();

  const selectedLocation = LOCATIONS[locationKey];

  if (!selectedLocation) {
    const error = new Error("Location not supported");
    error.statusCode = 404;
    throw error;
  }

  const params = new URLSearchParams({
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
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
    const error = new Error("Weather provider request failed");
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

 const agriculturalAnalysis = analyzeCurrentConditions({
  temperature: data.current.temperature_2m,
  humidity: data.current.relative_humidity_2m,
  precipitation: data.current.precipitation,
  rain: data.current.rain,
 });

 return {
  location: selectedLocation.name,
  coordinates: {
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
  },
  current: data.current,
  units: data.current_units,
  weatherDescription: getWeatherDescription(
  data.current.weather_code),
  agriculturalAnalysis,
 };
};

export const getWeatherForecast = async (location) => {
  const locationKey = location.toLowerCase();

  const selectedLocation = LOCATIONS[locationKey];

  if (!selectedLocation) {
    const error = new Error("Location not supported");
    error.statusCode = 404;
    throw error;
  }

  const params = new URLSearchParams({
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_sum",
      "rain_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "Asia/Kolkata",
    forecast_days: "7",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params}`);

  if (!response.ok) {
    const error = new Error("Weather provider request failed");
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  return {
    location: selectedLocation.name,
    coordinates: {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    },
    daily: data.daily,
    units: data.daily_units,
  };
};