export const analyzeCurrentConditions = ({
  temperature,
  humidity,
  precipitation,
  rain,
}) => {
  const recommendations = [];

  let rainfallRisk = "LOW";
  let humidityRisk = "LOW";
  let sprayingSuitability = "SUITABLE";

  // Rainfall risk
  if (rain >= 10 || precipitation >= 10) {
    rainfallRisk = "HIGH";
  } else if (rain > 2 || precipitation > 2) {
    rainfallRisk = "MODERATE";
  }

  // Humidity risk
  if (humidity >= 90) {
    humidityRisk = "HIGH";
  } else if (humidity >= 80) {
    humidityRisk = "MODERATE";
  }

  // Spraying suitability
  if (rainfallRisk === "HIGH" || rain > 2) {
    sprayingSuitability = "NOT_SUITABLE";

    recommendations.push(
      "Avoid spraying because rainfall may wash away the application."
    );
  } else if (humidityRisk === "HIGH") {
    sprayingSuitability = "CAUTION";

    recommendations.push(
      "High humidity detected. Consider postponing spraying if conditions remain humid."
    );
  } else {
    recommendations.push(
      "Current conditions are generally suitable for spraying."
    );
  }

  return {
    rainfallRisk,
    humidityRisk,
    sprayingSuitability,
    recommendations,
    conditions: {
      temperature,
      humidity,
      precipitation,
      rain,
    },
  };
};