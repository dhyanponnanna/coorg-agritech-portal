import { useEffect, useState } from "react";

import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherByCoordinates,
  getWeatherForecastByCoordinates,
  getRecentWeatherAlerts,
  type CurrentWeather,
  type LocationResult,
  type WeatherForecastData,
  type WeatherAlert,
} from "./services/weatherApi";

import LocationSearch from "./components/LocationSearch";
import QuickLocations from "./components/QuickLocations";
import CurrentLocationButton from "./components/CurrentLocationButton";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import AgriculturalAdvisory from "./components/AgriculturalAdvisory";
import WeatherForecast from "./components/WeatherForecast";
import Header from "./components/Header";
import WeatherAcrossKodagu from "./components/WeatherAcrossKodagu";
import WeatherAlerts from "./components/WeatherAlerts";
import "./App.css";
import EmailSubscription from "./components/EmailSubscription";
import EmailSubscriptionAction from "./components/EmailSubscriptionAction";

function App() {
  const [selectedLocation, setSelectedLocation] =
    useState("madikeri");

  const [locationName, setLocationName] =
    useState("Madikeri");

  const [weather, setWeather] =
    useState<CurrentWeather | null>(null);

  const [loading, setLoading] = useState(false);

  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  const [forecast, setForecast] =
  useState<WeatherForecastData | null>(null);
    
  const filterAlertsByLocation = (
  allAlerts: WeatherAlert[],
  location: string
) => {
  const normalizedLocation = location
    .trim()
    .toLowerCase();

  return allAlerts.filter(
    (alert) =>
      alert.location?.name?.trim().toLowerCase() ===
      normalizedLocation
  );
};


 const loadWeather = async (location: string) => {
  try {
    setLoading(true);
    setError(null);

    const [
      weatherResponse,
      forecastResponse,
      alertsResponse,
    ] = await Promise.all([
      getCurrentWeather(location),
      getWeatherForecast(location),
      getRecentWeatherAlerts(),
    ]);

    setWeather(weatherResponse.data);
    setForecast(forecastResponse.data);
    setAlerts(
  filterAlertsByLocation(
    alertsResponse.data,
    location
  )
);

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
  
  useEffect(() => {
  const refreshAlerts = async () => {
    try {
      const response = await getRecentWeatherAlerts();

      const normalizedLocation = selectedLocation
        .trim()
        .toLowerCase();

      const filteredAlerts = response.data.filter(
        (alert) =>
          alert.location?.name?.trim().toLowerCase() ===
          normalizedLocation
      );

      setAlerts(filteredAlerts);
    } catch (error) {
      console.error("Failed to refresh weather alerts:", error);
    }
  };

  const intervalId = window.setInterval(
    refreshAlerts,
    15 * 60 * 1000
  );

  return () => window.clearInterval(intervalId);
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
    setAlerts([]);
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
      setAlerts([]);
    }
  } finally {
    setLoading(false);
  }
};

const currentPath = window.location.pathname;

if (
  currentPath === "/verify-email" ||
  currentPath === "/unsubscribe"
) {
  return <EmailSubscriptionAction />;
}

  return (
    <div className="app">
    <main className="app-container">
      <Header />

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

<WeatherAcrossKodagu 
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

    <WeatherAlerts alerts={alerts} />

    <EmailSubscription />

    <AgriculturalAdvisory
      weather={weather}
    />
  </>
)}

{forecast && (
  <WeatherForecast
    forecast={forecast}
  />
)}
    </main>
    </div>
  );
}

export default App;