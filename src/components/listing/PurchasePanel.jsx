import GarageLink from '../layout/GarageLink.jsx';
import QuantityControl from './QuantityControl.jsx';

export function ProductPurchasePanel({ product, quantity, setQuantity, selections, computedPrice, onAdd }) {
  return (
    <aside className="purchase-panel" aria-label="Demo purchase controls">
      <p className="panel-kicker">PARTS CAGE // DEMO CONTROLS</p>
      <p className="price-line">DEMO {'$'}{computedPrice.toFixed(2)}</p>
      {product.compareAtPrice && <p className="compare-price">DEMO {'$'}{product.compareAtPrice.toFixed(2)}</p>}
      <p className="availability"><span aria-hidden="true">●</span> {product.status}</p>
      <QuantityControl quantity={quantity} onChange={setQuantity} />
      <button type="button" className="button button-primary full-width" onClick={onAdd}>Add Demo Item to Cart</button>
      <p className="fine-print">Local demo state only. No checkout, payment, shipping, tax, or inventory service exists.</p>
      <SelectedOptions selections={selections} groups={product.optionGroups} />
    </aside>
  );
}

export function ServiceActionPanel({ service, selections, navigate }) {
  const params = new URLSearchParams({ service: service.slug });
  Object.entries(selections).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const quoteHref = '/quote?' + params.toString();

  return (
    <aside className="purchase-panel" aria-label="Service request controls">
      <p className="panel-kicker">WORK ORDER // INTAKE PATH</p>
      <p className="price-line">
        {service.pricingModel === 'hourly' ? '$' + service.startingPrice + ' / HOUR' : 'QUOTE REQUIRED'}
      </p>
      {service.turnaround && <p><strong>Typical turnaround:</strong> {service.turnaround}</p>}
      <SelectedOptions selections={selections} groups={service.optionGroups} />
      <GarageLink href={quoteHref} navigate={navigate} className="button button-primary full-width">Request This Job</GarageLink>
      <p className="fine-print">Submitting intake requests a review only. Scope and pricing must be agreed before work begins, and no charge occurs from submitting the form.</p>
    </aside>
  );
}

function SelectedOptions({ selections, groups = [] }) {
  const selectedRows = groups
    .map((group) => {
      const selected = group.options.find((option) => option.id === selections[group.id]);
      return selected ? [group.label, selected.label] : null;
    })
    .filter(Boolean);

  if (!selectedRows.length) return null;

  return (
    <dl className="selected-options">
      {selectedRows.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  );
}
