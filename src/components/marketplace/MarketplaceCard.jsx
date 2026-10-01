import GarageLink from '../layout/GarageLink.jsx';
import SuitBadge from '../store/SuitBadge.jsx';
import WildCardCardFrame from '../store/WildCardCardFrame.jsx';
import {
  formatMarketplacePrice,
  resolveMarketplaceClassification,
} from '../../data/marketplace.js';

export default function MarketplaceCard({ listing, navigate }) {
  const classification = resolveMarketplaceClassification(listing);
  const provider = listing.businessName || listing.providerName || 'Independent provider';
  const status = listing.status ? String(listing.status).toUpperCase() : 'HOSTED';

  if (!classification) {
    return (
      <WildCardCardFrame
        as="article"
        status="REVIEW REQUIRED"
        className="marketplace-card is-unclassified"
      >
        <div className="marketplace-card-content">
          <p className="eyebrow">UNCLASSIFIED LISTING</p>
          <h3>{listing.title || 'Listing unavailable'}</h3>
          <p>This listing has invalid source classification and is not published as a WildCard or hosted offering.</p>
        </div>
      </WildCardCardFrame>
    );
  }

  const isService = classification.sourceType === 'hosted-service';
  const href = isService
    ? '/marketplace/services/' + listing.slug
    : '/marketplace/merch/' + listing.slug;
  const price = formatMarketplacePrice(listing);

  return (
    <WildCardCardFrame
      as="article"
      suit={classification.suit}
      label={classification.label}
      status={status}
      className={'marketplace-card ' + (isService ? 'is-hosted-service' : 'is-hosted-merch')}
    >
      <div className="marketplace-card-content">
        <SuitBadge suit={classification.suit} label={classification.label} />

        {listing.images?.[0]?.src && (
          <div className="marketplace-card-image">
            <img src={listing.images[0].src} alt={listing.images[0].alt || listing.title} loading="lazy" />
          </div>
        )}

        <p className="eyebrow">{listing.category || (isService ? 'Hosted Service' : 'Hosted Merchandise')}</p>
        <h3>{listing.title}</h3>
        <p className="marketplace-provider">{provider}</p>
        {listing.serviceArea && <p className="fine-print">Service area: {listing.serviceArea}</p>}
        <p>{listing.description}</p>
        {price && <p className="marketplace-price">{price}</p>}

        <GarageLink href={href} navigate={navigate} className="button button-secondary">
          View Listing
        </GarageLink>
      </div>
    </WildCardCardFrame>
  );
}
