export default function ListingHeader({ eyebrow, name, subtitle, tags = [] }) {
  return (
    <header className="listing-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{name}</h1>
      <p className="listing-subtitle">{subtitle}</p>
      <div className="tag-row">
        {tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
    </header>
  );
}
