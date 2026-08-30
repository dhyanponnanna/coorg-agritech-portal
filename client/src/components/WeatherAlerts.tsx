import type { WeatherAlert } from "../services/weatherApi";

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <section className="weather-alerts">
        <h2>Weather Alerts</h2>
        <div className="weather-alert-empty">
          <p>No active weather alerts.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="weather-alerts">
      <h2>Weather Alerts</h2>

      {alerts.map((alert) => (
        <div
          className={`weather-alert weather-alert-${alert.severity.toLowerCase()}`}
          key={alert.id}
        >
          <div>
            <h3>{alert.title}</h3>
            <p>{alert.message}</p>
          </div>

          <div className="weather-alert-details">
            <span>Severity: {alert.severity}</span>
            <span>Temperature: {alert.temperature}°C</span>
            <span>Wind: {alert.windSpeed} km/h</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default WeatherAlerts;