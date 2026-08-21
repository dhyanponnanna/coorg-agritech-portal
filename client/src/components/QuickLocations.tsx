interface QuickLocationsProps {
  selectedLocation: string;
  onSelect: (location: string) => void;
}

const LOCATIONS = [
  "madikeri",
  "virajpet",
  "somwarpet",
  "ponnampet",
  "kushalnagar",
];

const LOCATION_NAMES: Record<string, string> = {
  madikeri: "Madikeri",
  virajpet: "Virajpet",
  somwarpet: "Somwarpet",
  ponnampet: "Ponnampet",
  kushalnagar: "Kushalnagar",
};

function QuickLocations({
  selectedLocation,
  onSelect,
}: QuickLocationsProps) {
  return (
    <div className="quick-locations">
      {LOCATIONS.map((location) => (
        <button
          key={location}
          type="button"
          className={`quick-location-button ${
  selectedLocation === location
    ? "active"
    : ""
}`}
          onClick={() => onSelect(location)}
          aria-pressed={selectedLocation === location}
        >
          {LOCATION_NAMES[location]}
        </button>
      ))}
    </div>
  );
}

export default QuickLocations;