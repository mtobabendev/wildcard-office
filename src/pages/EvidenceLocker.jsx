import EvidenceCard from '../components/evidence/EvidenceCard.jsx';

const records = [
  ['006-A', 'PROTOTYPE', 'ARCHIVED', 'Bench prototype', 'A reserved slot for a strange build worth documenting.'],
  ['006-B', 'CLASSIFIED', 'SEALED', 'Experimental catalog', 'Future artifacts, curiosities, and one-off garage finds live here.'],
  ['006-C', 'LIMITED RUN', 'HOLD', 'Special inventory', 'No real inventory has been approved for this evidence number.'],
];

export default function EvidenceLocker() {
  return (
    <section className="section-shell page-shell evidence-locker">
      <header className="page-heading">
        <p className="eyebrow">ARCHIVE // CONTRABAND SHELF // PROTOTYPE LOCKER</p>
        <h1>Evidence Locker</h1>
        <p>Experimental builds, archived curiosities, limited runs, and future special inventory. Placeholder records only.</p>
      </header>
      <div className="evidence-grid">
        {records.map(([number, classification, status, title, copy]) => (
          <EvidenceCard key={number} number={number} classification={classification} status={status} title={title}>{copy}</EvidenceCard>
        ))}
      </div>
    </section>
  );
}
