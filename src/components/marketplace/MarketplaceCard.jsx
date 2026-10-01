import GarageLink from '../layout/GarageLink.jsx';
import SuitBadge from '../store/SuitBadge.jsx';
import WildCardCardFrame from '../store/WildCardCardFrame.jsx';

export default function MarketplaceCard({ listing, navigate }) {
  const isService = listing.listingType === 'service';
  const href = isService
    ? '/marketplace/services/' + listing.slug
    : '/marketplace/merch/' + listing.slug;

  const provider = listing.businessName || listing.providerName || 'Independent provider';
  const status = listing.status ? String(listing.status).toUpperCase() : 'HOSTED';

  return (
    <WildCardCardFrame
      as="article"
      suit={listing.displaySuit}
      label={listing.displayLabel}
      status={status}
      className={'marketplace-card ' + (isService ? 'is-hosted-service' : 'is-hosted-merch')}
    >
      <div className="marketplace-card-content">
        <SuitBadge suit={listing.displaySuit} label={listing.displayLabel} />

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
        {(listing.priceText || listing.startingPrice) && (
          <p className="marketplace-price">{listing.priceText || listing.startingPrice}</p>
        )}

        <GarageLink href={href} navigate={navigate} className="button button-secondary">
          View Listing
        </GarageLink>
      </div>
    </WildCardCardFrame>
  );
}
