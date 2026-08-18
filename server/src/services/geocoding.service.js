import { searchLocationsInDatabase } from "../repositories/weather.repository.js";

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/reverse";

export const reverseGeocode = async (latitude, longitude) => {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    const error = new Error("Invalid latitude or longitude");
    error.statusCode = 400;
    throw error;
  }

  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: "jsonv2",
    zoom: "18",
    addressdetails: "1",
    "accept-language": "en",
  });

  const response = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
      "User-Agent":
        "CoorgAgriTechPortal/1.0 (personal GitHub project)",
    },
  });

  if (!response.ok) {
    const error = new Error("Reverse geocoding service failed");
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  return {
    displayName: data.display_name,
    latitude: Number(data.lat),
    longitude: Number(data.lon),
    address: {
      road: data.address?.road || null,
      village: data.address?.village || null,
      town: data.address?.town || null,
      city: data.address?.city || null,
      district: data.address?.county || null,
      state: data.address?.state || null,
      postcode: data.address?.postcode || null,
      country: data.address?.country || null,
    },
  };
};

const NOMINATIM_SEARCH_URL =
  "https://nominatim.openstreetmap.org/search";

export const searchLocations = async (query) => {
  const searchQuery = query?.trim();

  if (!searchQuery || searchQuery.length < 2) {
    const error = new Error(
      "Search query must contain at least 2 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  const localLocations = await searchLocationsInDatabase(
  searchQuery
);

if (localLocations.length > 0) {
  return localLocations.map((location) => ({
    name: location.name,
    displayName: `${location.name}, Kodagu, Karnataka, India`,
    latitude: location.latitude,
    longitude: location.longitude,
    address: {
      village: null,
      town: location.name,
      city: null,
      district: "Kodagu",
      state: "Karnataka",
      country: "India",
    },
    source: "local",
  }));
}

  const params = new URLSearchParams({
    q: searchQuery,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    "accept-language": "en",
  });

  const response = await fetch(
    `${NOMINATIM_SEARCH_URL}?${params}`,
    {
      headers: {
        "User-Agent":
          "CoorgAgriTechPortal/1.0 (personal GitHub project)",
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "Location search service failed"
    );
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  return data.map((result) => ({
    name:
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.name ||
      "Unknown location",

    displayName: result.display_name,

    latitude: Number(result.lat),
    longitude: Number(result.lon),

    address: {
      village: result.address?.village || null,
      town: result.address?.town || null,
      city: result.address?.city || null,
      district: result.address?.county || null,
      state: result.address?.state || null,
      country: result.address?.country || null,
    },
  }));
};