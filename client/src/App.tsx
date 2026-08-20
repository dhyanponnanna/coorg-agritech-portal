import { useEffect, useState } from "react";

import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherByCoordinates,
  getWeatherForecastByCoordinates,
  type CurrentWeather,
  type LocationResult,
  type WeatherForecastData,
} from "./services/weatherApi";

import LocationSearch from "./components/LocationSearch";
import QuickLocations from "./components/QuickLocations";
import CurrentLocationButton from "./components/CurrentLocationButton";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import AgriculturalAdvisory from "./components/AgriculturalAdvisory";
import WeatherForecast from "./components/WeatherForecast";

function App() {
  const [selectedLocation, setSelectedLocation] =
    useState("madikeri");

  const [locationName, setLocationName] =
    useState("Madikeri");

  const [weather, setWeather] =
    useState<CurrentWeather | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [forecast, setForecast] =
  useState<WeatherForecastData | null>(null);
    

 const loadWeather = async (location: string) => {
  try {
    setLoading(true);
    setError(null);

    const [weatherResponse, forecastResponse] =
      await Promise.all([
        getCurrentWeather(location),
        getWeatherForecast(location),
      ]);

    setWeather(weatherResponse.data);
    setForecast(forecastResponse.data);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to load weather");
    }
  } finally {
    setLoading(false);
  }
};

//   const handleManualClick = useCallback(() => {
//   loadWeather(selectedLocation);
// }, [selectedLocation]);

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const handleQuickLocationSelect = (
  location: string
) => {
  setSelectedLocation(location);

  const formattedName =
    location.charAt(0).toUpperCase() +
    location.slice(1);

  setLocationName(formattedName);
};

const handleLocationSelect = async (
  location: LocationResult
) => {
  try {
    setLocationName(location.name);
    setLoading(true);
    setError(null);

    const [
      weatherResponse,
      forecastResponse,
    ] = await Promise.all([
      getWeatherByCoordinates(
        location.latitude,
        location.longitude
      ),
      getWeatherForecastByCoordinates(
        location.latitude,
        location.longitude
      ),
    ]);

    setWeather(weatherResponse.data);
    setForecast(forecastResponse.data);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to load weather");
    }
  } finally {
    setLoading(false);
  }
};

const handleCurrentLocation = async (
  latitude: number,
  longitude: number
) => {
  try {
    setLoading(true);
    setError(null);

    const [
      weatherResponse,
      forecastResponse,
    ] = await Promise.all([
      getWeatherByCoordinates(
        latitude,
        longitude
      ),
      getWeatherForecastByCoordinates(
        latitude,
        longitude
      ),
    ]);

    setWeather(weatherResponse.data);
    setForecast(forecastResponse.data);

    const location =
      weatherResponse.data.location;

    const name =
      location.address.city ||
      location.address.town ||
      location.address.village ||
      location.address.district ||
      "Current Location";

    setLocationName(name);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(
        "Failed to load current location weather"
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <main>
      <h1>Coorg Agri-Tech</h1>

      <LocationSearch
        onLocationSelect={handleLocationSelect}
      />
      <CurrentLocationButton
        onLocationFound={handleCurrentLocation}
      />
      <QuickLocations
        selectedLocation={selectedLocation}
        onSelect={handleQuickLocationSelect}
      />

      {loading && <p>Loading weather...</p>}

      {error && <p>{error}</p>}

      {weather && (
  <>
    <CurrentWeatherCard
      weather={weather}
      locationName={locationName}
    />

    <AgriculturalAdvisory
      weather={weather}
    />
    {forecast && (
  <WeatherForecast forecast={forecast} />
)}
  </>
)}
    </main>
  );
}

export default App;