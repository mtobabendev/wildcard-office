import ServiceCard from '../components/services/ServiceCard.jsx';
import GarageLink from '../components/layout/GarageLink.jsx';
import StartupPricing from '../components/services/StartupPricing.jsx';
import { services } from '../data/services.js';
import { secondChanceProgram } from '../data/founderProgram.js';

const categories = ['Web & App Builds', 'Repair / Remediation', 'Linux & Raspberry Pi', 'Automation', 'Troubleshooting', 'Custom Weirdness'];

export default function Services({ navigate }) {
  return (
    <section className="section-shell page-shell">
      <header className="page-heading">
        <p className="eyebrow">SERVICE DESK // REAL WORK ORDERS</p>
        <h1>Services</h1>
        <p>Builds, repairs, troubleshooting, automation, Linux/Pi work, and the technical problems that do not fit ordinary support menus.</p>
      </header>

      <div className="category-strip" aria-label="Service categories">
        {categories.map((category) => <span key={category}>{category}</span>)}
      </div>

      <div className="collection-grid">
        {services.map((service) => <ServiceCard key={service.id} service={service} navigate={navigate} />)}
      </div>

      <StartupPricing navigate={navigate} />

      <section className="second-chance-service-panel" aria-labelledby="second-chance-service-heading">
        <p className="eyebrow">SECOND-CHANCE FOUNDER PROGRAM</p>
        <h2 id="second-chance-service-heading">{secondChanceProgram.headline}</h2>
        <p>{secondChanceProgram.supportingLine}</p>
        <p>RISE graduates and justice-impacted founders are welcome to ask about case-by-case sliding-scale consideration, reduced deposits, milestone structures, and limited sponsored-build capacity.</p>
        <GarageLink href="/second-chance" navigate={navigate} className="button button-secondary">Ask About Second-Chance Pricing</GarageLink>
      </section>

      <div className="cta-panel">
        <p className="eyebrow">ODD PROBLEM?</p>
        <h2>Bring the thing that does not fit a dropdown.</h2>
        <GarageLink href="/quote" navigate={navigate} className="button button-primary">Start a Quote Request</GarageLink>
      </div>
    </section>
  );
}
