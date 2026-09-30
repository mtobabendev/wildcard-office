export default function QuantityControl({ quantity, onChange, label = 'Quantity' }) {
  return (
    <div className="quantity-control">
      <span>{label}</span>
      <div>
        <button type="button" onClick={() => onChange(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
        <output aria-live="polite">{quantity}</output>
        <button type="button" onClick={() => onChange(quantity + 1)} aria-label="Increase quantity">+</button>
      </div>
    </div>
  );
}
