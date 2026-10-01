import ProductSpinViewer from '../components/store/ProductSpinViewer.jsx';
import SuitBadge from '../components/store/SuitBadge.jsx';
import ProviderLink from '../components/marketplace/ProviderLink.jsx';
import { marketplaceDisclosure } from '../data/marketplace.js';

export default function MarketplaceMerchDetail({ listing }) {
  const provider = listing.businessName || listing.providerName || 'Independent provider';
  const viewer = listing.viewer || {
    mode: 'static',
    mainFrames: listing.images || [],
    sideImages: [],
  };

  return (
    <section className="section-shell page-shell marketplace-detail">
      <div className="marketplace-detail-grid">
        <ProductSpinViewer
          viewer={viewer}
          fallbackMedia={(listing.images || []).map((image) => ({ ...image, type: 'image' }))}
          suit="diamond"
          label="Hosted Merch"
          status={String(listing.status || 'HOSTED').toUpperCase()}
        />

        <div className="marketplace-detail-copy">
          <SuitBadge suit="diamond" label="Hosted Merch" />
          <p className="eyebrow">{listing.category || 'Hosted Merchandise'}</p>
          <h1>{listing.title}</h1>
          <p className="marketplace-provider">{provider}</p>
          {listing.subtitle && <p className="listing-subtitle">{listing.subtitle}</p>}
          <p>{listing.description}</p>
          {(listing.priceText || listing.startingPrice) && <p className="marketplace-price">{listing.priceText || listing.startingPrice}</p>}

          <div className="hero-actions">
            <ProviderLink href={listing.purchaseUrl} className="button button-primary">Buy from Provider</ProviderLink>
            <ProviderLink href={listing.contact?.website}>Provider Website</ProviderLink>
          </div>

          <div className="marketplace-disclosure">
            <strong>Independent provider</strong>
            <p>{marketplaceDisclosure}</p>
            <p>Hosted merchandise is purchased from the provider directly and is not placed in the WildCard cart.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
