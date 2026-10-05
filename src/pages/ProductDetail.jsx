import { useMemo, useState } from 'react';
import ListingHeader from '../components/listing/ListingHeader.jsx';
import OptionSelector from '../components/listing/OptionSelector.jsx';
import ProductPurchasePanel from '../components/store/ProductPurchasePanel.jsx';
import ProductSpinViewer from '../components/store/ProductSpinViewer.jsx';
import SuitBadge from '../components/store/SuitBadge.jsx';
import DetailAccordion from '../components/listing/DetailAccordion.jsx';
import RelatedListings from '../components/listing/RelatedListings.jsx';
import {
  calculateProductUnitPrice,
  products,
  statusLabel,
} from '../data/products.js';

const PENNY_FRONT = '/assets/products/penny-pillow/PennyMerchFront.png';
const PENNY_BACK = '/assets/products/penny-pillow/PennyMerchBack.png';

export default function ProductDetail({ product, addToCart, navigate }) {
  const initialSelections = Object.fromEntries(
    product.optionGroups
      .map((group) => [group.id, group.options.find((option) => option.available)?.id])
      .filter(([, value]) => value),
  );

  const [selections, setSelections] = useState(initialSelections);
  const [quantity, setQuantity] = useState(1);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [notice, setNotice] = useState('');

  const computedPrice = useMemo(
    () => calculateProductUnitPrice(product, selections),
    [product, selections],
  );

  const onOptionChange = (group, option) => {
    setSelections((current) => ({ ...current, [group.id]: option.id }));
    if (Number.isInteger(option.mediaIndex)) setMediaIndex(option.mediaIndex);
  };

  const fulfillmentText = product.fulfillment.type === 'digital'
    ? 'Digital-delivery architecture is reserved, but automatic file delivery is not implemented.'
    : product.fulfillment.shippingRequired
      ? 'Shipping details are collected by Square-hosted checkout when enabled for a sellable physical product. Penny\'s Garage does not calculate postage in this stage.'
      : 'No shipping workflow is attached to this non-sale reference listing.';

  const details = [
    { title: 'About This Item', content: product.details },
    { title: 'Source / Classification', content: product.displayLabel + ' (' + product.sourceType + ')' },
    { title: 'Status', content: statusLabel(product.status) },
    { title: 'Fulfillment / Shipping', content: fulfillmentText },
    { title: 'Tax', content: 'Penny\'s Garage does not calculate custom tax in this stage.' },
    { title: 'Payment', content: 'When sellable inventory is Owner-approved and Square is configured, card details are entered only on Square-hosted checkout.' },
  ];

  const isPennyDemo = product.id === 'demo-product';

  return (
    <section className="section-shell detail-page">
      <div className="detail-grid">
        <ProductSpinViewer
          viewer={product.viewer}
          fallbackMedia={product.media}
          suit={product.displaySuit}
          label={product.displayLabel}
          status={statusLabel(product.status)}
          requestedIndex={mediaIndex}
          physicalFrontSrc={isPennyDemo ? PENNY_FRONT : undefined}
          physicalFrontAlt="Penny merchandise front view"
          physicalBackSrc={isPennyDemo ? PENNY_BACK : undefined}
          physicalBackAlt="Penny merchandise rear view"
          backTitle={product.name}
          backSubtitle={product.subtitle}
          backDescription={product.description}
          backStatus={statusLabel(product.status)}
        />

        <div className="detail-info">
          <SuitBadge suit={product.displaySuit} label={product.displayLabel} />
          <ListingHeader eyebrow="PARTS CAGE // PRODUCT LISTING" name={product.name} subtitle={product.subtitle} tags={product.tags} />
          <p>{product.description}</p>
          <OptionSelector groups={product.optionGroups} selections={selections} onChange={onOptionChange} />
          <ProductPurchasePanel
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            selections={selections}
            computedPrice={computedPrice}
            onAdd={() => {
              addToCart({ productId: product.id, quantity, selections });
              setNotice(
                product.status === 'demo'
                  ? 'Reference configuration added to cart. It remains ineligible for checkout.'
                  : quantity + ' item' + (quantity === 1 ? '' : 's') + ' added to cart.',
              );
            }}
          />
          {notice && <p className="inline-notice" role="status">{notice}</p>}
        </div>
      </div>

      <DetailAccordion sections={details} />
      <RelatedListings relatedIds={product.relatedIds} records={products} basePath="/merch" navigate={navigate} />
    </section>
  );
}
