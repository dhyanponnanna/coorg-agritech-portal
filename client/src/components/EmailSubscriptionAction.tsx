
import { useEffect, useRef, useState } from "react";

import {
  verifyEmailSubscription,
  unsubscribeFromWeatherAlerts,
} from "../services/weatherApi";

import "../App.css";

function EmailSubscriptionAction() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const hasProcessed = useRef(false);
  const pathname = window.location.pathname;

  useEffect(() => {
    if (hasProcessed.current) return;

    hasProcessed.current = true;

    const processAction = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const pathname = window.location.pathname;

      if (!token) {
        setError("Invalid link. No token was provided.");
        setLoading(false);
        return;
      }

      try {
        let response;

        if (pathname === "/verify-email") {
          response = await verifyEmailSubscription(token);
        } else if (pathname === "/unsubscribe") {
          response = await unsubscribeFromWeatherAlerts(token);
        } else {
          setError("Invalid request.");
          return;
        }

        setMessage(response.message);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    processAction();
  }, []);

  return (
    <main className="subscription-action-page">
      <div className="subscription-action-card">
        <div className="subscription-action-icon">
          {loading ? "⏳" : error ? "⚠️" : "✓"}
        </div>

        <h1>
          {loading
            ? "Processing..."
          : error
            ? "Something went wrong"
          : pathname === "/verify-email"
            ? "Email Verified!"
          : "Unsubscribed Successfully"}
        </h1>

        {loading && (
          <p>Please wait while we process your request.</p>
        )}

        {message && (
          <p className="action-success">{message}</p>
        )}

        {error && (
          <p className="action-error">{error}</p>
        )}

        {!loading && (
          <a href="/" className="action-home-button">
            Return to Weather Dashboard
          </a>
        )}
      </div>
    </main>
  );
}

export default EmailSubscriptionAction;
