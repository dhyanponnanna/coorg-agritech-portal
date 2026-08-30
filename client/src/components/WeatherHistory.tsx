import type { WeatherHistoryData } from "../services/weatherApi";

interface WeatherHistoryProps {
  history: WeatherHistoryData | null;
  loading: boolean;
}

function WeatherHistory({
  history,
  loading,
}: WeatherHistoryProps) {
  if (loading) {
    return (
      <section className="weather-history">
        <h2>Weather History</h2>
        <p>Loading weather history...</p>
      </section>
    );
  }

  if (!history || history.records.length === 0) {
    return (
      <section className="weather-history">
        <h2>Weather History</h2>
        <p>No historical weather data available.</p>
      </section>
    );
  }

  return (
    <section className="weather-history">
      <div className="weather-history-header">
        <div>
          <p className="section-label">RECENT DATA</p>
          <h2>Weather History</h2>
        </div>

        <span>
          Last {history.hours} hours · {history.count} records
        </span>
      </div>

      <div className="weather-history-list">
        {history.records.map((record) => (
          <div
            className="weather-history-row"
            key={record.id}
          >
            <div className="weather-history-time">
              {new Date(record.recordedAt).toLocaleString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </div>

            <div>
              <strong>{record.temperature}°C</strong>
              <span>Temperature</span>
            </div>

            <div>
              <strong>{record.humidity}%</strong>
              <span>Humidity</span>
            </div>

            <div>
              <strong>{record.rain} mm</strong>
              <span>Rain</span>
            </div>

            <div>
              <strong>{record.windSpeed} km/h</strong>
              <span>Wind</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeatherHistory;