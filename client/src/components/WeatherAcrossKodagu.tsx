import { useEffect, useState } from "react";
import { getWeatherAcrossKodagu } from "../services/weatherApi";
import { getWeatherEmoji } from "../utils/weatherEmoji";

const KODAGU_LOCATIONS = [
  "Madikeri",
  "Virajpet",
  "Somwarpet",
  "Ponnampet",
  "Kushalnagar",
];

interface WeatherAcrossKodaguProps {
  onSelect: (location: string) => void;
}

function WeatherAcrossKodagu({
  onSelect,
}: WeatherAcrossKodaguProps) {
    

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const results =
          await getWeatherAcrossKodagu(
            KODAGU_LOCATIONS
          );

        setLocations(results);
      } catch (error) {
        console.error(
          "Failed to load Kodagu weather:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <section className="kodagu-weather-section">
        <div className="section-label">
          WEATHER ACROSS KODAGU
        </div>

        <h2>Weather Across Kodagu</h2>

        <p className="weather-overview-loading">
          Loading district weather...
        </p>
      </section>
    );
  }

  return (
  <section className="kodagu-weather-section">
    <div className="kodagu-weather-header">
      <div className="section-label">
        WEATHER ACROSS KODAGU
      </div>

      <span className="kodagu-location-count">
        5 locations
      </span>
    </div>

    <div className="kodagu-weather-grid">
      {locations.map(({ location, weather, forecast }) => {
        const current = weather.current;
        const daily = forecast.daily;

        return (
          <article
            className="kodagu-weather-card"
            key={location}
            onClick={() => onSelect(location)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                onSelect(location);
                }
            }}
            >
            <div className="kodagu-card-top">
              <span className="kodagu-card-location">
                {location}
              </span>

              <span className="kodagu-card-icon">
                {getWeatherEmoji(
                  current.weather_code
                )}
              </span>
            </div>

            <div className="kodagu-card-temperature">
              {Math.round(
                current.temperature_2m
              )}°
            </div>

            <p className="kodagu-card-description">
              {weather.weatherDescription}
            </p>

            <div className="kodagu-card-details">
                <span>
                    H {Math.round(daily.temperature_2m_max[0])}°
                    {" · "}
                    <br/    >
                    L {Math.round(daily.temperature_2m_min[0])}°
                </span>

                <span>
                    💧 {current.relative_humidity_2m}%
                </span>

                <span>
                    💨{" "}
                    {Math.round(current.wind_speed_10m)} km/h
                </span>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);
}

export default WeatherAcrossKodagu;