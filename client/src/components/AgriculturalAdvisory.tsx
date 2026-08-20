import type { CurrentWeather } from "../services/weatherApi";

interface AgriculturalAdvisoryProps {
  weather: CurrentWeather;
}

function AgriculturalAdvisory({
  weather,
}: AgriculturalAdvisoryProps) {
  const analysis = weather.agriculturalAnalysis;

  return (
    <section>
      <h2>Agricultural Conditions</h2>

      <div>
        <article>
          <span>🌧️ Rainfall Risk</span>
          <strong>{analysis.rainfallRisk}</strong>
        </article>

        <article>
          <span>💧 Humidity Risk</span>
          <strong>{analysis.humidityRisk}</strong>
        </article>

        <article>
          <span>🚜 Spraying</span>
          <strong>
            {analysis.sprayingSuitability}
          </strong>
        </article>
      </div>

      {analysis.recommendations.length > 0 && (
        <div>
          <h3>Recommendations</h3>

          <ul>
            {analysis.recommendations.map(
              (recommendation, index) => (
                <li key={index}>
                  {recommendation}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
}

export default AgriculturalAdvisory;