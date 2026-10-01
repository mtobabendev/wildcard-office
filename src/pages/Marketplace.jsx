import GarageLink from '../components/layout/GarageLink.jsx';
import MarketplaceCard from '../components/marketplace/MarketplaceCard.jsx';
import SuitBadge from '../components/store/SuitBadge.jsx';
import {
  hostedMerchandise,
  hostedServices,
  marketplaceCategories,
  marketplaceDisclosure,
} from '../data/marketplace.js';

function EmptyLane({ suit, label, children }) {
  return (
    <div className="marketplace-empty">
      <SuitBadge suit={suit} label={label} />
      <h3>No live listings yet.</h3>
      <p>{children}</p>
    </div>
  );
}

export default function Marketplace({ navigate }) {
  return (
    <section className="section-shell page-shell marketplace-page">
      <header className="page-heading marketplace-heading">
        <p className="eyebrow">FOUNDER MARKETPLACE</p>
        <h1>Built by people building again.</h1>
        <p>Independent founders. Real services. Real products. Their businesses, their work.</p>
        <p>RISE graduates and justice-impacted founders are welcome here, but participation never requires public disclosure of justice history.</p>
      </header>

      <div className="marketplace-lanes">
        <section className="marketplace-lane" aria-labelledby="hosted-services-heading">
          <div className="marketplace-lane-heading">
            <SuitBadge suit="heart" label="Hosted Service" />
            <h2 id="hosted-services-heading">♥ Hosted Services</h2>
            <p>Independent providers offering their own services through their own booking, contact, or payment destinations.</p>
          </div>

          <div className="category-strip" aria-label="Supported hosted service categories">
            {marketplaceCategories.services.map((category) => <span key={category}>{category}</span>)}
          </div>

          {hostedServices.length ? (
            <div className="collection-grid">
              {hostedServices.map((listing) => <MarketplaceCard key={listing.id} listing={listing} navigate={navigate} />)}
            </div>
          ) : (
            <EmptyLane suit="heart" label="Hosted Service">
              The service architecture is ready for Owner-approved independent providers. No provider has been invented for this stage.
            </EmptyLane>
          )}
        </section>

        <section className="marketplace-lane" aria-labelledby="hosted-merch-heading">
          <div className="marketplace-lane-heading">
            <SuitBadge suit="diamond" label="Hosted Merch" />
            <h2 id="hosted-merch-heading">♦ Hosted Merchandise</h2>
            <p>Independent founder products stay provider-owned and use the provider's external purchase destination.</p>
          </div>

          <div className="category-strip" aria-label="Supported hosted merchandise categories">
            {marketplaceCategories.merchandise.map((category) => <span key={category}>{category}</span>)}
          </div>

          {hostedMerchandise.length ? (
            <div className="collection-grid">
              {hostedMerchandise.map((listing) => <MarketplaceCard key={listing.id} listing={listing} navigate={navigate} />)}
            </div>
          ) : (
            <EmptyLane suit="diamond" label="Hosted Merch">
              The hosted-merch architecture is ready for Owner-approved founder products. No fake merchandise or price has been added.
            </EmptyLane>
          )}
        </section>
      </div>

      <aside className="marketplace-disclosure">
        <strong>Independent provider notice</strong>
        <p>{marketplaceDisclosure}</p>
        <p>Provider-supplied credential information may appear on a listing, but WildCard DEV does not claim to verify credentials unless a future verification process is explicitly implemented.</p>
      </aside>

      <section className="cta-panel">
        <p className="eyebrow">FOUNDERS WELCOME</p>
        <h2>Ask about listing your business.</h2>
        <p>Provider self-registration is not open yet. Marketplace listings are Owner-reviewed before they appear.</p>
        <GarageLink href="/quote?marketplace=listing" navigate={navigate} className="button button-primary">
          Ask About Listing Your Business
        </GarageLink>
      </section>
    </section>
  );
}
