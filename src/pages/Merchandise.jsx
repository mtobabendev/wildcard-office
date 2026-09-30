import ProductCard from '../components/store/ProductCard.jsx';
import GarageLink from '../components/layout/GarageLink.jsx';
import { products } from '../data/products.js';

export default function Merchandise({ navigate }) {
  return (
    <section className="section-shell page-shell">
      <header className="page-heading">
        <p className="eyebrow">PARTS CAGE // STOREFRONT SHELL</p>
        <h1>Merchandise</h1>
        <p>WildCard gear, digital goods, garage finds, and experimental items will live here after approval.</p>
      </header>

      <div className="filter-reserve" aria-label="Reserved future filtering controls">
        <span>SEARCH / FILTER BAY</span>
        <span>Reserved for a later stage</span>
      </div>

      <div className="collection-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} navigate={navigate} />)}
      </div>

      <GarageLink href="/cart" navigate={navigate} className="text-link">Open demo cart →</GarageLink>
    </section>
  );
}
