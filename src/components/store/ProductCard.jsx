import GarageLink from '../layout/GarageLink.jsx';
import SuitBadge from './SuitBadge.jsx';
import WildCardCardFrame from './WildCardCardFrame.jsx';
import { formatMoney, statusLabel } from '../../data/products.js';

export default function ProductCard({ product, navigate }) {
  const price = formatMoney(product.basePrice, product.currency);
  const primaryImage = product.viewer?.mainFrames?.[0] || product.media?.[0];

  return (
    <WildCardCardFrame
      as="article"
      suit={product.displaySuit}
      label={product.displayLabel}
      status={statusLabel(product.status)}
      className="listing-card product-card wildcard-product-card"
    >
      <div className="product-card-heading">
        <SuitBadge suit={product.displaySuit} label={product.displayLabel} />
      </div>

      <div className="product-card-media">
        {primaryImage?.src
          ? <img src={primaryImage.src} alt={primaryImage.alt || product.name} loading="lazy" />
          : <div className="media-placeholder">PRODUCT MEDIA</div>}
      </div>

      <h3>{product.name}</h3>
      <p className="card-subtitle">{product.subtitle}</p>
      <p>{product.description}</p>
      <p className={price ? 'catalog-price' : 'catalog-status'}>{price || statusLabel(product.status)}</p>

      <GarageLink href={'/merch/' + product.slug} navigate={navigate} className="button button-secondary">
        Open Listing
      </GarageLink>
    </WildCardCardFrame>
  );
}
