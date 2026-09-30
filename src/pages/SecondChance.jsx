import GarageLink from '../components/layout/GarageLink.jsx';
import StartupPricing from '../components/services/StartupPricing.jsx';
import { secondChanceProgram } from '../data/founderProgram.js';

export default function SecondChance({ navigate }) {
  const program = secondChanceProgram;
  return (
    <section className="section-shell page-shell second-chance-page">
      <header className="second-chance-hero">
        <p className="eyebrow">SECOND CHANCE // OPEN BAY</p>
        <h1>{program.headline}</h1>
        <p className="second-chance-lede">{program.supportingLine}</p>
        <p>{program.founderContext}</p>
        <div className="hero-actions">
          <GarageLink href="/quote?secondChanceProgram=yes" navigate={navigate} className="button button-primary">Start a Work Order</GarageLink>
          <GarageLink href="/services" navigate={navigate} className="button button-secondary">Talk to the Garage</GarageLink>
        </div>
      </header>

      <div className="program-grid">
        <article className="program-card">
          <p className="panel-kicker">WHAT THIS IS</p>
          <h2>Founder-to-founder runway.</h2>
          <p>This program creates a practical path for qualified founders who have a real project but may need a different starting structure. It is not a coupon, charity tier, or reduced standard of work.</p>
        </article>

        <article className="program-card">
          <p className="panel-kicker">WHO IT'S FOR</p>
          <h2>Founders rebuilding and moving forward.</h2>
          <ul>{program.whoItsFor.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>

        <article className="program-card">
          <p className="panel-kicker">HOW PRICING WORKS</p>
          <h2>Flexible structure, real scope.</h2>
          <ul>{program.consideration.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="fine-print">{program.availabilityNote}</p>
        </article>

        <article className="program-card">
          <p className="panel-kicker">WHAT WE DON'T ASK FOR</p>
          <h2>No case file required.</h2>
          <p>{program.privacyLine}</p>
          <p>We do not ask for conviction type, charges, inmate or DOC numbers, parole or probation details, sentence details, background-check paperwork, or proof of incarceration.</p>
        </article>
      </div>

      <section className="standards-panel" aria-labelledby="standards-heading">
        <p className="eyebrow">SAME SHOP // DIFFERENT RUNWAY</p>
        <h2 id="standards-heading">The standard does not change.</h2>
        <div className="standards-grid">
          <div><h3>Same standards</h3><ul>{program.sameStandards.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>Different runway</h3><ul>{program.differentRunway.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <StartupPricing navigate={navigate} />

      <section className="cta-panel second-chance-cta">
        <p className="eyebrow">REBUILD BAY // FOUNDERS WELCOME</p>
        <h2>Build the next thing.</h2>
        <p>You do not need to retell your history. Tell us what you are trying to build.</p>
        <GarageLink href="/quote?secondChanceProgram=yes" navigate={navigate} className="button button-primary">Start a Work Order</GarageLink>
      </section>
    </section>
  );
}
