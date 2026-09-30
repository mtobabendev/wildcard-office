export default function EvidenceCard({ number, classification, status, title, children }) {
  return (
    <article className="evidence-card">
      <div className="evidence-stamp">EVIDENCE {number}</div>
      <p className="classification">{classification}</p>
      <h3>{title}</h3>
      <p>{children}</p>
      <div className="evidence-status">STATUS: {status}</div>
    </article>
  );
}
