import GarageLink from '../components/layout/GarageLink.jsx';

export default function NotFound({ navigate, eyebrow = 'GARAGE ROUTING ERROR' }) {
  return (
    <section className="section-shell page-shell empty-state">
      <p className="eyebrow">{eyebrow}</p>
      <h1>That bay does not exist.</h1>
      <p>No substitute listing was shown. Penny refuses to hand you the wrong wrench.</p>
      <GarageLink href="/" navigate={navigate} className="button button-primary">Return to Garage</GarageLink>
    </section>
  );
}
