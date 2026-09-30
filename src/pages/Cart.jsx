import GarageLink from '../components/layout/GarageLink.jsx';
import QuantityControl from '../components/listing/QuantityControl.jsx';

export default function Cart({ cart, updateQuantity, removeFromCart, navigate }) {
  const subtotal = cart.reduce((sum, item) => {
    const optionTotal = item.product.optionGroups.reduce((total, group) => {
      const option = group.options.find((candidate) => candidate.id === item.selections[group.id]);
      return total + (option?.priceModifier || 0);
    }, item.product.price);
    return sum + optionTotal * item.quantity;
  }, 0);

  if (!cart.length) {
    return (
      <section className="section-shell page-shell empty-state">
        <p className="eyebrow">CART // LOCAL DEMO STATE</p>
        <h1>Parts cage is empty.</h1>
        <p>Add the demo listing if you want to exercise the local cart mechanics.</p>
        <GarageLink href="/merch" navigate={navigate} className="button button-primary">Browse Demo Merchandise</GarageLink>
      </section>
    );
  }

  return (
    <section className="section-shell page-shell">
      <header className="page-heading">
        <p className="eyebrow">CART // LOCAL DEMO STATE</p>
        <h1>Cart</h1>
        <p>No checkout, payment, shipping, tax, promo code, account, or inventory service exists.</p>
      </header>

      <div className="cart-list">
        {cart.map((item) => (
          <article className="cart-item" key={item.key}>
            <div>
              <p className="eyebrow">DEMO ITEM</p>
              <h2>{item.product.name}</h2>
              <p>{item.product.subtitle}</p>
            </div>
            <QuantityControl quantity={item.quantity} onChange={(quantity) => updateQuantity(item.key, quantity)} />
            <button type="button" className="text-button" onClick={() => removeFromCart(item.key)}>Remove</button>
          </article>
        ))}
      </div>

      <aside className="cart-summary">
        <span>DEMO SUBTOTAL</span>
        <strong>{'$'}{subtotal.toFixed(2)}</strong>
        <button type="button" className="button button-secondary" disabled>Checkout Coming Soon</button>
      </aside>
    </section>
  );
}
