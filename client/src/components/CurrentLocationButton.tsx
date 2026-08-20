import { useState } from "react";

interface CurrentLocationButtonProps {
  onLocationFound: (
    latitude: number,
    longitude: number
  ) => void;
}

function CurrentLocationButton({
  onLocationFound,
}: CurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =
          position.coords;

        onLocationFound(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        setLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location permission was denied.");
            break;

          case error.POSITION_UNAVAILABLE:
            setError("Unable to determine your location.");
            break;

          case error.TIMEOUT:
            setError("Location request timed out.");
            break;

          default:
            setError("Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={loading}
      >
        {loading
          ? "Getting location..."
          : "📍 Use My Current Location"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}

export default CurrentLocationButton;