import GarageLink from '../layout/GarageLink.jsx';
import { formatMoney, statusLabel } from '../../data/products.js';

export default function ProductCard({ product, navigate }) {
  const price = formatMoney(product.basePrice, product.currency);

  return (
    <article className="listing-card product-card">
      <div className="card-topline"><span>GARAGE STOCK</span><span>{statusLabel(product.status)}</span></div>
      <div className="product-card-media">
        {product.media[0]?.type === 'image'
          ? <img src={product.media[0].src} alt={product.media[0].alt} />
          : <div className="media-placeholder">PRODUCT MEDIA</div>}
      </div>
      <h3>{product.name}</h3>
      <p className="card-subtitle">{product.subtitle}</p>
      <p>{product.description}</p>
      <p className={price ? 'catalog-price' : 'catalog-status'}>{price || statusLabel(product.status)}</p>
      <GarageLink href={'/merch/' + product.slug} navigate={navigate} className="button button-secondary">
        Open Listing
      </GarageLink>
    </article>
  );
}
