import ProductCard from '../components/store/ProductCard.jsx';
import GarageLink from '../components/layout/GarageLink.jsx';
import { products } from '../data/products.js';

export default function Merchandise({ navigate }) {
  return (
    <section className="section-shell page-shell">
      <header className="page-heading">
        <p className="eyebrow">PARTS CAGE // GARAGE STOCK</p>
        <h1>Merchandise</h1>
        <p>Production-capable catalog mechanics for future Owner-approved Garage stock. No real product, price, or inventory is invented here.</p>
      </header>

      <div className="collection-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} navigate={navigate} />)}
      </div>

      <div className="cta-panel">
        <p className="eyebrow">CART BAY</p>
        <h2>Review configured items before checkout.</h2>
        <GarageLink href="/cart" navigate={navigate} className="button button-secondary">Open Cart</GarageLink>
      </div>
    </section>
  );
}
