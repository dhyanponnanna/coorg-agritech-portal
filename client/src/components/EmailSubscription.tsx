
import { useEffect, useState } from "react";

import {
  getSubscriptionLocations,
  subscribeToWeatherAlerts,
  type SubscriptionLocation,
} from "../services/weatherApi";

import "../App.css";

interface AlertPreferences {
  receiveHighTemperature: boolean;
  receiveLowTemperature: boolean;
  receiveHeavyRain: boolean;
  receiveStrongWind: boolean;
}

const defaultPreferences: AlertPreferences = {
  receiveHighTemperature: true,
  receiveLowTemperature: true,
  receiveHeavyRain: true,
  receiveStrongWind: true,
};

function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [locations, setLocations] = useState<SubscriptionLocation[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [preferences, setPreferences] =
    useState<AlertPreferences>(defaultPreferences);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);

        const response = await getSubscriptionLocations();
        setLocations(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load locations"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocations((previous) =>
      previous.includes(locationId)
        ? previous.filter((id) => id !== locationId)
        : [...previous, locationId]
    );
  };

  const handlePreferenceChange = (
    preference: keyof AlertPreferences
  ) => {
    setPreferences((previous) => ({
      ...previous,
      [preference]: !previous[preference],
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (selectedLocations.length === 0) {
      setError("Please select at least one location.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await subscribeToWeatherAlerts({
        email,
        locationIds: selectedLocations,
        preferences,
      });

      setMessage(response.message);

      setEmail("");
      setSelectedLocations([]);
      setPreferences(defaultPreferences);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Subscription failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="email-subscription">
      <div className="subscription-header">
        <span className="subscription-icon">📧</span>

        <div>
          <h2>Weather Alert Notifications</h2>
          <p>
            Receive important weather alerts directly in your email.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="subscription-email">
          Email Address
        </label>

        <input
          id="subscription-email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {/* Location selection */}
        <div className="subscription-location-heading">
          <label>Select Locations</label>
          <span>Choose one or more</span>
        </div>

        {loading ? (
          <p>Loading locations...</p>
        ) : (
          <div className="subscription-location-list">
            {locations.map((location) => (
              <label
                key={location.id}
                className="subscription-location-option"
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location.id)}
                  onChange={() =>
                    handleLocationChange(location.id)
                  }
                />

                <span>{location.name}</span>
              </label>
            ))}
          </div>
        )}

        {/* Weather alert preferences */}
        <div className="subscription-preferences">
          <div className="subscription-location-heading">
            <label>Weather Alert Preferences</label>
            <span>Choose the alerts you want to receive</span>
          </div>

          <div className="subscription-preference-list">
            <label className="subscription-preference-option">
              <input
                type="checkbox"
                checked={preferences.receiveHighTemperature}
                onChange={() =>
                  handlePreferenceChange("receiveHighTemperature")
                }
              />
              <span>🌡️ High Temperature Alerts</span>
            </label>

            <label className="subscription-preference-option">
              <input
                type="checkbox"
                checked={preferences.receiveLowTemperature}
                onChange={() =>
                  handlePreferenceChange("receiveLowTemperature")
                }
              />
              <span>🥶 Low Temperature Alerts</span>
            </label>

            <label className="subscription-preference-option">
              <input
                type="checkbox"
                checked={preferences.receiveHeavyRain}
                onChange={() =>
                  handlePreferenceChange("receiveHeavyRain")
                }
              />
              <span>🌧️ Heavy Rain Alerts</span>
            </label>

            <label className="subscription-preference-option">
              <input
                type="checkbox"
                checked={preferences.receiveStrongWind}
                onChange={() =>
                  handlePreferenceChange("receiveStrongWind")
                }
              />
              <span>💨 Strong Wind Alerts</span>
            </label>
          </div>
        </div>

        {message && (
          <p className="subscription-success">
            ✓ {message}
          </p>
        )}

        {error && (
          <p className="subscription-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            loading ||
            locations.length === 0
          }
        >
          {submitting
            ? "Subscribing..."
            : "Subscribe to Weather Alerts"}
        </button>
      </form>
    </section>
  );
}

export default EmailSubscription;
