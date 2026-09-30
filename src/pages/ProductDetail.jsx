import { useMemo, useState } from 'react';
import ListingHeader from '../components/listing/ListingHeader.jsx';
import MediaGallery from '../components/listing/MediaGallery.jsx';
import OptionSelector from '../components/listing/OptionSelector.jsx';
import { ProductPurchasePanel } from '../components/listing/PurchasePanel.jsx';
import DetailAccordion from '../components/listing/DetailAccordion.jsx';
import RelatedListings from '../components/listing/RelatedListings.jsx';
import { products } from '../data/products.js';

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

  const computedPrice = useMemo(() => product.optionGroups.reduce((total, group) => {
    const option = group.options.find((item) => item.id === selections[group.id]);
    return total + (option?.priceModifier || 0);
  }, product.price), [product, selections]);

  const onOptionChange = (group, option) => {
    setSelections((current) => ({ ...current, [group.id]: option.id }));
    if (Number.isInteger(option.mediaIndex)) setMediaIndex(option.mediaIndex);
  };

  const details = [
    { title: 'About This Item', content: product.details },
    { title: 'Specifications', content: ['Demonstration listing only', 'No production inventory connected'] },
    { title: 'Fulfillment / Shipping', content: product.fulfillment.summary },
    { title: 'Returns', content: 'Not applicable to this demonstration listing.' },
    { title: 'Care / Requirements', content: 'No real commercial item is being sold in this stage.' },
  ];

  return (
    <section className="section-shell detail-page">
      <div className="detail-grid">
        <MediaGallery media={product.media} requestedIndex={mediaIndex} />
        <div className="detail-info">
          <ListingHeader eyebrow="GARAGE FIND // DEMO LISTING" name={product.name} subtitle={product.subtitle} tags={product.tags} />
          <p>{product.description}</p>
          <OptionSelector groups={product.optionGroups} selections={selections} onChange={onOptionChange} />
          <ProductPurchasePanel
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            selections={selections}
            computedPrice={computedPrice}
            onAdd={() => {
              addToCart({ product, quantity, selections });
              setNotice(quantity + ' demo item' + (quantity === 1 ? '' : 's') + ' added to local cart.');
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
