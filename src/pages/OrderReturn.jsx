import GarageLink from '../components/layout/GarageLink.jsx';

export default function OrderReturn({ mode, navigate }) {
  const success = mode === 'success';

  return (
    <section className="section-shell page-shell order-return">
      <p className="eyebrow">SQUARE CHECKOUT // RETURN PATH</p>
      <h1>{success ? 'Back from Square.' : 'Checkout interrupted.'}</h1>
      <p>
        {success
          ? 'Square returned you to Penny\'s Garage. Payment confirmation is being verified. This page alone does not prove that payment completed.'
          : 'No payment completion is claimed here. Your local cart may still be available if you return to it.'}
      </p>
      <div className="hero-actions">
        <GarageLink href="/cart" navigate={navigate} className="button button-primary">Return to Cart</GarageLink>
        <GarageLink href="/merch" navigate={navigate} className="button button-secondary">Browse Merchandise</GarageLink>
      </div>
      <p className="fine-print">Trusted payment verification and persistent order history require a separately Owner-gated order/webhook stage.</p>
    </section>
  );
}
