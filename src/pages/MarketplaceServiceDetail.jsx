import SuitBadge from '../components/store/SuitBadge.jsx';
import WildCardCardFrame from '../components/store/WildCardCardFrame.jsx';
import ProviderLink from '../components/marketplace/ProviderLink.jsx';
import {
  formatMarketplacePrice,
  marketplaceDisclosure,
  resolveMarketplaceClassification,
} from '../data/marketplace.js';

export default function MarketplaceServiceDetail({ listing }) {
  const classification = resolveMarketplaceClassification(listing);
  if (!classification || classification.sourceType !== 'hosted-service') {
    return (
      <section className="section-shell page-shell empty-state">
        <p className="eyebrow">FOUNDER MARKETPLACE // REVIEW REQUIRED</p>
        <h1>Listing unavailable.</h1>
        <p>This hosted-service record has invalid source classification and cannot be presented as a WildCard or hosted offering.</p>
      </section>
    );
  }

  const provider = listing.businessName || listing.providerName || 'Independent provider';
  const price = formatMarketplacePrice(listing);

  return (
    <section className="section-shell page-shell marketplace-detail">
      <div className="marketplace-detail-grid">
        <WildCardCardFrame
          suit={classification.suit}
          label={classification.label}
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
          <SuitBadge suit={classification.suit} label={classification.label} />
          <p className="eyebrow">{listing.category || 'Hosted Service'}</p>
          <h1>{listing.title}</h1>
          <p className="marketplace-provider">{provider}</p>
          {listing.subtitle && <p className="listing-subtitle">{listing.subtitle}</p>}
          <p>{listing.description}</p>
          {listing.serviceArea && <p><strong>Service area:</strong> {listing.serviceArea}</p>}
          {price && <p className="marketplace-price">{price}</p>}

          {(listing.contact?.email || listing.contact?.phone) && (
            <div className="provider-credentials">
              <strong>Provider contact information</strong>
              {listing.contact.email && <p>Email: {listing.contact.email}</p>}
              {listing.contact.phone && <p>Phone: {listing.contact.phone}</p>}
            </div>
          )}

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
