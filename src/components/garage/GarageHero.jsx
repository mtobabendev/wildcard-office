import GarageLink from '../layout/GarageLink.jsx';

export default function GarageHero({ navigate }) {
  return (
    <section className="garage-hero section-shell" aria-labelledby="garage-title">
      <div className="hero-copy">
        <p className="eyebrow">WILDCARD DEV // BAY 006</p>
        <h1 id="garage-title">PENNY'S GARAGE</h1>
        <p className="hero-lede">We fix things. We build things. Occasionally we create problems worth keeping.</p>
        <div className="hero-actions">
          <GarageLink href="/services" navigate={navigate} className="button button-primary">Services</GarageLink>
          <GarageLink href="/merch" navigate={navigate} className="button button-secondary">Shop the Garage</GarageLink>
          <GarageLink href="/quote" navigate={navigate} className="text-link">Bring me something weird →</GarageLink>
        </div>
      </div>
      <div className="hero-instrument" aria-label="Decorative garage schematic">
        <span className="instrument-label">BENCH 01</span>
        <div className="schematic-ring" aria-hidden="true">
          <span>W</span><span>D</span><span>6</span>
        </div>
        <p>Industrial service bay<br />Experimental systems<br />Owner-gated work</p>
      </div>
    </section>
  );
}
