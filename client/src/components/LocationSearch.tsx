import { useEffect, useState } from "react";
import {
  searchLocations,
  type LocationResult,
} from "../services/weatherApi";

interface LocationSearchProps {
  onLocationSelect: (
    location: LocationResult
  ) => void;
}

function LocationSearch({
  onLocationSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    LocationResult[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await searchLocations(
          query.trim()
        );

        setResults(response.data);
      } catch (error) {
        console.error(
          "Location search failed:",
          error
        );

        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a location..."
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
      />

      {loading && <p>Searching...</p>}

      {results.length > 0 && (
        <div>
          {results.map((location) => (
            <button
              key={`${location.latitude}-${location.longitude}`}
              type="button"
              onClick={() => {
                onLocationSelect(location);
                setQuery(location.name);
                setResults([]);
              }}
            >
              <strong>{location.name}</strong>
              <br />
              <small>
                {location.displayName}
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;