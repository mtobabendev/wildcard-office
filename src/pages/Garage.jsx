import GarageHero from '../components/garage/GarageHero.jsx';
import PennyTerminal from '../components/garage/PennyTerminal.jsx';
import GarageLink from '../components/layout/GarageLink.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';
import ProductCard from '../components/store/ProductCard.jsx';
import EvidenceCard from '../components/evidence/EvidenceCard.jsx';
import { services } from '../data/services.js';
import { products } from '../data/products.js';

const workbench = ['Web & App Builds', 'Repair / Remediation', 'Linux & Raspberry Pi', 'Automation', 'Custom Weirdness'];

export default function Garage({ navigate }) {
  return (
    <>
      <GarageHero navigate={navigate} />

      <section className="section-shell" aria-labelledby="workbench-heading">
        <div className="section-heading">
          <p className="eyebrow">WORKBENCH</p>
          <h2 id="workbench-heading">Bring the problem. We'll find the wrench.</h2>
        </div>
        <div className="workbench-grid">
          {workbench.map((item, index) => (
            <article key={item} className="workbench-module">
              <span className="module-index">0{index + 1}</span>
              <h3>{item}</h3>
              <p>Future service bay. No public pricing assigned in this stage.</p>
            </article>
          ))}
        </div>
        <GarageLink href="/services" navigate={navigate} className="text-link">Open all work orders →</GarageLink>
      </section>

      <section className="section-shell split-section" aria-labelledby="parts-heading">
        <div>
          <p className="eyebrow">PARTS CAGE</p>
          <h2 id="parts-heading">Merchandise shell</h2>
          <p>One controlled demo listing proves the mechanics without inventing a catalog.</p>
          <GarageLink href="/merch" navigate={navigate} className="text-link">Enter the parts cage →</GarageLink>
        </div>
        <ProductCard product={products[0]} navigate={navigate} />
      </section>

      <section className="section-shell split-section" aria-labelledby="service-preview-heading">
        <ServiceCard service={services[0]} navigate={navigate} />
        <div>
          <p className="eyebrow">SERVICE DESK</p>
          <h2 id="service-preview-heading">Custom work lives on its own track.</h2>
          <p>Services use work-order mechanics and route toward quote intake instead of pretending every job is a box on a shelf.</p>
        </div>
      </section>

      <section className="section-shell" aria-labelledby="evidence-preview-heading">
        <div className="section-heading">
          <p className="eyebrow">EVIDENCE LOCKER</p>
          <h2 id="evidence-preview-heading">Prototypes, curiosities, limited runs.</h2>
        </div>
        <div className="evidence-grid">
          <EvidenceCard number="006-A" classification="EXPERIMENTAL" status="ARCHIVED" title="Prototype slot">
            Reserved for strange builds and proof-of-concept hardware.
          </EvidenceCard>
          <EvidenceCard number="006-B" classification="GARAGE FIND" status="HOLD" title="Limited item slot">
            Reserved for one-offs and unusual inventory after Owner approval.
          </EvidenceCard>
        </div>
        <GarageLink href="/evidence" navigate={navigate} className="text-link">Unlock the archive →</GarageLink>
      </section>

      <section className="section-shell terminal-wrap">
        <PennyTerminal />
      </section>
    </>
  );
}
