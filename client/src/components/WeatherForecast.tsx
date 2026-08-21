import type { WeatherForecastData } from "../services/weatherApi";
import { getWeatherEmoji } from "../utils/weatherEmoji";

interface WeatherForecastProps {
  forecast: WeatherForecastData;
}
function WeatherForecast({
  forecast,
}: WeatherForecastProps) {
  const { daily } = forecast;

  return (
    <section className="forecast-section">
  <div className="forecast-header">
    <div>
      <div className="section-label">
        WEATHER OUTLOOK
      </div>

      <h2>7-Day Forecast</h2>
    </div>

    <span className="forecast-meta">
      Next 7 days
    </span>
  </div>

  <div className="forecast-grid">
    {daily.time.map((date, index) => {
      const day = new Date(date).toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
        }
      );

      return (
        <article
  className="forecast-day"
  key={date}
>
  <span className="forecast-day-name">
    {day}
  </span>

  <span className="forecast-weather-icon">
    {getWeatherEmoji(
      daily.weather_code[index]
    )}
  </span>

  <div className="forecast-temperature">
    <strong>
      {Math.round(
        daily.temperature_2m_max[index]
      )}°
    </strong>

    <span>
      {Math.round(
        daily.temperature_2m_min[index]
      )}°
    </span>
  </div>

  <div className="forecast-rain">
    {daily.precipitation_sum[index]} mm
  </div>

  <span className="forecast-rain-label">
    precipitation
  </span>
</article>
      );
    })}
  </div>
</section>
  );
}

export default WeatherForecast;