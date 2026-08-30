const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface WeatherLocation {
  displayName: string;
  latitude: number;
  longitude: number;
  address: {
    road: string | null;
    village: string | null;
    town: string | null;
    city: string | null;
    district: string | null;
    state: string | null;
    postcode: string | null;
    country: string | null;
  };
}

export interface CurrentWeather {
  location: WeatherLocation;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  units: Record<string, string>;
  weatherDescription: string;
  agriculturalAnalysis: {
    rainfallRisk: string;
    humidityRisk: string;
    sprayingSuitability: string;
    recommendations: string[];
    conditions: {
      temperature: number;
      humidity: number;
      precipitation: number;
      rain: number;
    };
  };
  cached?: boolean;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  rain_sum: number[];
}

export interface WeatherForecastData {
  daily: DailyForecast;
  daily_units: Record<string, string>;
}

export interface LocationResult {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  address: {
    village: string | null;
    town: string | null;
    city: string | null;
    district: string | null;
    state: string | null;
    country: string | null;
  };
  source?: "local" | "nominatim";
}

export interface WeatherAlertLocation {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface WeatherAlert {
  id: string;
  locationId: string;
  title: string;
  message: string;
  severity: string;
  weatherCode: number;
  temperature: number;
  windSpeed: number;
  createdAt: string;
  location?: WeatherAlertLocation;
} 

export interface WeatherHistoryRecord {
  id: string;
  locationId: string;
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  recordedAt: string;
}

export interface WeatherHistoryData {
  location: string;
  hours: number;
  count: number;
  records: WeatherHistoryRecord[];
}

const request = async <T>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

export const getCurrentWeather = async (
  location: string
): Promise<ApiResponse<CurrentWeather>> => {
  return request<CurrentWeather>(
    `/weather/current/${encodeURIComponent(location)}`
  );
};

export const getWeatherByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<CurrentWeather>> => {
  return request<CurrentWeather>(
    `/weather/current?latitude=${latitude}&longitude=${longitude}`
  );
};

export const getWeatherForecastByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<WeatherForecastData>> => {
  return request<WeatherForecastData>(
    `/weather/forecast?latitude=${latitude}&longitude=${longitude}`
  );
};

export const searchLocations = async (
  query: string
): Promise<ApiResponse<LocationResult[]>> => {
  return request<LocationResult[]>(
    `/geocoding/search?q=${encodeURIComponent(query)}`
  );
};

export const getWeatherForecast = async (
  location: string
): Promise<ApiResponse<WeatherForecastData>> => {
  return request<WeatherForecastData>(
    `/weather/forecast/${encodeURIComponent(location)}`
  );
};

export const getRecentWeatherAlerts = async (
  hours = 24
): Promise<ApiResponse<WeatherAlert[]>> => {
  return request<WeatherAlert[]>(
    `/weather-alerts/recent?hours=${hours}`
  );
};

// export const getWeatherHistory = async (
//   location: string,
//   hours = 24
// ): Promise<ApiResponse<WeatherHistoryData>> => {
//   return request<WeatherHistoryData>(
//     `/weather/history/${encodeURIComponent(location)}?hours=${hours}`
//   );
// };

export const getWeatherAcrossKodagu = async (
  locations: string[]
) => {
  const results = await Promise.all(
    locations.map(async (location) => {
      const [currentResponse, forecastResponse] =
        await Promise.all([
          getCurrentWeather(location),
          getWeatherForecast(location),
        ]);

      return {
        location,
        weather: currentResponse.data,
        forecast: forecastResponse.data,
      };
    })
  );

  return results;
};