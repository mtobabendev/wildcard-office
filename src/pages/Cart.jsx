import { useMemo, useState } from 'react';
import GarageLink from '../components/layout/GarageLink.jsx';
import QuantityControl from '../components/listing/QuantityControl.jsx';
import {
  calculateProductUnitPrice,
  formatMoney,
  getProduct,
  isCheckoutEligible,
  selectionLabels,
  statusLabel,
  validateSelections,
} from '../data/products.js';

export default function Cart({ cart, updateQuantity, removeFromCart, navigate }) {
  const [checkoutState, setCheckoutState] = useState({ type: 'idle', message: '' });

  const resolved = useMemo(() => cart.map((item) => {
    const product = getProduct(item.productId);
    const unitPrice = product && validateSelections(product, item.selections)
      ? calculateProductUnitPrice(product, item.selections)
      : null;
    return {
      ...item,
      product,
      unitPrice,
      eligible: isCheckoutEligible(product) && unitPrice != null,
    };
  }).filter((item) => item.product), [cart]);

  const allEligible = resolved.length > 0 && resolved.every((item) => item.eligible);
  const subtotal = allEligible
    ? resolved.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    : null;

  const checkout = async () => {
    if (!allEligible || checkoutState.type === 'loading') return;

    setCheckoutState({ type: 'loading', message: 'Creating secure Square checkout…' });

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: resolved.map((item) => ({
            productId: item.productId,
            selections: item.selections,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Square checkout is unavailable right now.');
      }

      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setCheckoutState({
        type: 'error',
        message: error.message || 'Square checkout is unavailable. Your cart is still here.',
      });
    }
  };

  if (!resolved.length) {
    return (
      <section className="section-shell page-shell empty-state">
        <p className="eyebrow">CART // PARTS CAGE</p>
        <h1>Parts cage is empty.</h1>
        <p>Add an available product configuration when real Garage stock is approved.</p>
        <GarageLink href="/merch" navigate={navigate} className="button button-primary">Browse Merchandise</GarageLink>
      </section>
    );
  }

  return (
    <section className="section-shell page-shell">
      <header className="page-heading">
        <p className="eyebrow">CART // SECURE CHECKOUT STAGING</p>
        <h1>Cart</h1>
        <p>Penny's Garage validates product identifiers, options, quantities, and prices again on the server. Card details are entered only on Square.</p>
      </header>

      <div className="cart-list">
        {resolved.map((item) => (
          <article className="cart-item" key={item.key}>
            <div>
              <p className="eyebrow">{statusLabel(item.product.status)}</p>
              <h2>{item.product.name}</h2>
              <p>{item.product.subtitle}</p>
              <dl className="cart-options">
                {selectionLabels(item.product, item.selections).map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
              <p className="cart-unit-price">
                {item.unitPrice == null ? statusLabel(item.product.status) : 'Unit: ' + formatMoney(item.unitPrice, item.product.currency)}
              </p>
            </div>
            <div>
              <QuantityControl quantity={item.quantity} onChange={(quantity) => updateQuantity(item.key, quantity)} />
              <p className="line-subtotal">
                {item.unitPrice == null ? 'NOT FOR SALE' : formatMoney(item.unitPrice * item.quantity, item.product.currency)}
              </p>
            </div>
            <button type="button" className="text-button" onClick={() => removeFromCart(item.key)}>Remove</button>
          </article>
        ))}
      </div>

      <aside className="cart-summary">
        <span>SUBTOTAL</span>
        <strong>{subtotal == null ? 'CHECKOUT NOT AVAILABLE' : formatMoney(subtotal, 'USD')}</strong>
        <button
          type="button"
          className="button button-primary"
          disabled={!allEligible || checkoutState.type === 'loading'}
          onClick={checkout}
        >
          {checkoutState.type === 'loading' ? 'Creating Square Checkout…' : 'Checkout with Square'}
        </button>
        {!allEligible && <p className="fine-print full-span">Demo, coming-soon, sold-out, or invalid configurations cannot create a Square checkout.</p>}
        {checkoutState.message && (
          <p className={'checkout-status ' + checkoutState.type + ' full-span'} role="status" aria-live="polite">
            {checkoutState.message}
          </p>
        )}
      </aside>
    </section>
  );
}
