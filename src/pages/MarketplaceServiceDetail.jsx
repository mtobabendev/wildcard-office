import SuitBadge from '../components/store/SuitBadge.jsx';
import WildCardCardFrame from '../components/store/WildCardCardFrame.jsx';
import ProviderLink from '../components/marketplace/ProviderLink.jsx';
import { marketplaceDisclosure } from '../data/marketplace.js';

export default function MarketplaceServiceDetail({ listing }) {
  const provider = listing.businessName || listing.providerName || 'Independent provider';

  return (
    <section className="section-shell page-shell marketplace-detail">
      <div className="marketplace-detail-grid">
        <WildCardCardFrame
          suit={listing.displaySuit}
          label={listing.displayLabel}
          status={String(listing.status || 'HOSTED').toUpperCase()}
          className="marketplace-detail-card is-hosted-service"
        >
          <div className="marketplace-detail-media">
            {listing.images?.[0]?.src
              ? <img src={listing.images[0].src} alt={listing.images[0].alt || listing.title} />
              : <div className="media-placeholder">HOSTED SERVICE MEDIA</div>}
          </div>
        </WildCardCardFrame>

        <div className="marketplace-detail-copy">
          <SuitBadge suit="heart" label="Hosted Service" />
          <p className="eyebrow">{listing.category || 'Hosted Service'}</p>
          <h1>{listing.title}</h1>
          <p className="marketplace-provider">{provider}</p>
          {listing.subtitle && <p className="listing-subtitle">{listing.subtitle}</p>}
          <p>{listing.description}</p>
          {listing.serviceArea && <p><strong>Service area:</strong> {listing.serviceArea}</p>}
          {(listing.priceText || listing.startingPrice) && <p className="marketplace-price">{listing.priceText || listing.startingPrice}</p>}

          {(listing.credentials?.licenseText || listing.credentials?.certificationText) && (
            <div className="provider-credentials">
              <strong>Provider-supplied credential information</strong>
              {listing.credentials.licenseText && <p>{listing.credentials.licenseText}</p>}
              {listing.credentials.certificationText && <p>{listing.credentials.certificationText}</p>}
            </div>
          )}

          <div className="hero-actions">
            <ProviderLink href={listing.booking?.bookingUrl} className="button button-primary">Book with Provider</ProviderLink>
            <ProviderLink href={listing.booking?.paymentUrl}>Pay Provider</ProviderLink>
            <ProviderLink href={listing.contact?.website}>Provider Website</ProviderLink>
            {listing.contact?.email && <a className="button button-secondary" href={'mailto:' + listing.contact.email}>Contact Provider</a>}
            {listing.contact?.phone && <a className="button button-secondary" href={'tel:' + listing.contact.phone}>Call Provider</a>}
          </div>

          <div className="marketplace-disclosure">
            <strong>Independent provider</strong>
            <p>{marketplaceDisclosure}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
