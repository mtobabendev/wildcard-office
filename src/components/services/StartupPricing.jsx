import GarageLink from '../layout/GarageLink.jsx';
import { secondChanceProgram, startupPricing } from '../../data/founderProgram.js';

export default function StartupPricing({ navigate }) {
  return (
    <section className="startup-pricing" aria-labelledby="startup-pricing-heading">
      <div className="section-heading">
        <p className="eyebrow">STARTUP PRICING // CLEAR ENTRY POINTS</p>
        <h2 id="startup-pricing-heading">Start lean. Build the right thing.</h2>
        <p>These are starting prices, not fixed bids. Final scope and pricing are agreed before work begins, and larger or more complex projects cost more.</p>
      </div>
      <div className="pricing-grid">
        {startupPricing.map((tier) => (
          <article className="pricing-card" key={tier.id}>
            <p className="panel-kicker">{tier.name}</p>
            <h3>{tier.priceLabel}</h3>
            <p>{tier.description}</p>
          </article>
        ))}
      </div>
      <div className="program-link-panel">
        <div>
          <p className="eyebrow">SECOND-CHANCE / RISE PRICING AVAILABLE</p>
          <h3>{secondChanceProgram.supportingLine}</h3>
          <p>Justice-impacted founders and RISE graduates may ask about flexible pricing structures without being treated as lesser clients.</p>
        </div>
        <GarageLink href="/second-chance" navigate={navigate} className="button button-secondary">
          Ask About Second-Chance Pricing
        </GarageLink>
      </div>
    </section>
  );
}
