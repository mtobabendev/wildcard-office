export default function DetailAccordion({ sections }) {
  return (
    <div className="detail-accordion">
      {sections.map((section) => (
        <details key={section.title}>
          <summary>{section.title}</summary>
          <div className="detail-copy">
            {Array.isArray(section.content)
              ? <ul>{section.content.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p>{section.content}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}
