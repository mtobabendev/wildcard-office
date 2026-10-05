import GarageLink from '../layout/GarageLink.jsx';
import RotatableCardSurface from './RotatableCardSurface.jsx';
import SuitBadge from './SuitBadge.jsx';
import WildCardCardFrame from './WildCardCardFrame.jsx';
import { formatMoney, statusLabel } from '../../data/products.js';

const PENNY_FRONT = '/assets/products/penny-pillow/PennyMerchFront.png';
const PENNY_BACK = '/assets/products/penny-pillow/PennyMerchBack.png';

function CatalogProductFace({
  imageSrc,
  imageAlt,
  product,
  price,
  navigate,
  showAction = false,
}) {
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
        {imageSrc
          ? <img src={imageSrc} alt={imageAlt || product.name} loading="lazy" draggable="false" />
          : <div className="media-placeholder">PRODUCT MEDIA</div>}
      </div>

      <h3>{product.name}</h3>
      <p className="card-subtitle">{product.subtitle}</p>
      <p>{product.description}</p>
      <p className={price ? 'catalog-price' : 'catalog-status'}>{price || statusLabel(product.status)}</p>

      {showAction && (
        <GarageLink href={'/merch/' + product.slug} navigate={navigate} className="button button-secondary">
          Open Listing
        </GarageLink>
      )}
    </WildCardCardFrame>
  );
}

export default function ProductCard({ product, navigate }) {
  const price = formatMoney(product.basePrice, product.currency);
  const fallbackImage = product.viewer?.mainFrames?.[0] || product.media?.[0];
  const isPennyDemo = product.id === 'demo-product';
  const primaryImage = isPennyDemo
    ? { src: PENNY_FRONT, alt: 'Penny merchandise front view' }
    : fallbackImage;

  return (
    <div className="product-card-rotation-wrap">
      <RotatableCardSurface
        className="catalog-card-rotator"
        backFace={isPennyDemo ? (
          <CatalogProductFace
            imageSrc={PENNY_BACK}
            imageAlt="Penny merchandise rear view"
            product={product}
            price={price}
            navigate={navigate}
            showAction={false}
          />
        ) : undefined}
        ariaLabel={'Interactive merchandise object for ' + product.name + '. Drag to rotate through full front, back, and edge views. Use arrow keys to inspect angles.'}
      >
        <CatalogProductFace
          imageSrc={primaryImage?.src}
          imageAlt={primaryImage?.alt || product.name}
          product={product}
          price={price}
          navigate={navigate}
          showAction
        />
      </RotatableCardSurface>

      <p className="product-card-rotate-hint">GRAB CARD TO SPIN · ARROW KEYS TO ROTATE</p>
    </div>
  );
}
