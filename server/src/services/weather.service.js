import { LOCATIONS } from "../config/locations.js";
import { analyzeCurrentConditions } from "./agriculture.service.js";
import { getWeatherDescription } from "../utils/weather-code.js";
import {
  createWeatherSnapshot,
  getLatestWeatherSnapshot,
  getWeatherHistory,
  getLocationByName,
} from "../repositories/weather.repository.js";
import { reverseGeocode } from "./geocoding.service.js";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export const getCurrentWeather = async (location) => {
  const locationKey = location.toLowerCase();

  const selectedLocation = LOCATIONS[locationKey];

  const databaseLocation = await getLocationByName(
  selectedLocation.name
);

if (!databaseLocation) {
  const error = new Error("Location is not configured in database");
  error.statusCode = 500;
  throw error;
}

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

  const latestSnapshot = await getLatestWeatherSnapshot(
  databaseLocation.id
);

if (latestSnapshot) {
  const ageInMinutes =
    (Date.now() - latestSnapshot.recordedAt.getTime()) / (1000 * 60);

  if (ageInMinutes < 15) {
    return {
      location: selectedLocation.name,
      coordinates: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
      current: {
        time: latestSnapshot.recordedAt,
        temperature_2m: latestSnapshot.temperature,
        relative_humidity_2m: latestSnapshot.humidity,
        apparent_temperature: latestSnapshot.apparentTemperature,
        precipitation: latestSnapshot.precipitation,
        rain: latestSnapshot.rain,
        weather_code: latestSnapshot.weatherCode,
        wind_speed_10m: latestSnapshot.windSpeed,
        wind_direction_10m: latestSnapshot.windDirection,
      },
      agriculturalAnalysis: analyzeCurrentConditions({
        temperature: latestSnapshot.temperature,
        humidity: latestSnapshot.humidity,
        precipitation: latestSnapshot.precipitation,
        rain: latestSnapshot.rain,
      }),
      weatherDescription: getWeatherDescription(
        latestSnapshot.weatherCode
      ),
      cached: true,
    };
  }
}

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

 await createWeatherSnapshot({
  location: selectedLocation.name,
  locationId: databaseLocation.id,
  latitude: selectedLocation.latitude,
  longitude: selectedLocation.longitude,
  temperature: data.current.temperature_2m,
  humidity: data.current.relative_humidity_2m,
  apparentTemperature: data.current.apparent_temperature,
  precipitation: data.current.precipitation,
  rain: data.current.rain,
  weatherCode: data.current.weather_code,
  windSpeed: data.current.wind_speed_10m,
  windDirection: data.current.wind_direction_10m,
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
  cached: false,
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

export const getHistoricalWeather = async (
  location,
  hours = 24
) => {
  const locationKey = location.toLowerCase();

  const selectedLocation = LOCATIONS[locationKey];

  if (!selectedLocation) {
    const error = new Error("Location not supported");
    error.statusCode = 404;
    throw error;
  }

  const validHours = Number(hours);

  if (
    !Number.isInteger(validHours) ||
    validHours < 1 ||
    validHours > 168
  ) {
    const error = new Error(
      "Hours must be an integer between 1 and 168"
    );
    error.statusCode = 400;
    throw error;
  }

  const databaseLocation = await getLocationByName(
  selectedLocation.name
);

if (!databaseLocation) {
  const error = new Error("Location is not configured in database");
  error.statusCode = 500;
  throw error;
}

return getWeatherHistory(
  databaseLocation.id,
  validHours
);
};

export const getCurrentWeatherByCoordinates = async (
  latitude,
  longitude
) => {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    const error = new Error("Invalid latitude or longitude");
    error.statusCode = 400;
    throw error;
  }

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
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
    timezone: "auto",
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
  
  let location = null;

  try {
    location = await reverseGeocode(lat, lon);
  } catch (error) {
    console.error(
      "Reverse geocoding failed:",
      error.message
    );
  }

  const data = await response.json();

  const agriculturalAnalysis = analyzeCurrentConditions({
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    rain: data.current.rain,
  });

  return {
  location,
  coordinates: {
    latitude: lat,
    longitude: lon,
  },
  current: data.current,
  units: data.current_units,
  weatherDescription: getWeatherDescription(
    data.current.weather_code
  ),
  agriculturalAnalysis,
};
};

export const getWeatherForecastByCoordinates = async (
  latitude,
  longitude
) => {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    const error = new Error("Invalid latitude or longitude");
    error.statusCode = 400;
    throw error;
  }

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
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
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const response = await fetch(
    `${OPEN_METEO_URL}?${params}`
  );

  if (!response.ok) {
    const error = new Error(
      "Weather provider request failed"
    );
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  let location = null;

  try {
    location = await reverseGeocode(lat, lon);
  } catch (error) {
    console.error(
      "Reverse geocoding failed:",
      error.message
    );
  }

  return {
    location,
    coordinates: {
      latitude: lat,
      longitude: lon,
    },
    daily: data.daily,
    units: data.daily_units,
  };
};