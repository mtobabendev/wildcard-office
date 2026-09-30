import GarageLink from '../layout/GarageLink.jsx';

export default function RelatedListings({ relatedIds, records, basePath, navigate }) {
  const related = relatedIds.map((id) => records.find((record) => record.id === id)).filter(Boolean);
  if (!related.length) return null;

  return (
    <section className="related-listings" aria-labelledby="related-heading">
      <p className="eyebrow">ALSO ON THE BENCH</p>
      <h2 id="related-heading">Related listings</h2>
      <div className="related-grid">
        {related.map((item) => (
          <GarageLink key={item.id} href={basePath + '/' + item.slug} navigate={navigate} className="related-card">
            <strong>{item.name}</strong>
            <span>{item.subtitle}</span>
          </GarageLink>
        ))}
      </div>
    </section>
  );
}
