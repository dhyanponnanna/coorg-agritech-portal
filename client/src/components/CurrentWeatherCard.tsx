import { useEffect, useState } from "react";
import type { CurrentWeather } from "../services/weatherApi";
import { getWeatherEmoji } from "../utils/weatherEmoji";

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  locationName: string;
}


function CurrentWeatherCard({
  weather,
  locationName,
}: CurrentWeatherCardProps) {
  const { current, weatherDescription } = weather;

  const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

const currentDate = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(currentTime);

const currentClockTime = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  //second: "2-digit",
  hour12: false,
}).format(currentTime);

  return (
    <section className="weather-card">
 <div className="weather-card-header">
  <div className="section-label">
    CURRENT CONDITIONS
  </div>

  <div className="weather-location-info">
    <span className="weather-location">
      {locationName}
    </span>

    <span className="weather-date">
      {currentDate}
    </span>

    <span className="weather-live-status">
      <span className="status-dot" />
      LIVE · {currentClockTime} IST
    </span>
  </div>
</div>

  <div className="weather-main">
    <div className="temperature">
      {current.temperature_2m}°
    </div>

    <div className="weather-summary">
  <div className="weather-condition">
    <span className="weather-emoji">
      {getWeatherEmoji(current.weather_code)}
    </span>

    <p className="weather-description">
      {weatherDescription}
    </p>
  </div>

  <p className="feels-like">
    Feels like {current.apparent_temperature}°
  </p>
</div>
  </div>

  <div className="weather-metrics">
    <div className="weather-metric">
      <span>HUMIDITY</span>
      <strong>
        {current.relative_humidity_2m}%
      </strong>
    </div>

    <div className="weather-metric">
      <span>RAIN</span>
      <strong>
        {current.rain} mm
      </strong>
    </div>

    <div className="weather-metric">
      <span>WIND</span>
      <strong>
        {current.wind_speed_10m} km/h
      </strong>
    </div>
  </div>
</section>
  );
}

export default CurrentWeatherCard;