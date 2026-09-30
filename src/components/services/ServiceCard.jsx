import GarageLink from '../layout/GarageLink.jsx';

function pricingLabel(service) {
  if (service.pricingModel === 'hourly') return '$' + service.startingPrice + ' / HOUR';
  return 'QUOTE REQUIRED';
}

export default function ServiceCard({ service, navigate }) {
  return (
    <article className="listing-card service-card">
      <div className="card-topline"><span>WORK ORDER</span><span>{pricingLabel(service)}</span></div>
      <h3>{service.name}</h3>
      <p className="card-subtitle">{service.subtitle}</p>
      <p>{service.description}</p>
      <div className="tag-row">
        {service.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <GarageLink href={'/services/' + service.slug} navigate={navigate} className="button button-secondary">
        Inspect Service
      </GarageLink>
    </article>
  );
}
