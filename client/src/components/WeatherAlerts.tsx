
import type { WeatherAlert } from "../services/weatherApi";

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (alerts.length === 0) {
    return (
      <section className="weather-alerts">
        <div className="weather-alerts-header">
          <h2>Weather Alerts</h2>
          <span className="alert-count">0 Alerts</span>
        </div>

        <div className="weather-alert-empty">
          <span className="alert-empty-icon">🌤️</span>
          <h3>All Clear!</h3>
          <p>No active weather alerts for this location.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="weather-alerts">
      <div className="weather-alerts-header">
        <h2>Weather Alerts</h2>
        <span className="alert-count">
          {alerts.length} {alerts.length === 1 ? "Alert" : "Alerts"}
        </span>
      </div>

      <div className="weather-alert-list">
        {alerts.map((alert) => {
          const severityClass = alert.severity
            .toLowerCase()
            .replace(/\s+/g, "-");

          return (
            <article
              className={`weather-alert weather-alert-${severityClass}`}
              key={alert.id}
            >
              <div className="weather-alert-top">
                <h3>{alert.title}</h3>

                <span className={`alert-severity severity-${severityClass}`}>
                  {alert.severity}
                </span>
              </div>

              <p className="weather-alert-message">
                {alert.message}
              </p>

              <div className="weather-alert-details">
                <span>🌡️ Temperature: {alert.temperature}°C</span>
                <span>💨 Wind: {alert.windSpeed} km/h</span>
              </div>

              <div className="weather-alert-footer">
                <span>
                  📍 {alert.location?.name || "Unknown location"}
                </span>

                <span>
                  🕒 {formatDate(alert.createdAt)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherAlerts;
