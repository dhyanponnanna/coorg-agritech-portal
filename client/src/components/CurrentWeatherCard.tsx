import type { CurrentWeather } from "../services/weatherApi";

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  locationName: string;
}

function CurrentWeatherCard({
  weather,
  locationName,
}: CurrentWeatherCardProps) {
  const { current, weatherDescription } = weather;

  return (
    <section>
      <h2>{locationName}</h2>

      <p>{weatherDescription}</p>

      <p>{current.temperature_2m}°C</p>

      <div>
        <div>
          <span>💧 Humidity</span>
          <strong>
            {current.relative_humidity_2m}%
          </strong>
        </div>

        <div>
          <span>🌧️ Rain</span>
          <strong>{current.rain} mm</strong>
        </div>

        <div>
          <span>🌡️ Feels like</span>
          <strong>
            {current.apparent_temperature}°C
          </strong>
        </div>

        <div>
          <span>💨 Wind</span>
          <strong>
            {current.wind_speed_10m} km/h
          </strong>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeatherCard;