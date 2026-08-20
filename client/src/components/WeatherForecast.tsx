import type { WeatherForecastData } from "../services/weatherApi";

interface WeatherForecastProps {
  forecast: WeatherForecastData;
}
function WeatherForecast({
  forecast,
}: WeatherForecastProps) {
  const { daily } = forecast;

  return (
    <section>
      <h2>7-Day Forecast</h2>

      <div>
        {daily.time.map((date, index) => {
          const day = new Date(date).toLocaleDateString(
            "en-IN",
            {
              weekday: "short",
            }
          );

          return (
            <article key={date}>
              <h3>{day}</h3>

              <p>
                {daily.temperature_2m_max[index]}°C
              </p>

              <p>
                {daily.temperature_2m_min[index]}°C
              </p>

              <p>
                🌧️{" "}
                {daily.precipitation_sum[index]} mm
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherForecast;