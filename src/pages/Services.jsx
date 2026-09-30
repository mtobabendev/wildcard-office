import ServiceCard from '../components/services/ServiceCard.jsx';
import GarageLink from '../components/layout/GarageLink.jsx';
import { services } from '../data/services.js';

const categories = ['Web & App Builds', 'Repair / Remediation', 'Linux & Raspberry Pi', 'Automation', 'Custom Weirdness'];

export default function Services({ navigate }) {
  return (
    <section className="section-shell page-shell">
      <header className="page-heading">
        <p className="eyebrow">SERVICE DESK // WORK ORDERS</p>
        <h1>Services</h1>
        <p>Technical work is scoped like a job, not tossed into a generic product cart.</p>
      </header>

      <div className="category-strip" aria-label="Future service categories">
        {categories.map((category) => <span key={category}>{category}</span>)}
      </div>

      <div className="collection-grid">
        {services.map((service) => <ServiceCard key={service.id} service={service} navigate={navigate} />)}
      </div>

      <div className="cta-panel">
        <p className="eyebrow">ODD PROBLEM?</p>
        <h2>Bring the thing that does not fit a dropdown.</h2>
        <GarageLink href="/quote" navigate={navigate} className="button button-primary">Start a Quote Request</GarageLink>
      </div>
    </section>
  );
}
