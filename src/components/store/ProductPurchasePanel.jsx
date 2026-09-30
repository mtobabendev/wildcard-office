import QuantityControl from '../listing/QuantityControl.jsx';
import { formatMoney, isCheckoutEligible, statusLabel } from '../../data/products.js';

export default function ProductPurchasePanel({
  product,
  quantity,
  setQuantity,
  selections,
  computedPrice,
  onAdd,
}) {
  const eligible = isCheckoutEligible(product);
  const referenceOnly = product.status === 'demo';
  const canAdd = eligible || referenceOnly;

  return (
    <aside className="purchase-panel" aria-label="Product configuration controls">
      <p className="panel-kicker">PARTS CAGE // CONFIGURATION</p>
      <p className={computedPrice == null ? 'catalog-status large-status' : 'price-line'}>
        {computedPrice == null ? statusLabel(product.status) : formatMoney(computedPrice, product.currency)}
      </p>
      <p className="availability">{statusLabel(product.status)}</p>
      <QuantityControl quantity={quantity} onChange={setQuantity} />
      <button
        type="button"
        className="button button-primary full-width"
        onClick={onAdd}
        disabled={!canAdd}
      >
        {referenceOnly ? 'Add Reference Configuration to Cart' : eligible ? 'Add to Cart' : 'Not Available for Cart'}
      </button>
      <p className="fine-print">
        {referenceOnly
          ? 'Reference item only. It cannot create a Square checkout or charge.'
          : 'Payment information is collected only on Square-hosted checkout.'}
      </p>
      <SelectedOptions selections={selections} groups={product.optionGroups} />
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
