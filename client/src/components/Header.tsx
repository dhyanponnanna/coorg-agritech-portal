function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <p className="brand-eyebrow">
          KODAGU • AGRICULTURAL INTELLIGENCE
        </p>

        <h1>Coorg Agri-Tech</h1>

        <p className="brand-description">
          Weather intelligence and agricultural insights
          for Kodagu.
        </p>
      </div>

      <div className="header-status">
        <span className="status-dot" />
        <span>Weather</span>
      </div>
    </header>
  );
}

export default Header;