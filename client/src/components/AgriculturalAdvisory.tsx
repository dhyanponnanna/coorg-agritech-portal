import type { CurrentWeather } from "../services/weatherApi";

interface AgriculturalAdvisoryProps {
  weather: CurrentWeather;
}

function AgriculturalAdvisory({
  weather,
}: AgriculturalAdvisoryProps) {
  const analysis = weather.agriculturalAnalysis;

  return (
    <section className="agriculture-section">
  <div className="agriculture-header">
    <div>
      <div className="section-label">
        FARM CONDITIONS
      </div>

      <h2>Agricultural Conditions</h2>
    </div>

    <span className="agriculture-mark">
      AGRI
    </span>
  </div>

  <div className="agriculture-grid">
    <article className="agriculture-item">
      <span className="agriculture-item-label">
        RAINFALL RISK
      </span>

      <strong>{analysis.rainfallRisk}</strong>

      <p>
        Based on current rainfall conditions.
      </p>
    </article>

    <article className="agriculture-item">
      <span className="agriculture-item-label">
        HUMIDITY RISK
      </span>

      <strong>{analysis.humidityRisk}</strong>

      <p>
        High humidity can increase crop disease risk.
      </p>
    </article>

    <article className="agriculture-item">
      <span className="agriculture-item-label">
        SPRAYING
      </span>

      <strong>{analysis.sprayingSuitability}</strong>

      <p>
        Consider weather conditions before spraying.
      </p>
    </article>
  </div>

  {analysis.recommendations.length > 0 && (
    <div className="field-note">
      <span className="field-note-label">
        FIELD NOTE
      </span>

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