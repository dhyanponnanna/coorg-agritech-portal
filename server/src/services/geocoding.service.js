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