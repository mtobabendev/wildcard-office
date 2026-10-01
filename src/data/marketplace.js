import { formatMoney } from './products.js';

/**
 * @typedef {Object} HostedServiceListing
 * @property {string} id
 * @property {string} slug
 * @property {'service'} listingType
 * @property {'hosted-service'} sourceType
 * @property {string=} providerName
 * @property {string=} businessName
 * @property {string} title
 * @property {string=} subtitle
 * @property {string} description
 * @property {string=} category
 * @property {string=} serviceArea
 * @property {string=} pricingModel
 * @property {number=} startingPrice Integer cents.
 * @property {string=} currency ISO currency code. Defaults to USD.
 * @property {string=} priceText Display-only pricing text such as Quote Required or Contact Provider.
 * @property {Array<{src:string,alt?:string}>=} images
 * @property {{phone?:string,email?:string,website?:string}=} contact
 * @property {{bookingUrl?:string,paymentUrl?:string}=} booking
 * @property {{licenseText?:string,certificationText?:string}=} credentials
 * @property {string=} status
 * @property {boolean=} featured
 * @property {string[]=} tags
 * @property {string[]=} disclosures
 */

/**
 * @typedef {Object} HostedMerchListing
 * @property {string} id
 * @property {string} slug
 * @property {'merch'} listingType
 * @property {'hosted-merch'} sourceType
 * @property {string=} providerName
 * @property {string=} businessName
 * @property {string} title
 * @property {string=} subtitle
 * @property {string} description
 * @property {string=} category
 * @property {Array<{src:string,alt?:string}>=} images
 * @property {number=} startingPrice Integer cents.
 * @property {string=} currency ISO currency code. Defaults to USD.
 * @property {string=} priceText Display-only pricing text such as Starting at… or Contact Provider.
 * @property {string=} purchaseUrl
 * @property {{website?:string}=} contact
 * @property {Object=} viewer
 * @property {string=} status
 * @property {boolean=} featured
 * @property {string[]=} tags
 * @property {string[]=} disclosures
 */

const sourceClassifications = {
  wildcard: { sourceType: 'wildcard', suit: 'spade', label: 'WildCard' },
  'hosted-merch': { sourceType: 'hosted-merch', suit: 'diamond', label: 'Hosted Merch' },
  'hosted-service': { sourceType: 'hosted-service', suit: 'heart', label: 'Hosted Service' },
  experimental: { sourceType: 'experimental', suit: 'club', label: 'Experimental' },
  evidence: { sourceType: 'experimental', suit: 'club', label: 'Experimental' },
};

const listingTypeSources = {
  service: 'hosted-service',
  merch: 'hosted-merch',
};

export const marketplaceCategories = {
  services: ['Housekeeping', 'Lawn Care', 'Massage Therapy', 'Mobile Detailing', 'Handyman Services', 'Beauty Services', 'Pet Care'],
  merchandise: ['Locally Produced Merchandise', 'Digital Products', 'Physical Products'],
};

/** @type {HostedServiceListing[]} */
export const hostedServices = [];

/** @type {HostedMerchListing[]} */
export const hostedMerchandise = [];

export const marketplaceDisclosure =
  'Founder Marketplace listings are provided by independent businesses or individuals. WildCard DEV provides the listing platform and does not perform a hosted service unless the listing explicitly identifies it as a WildCard DEV offering.';

export function resolveMarketplaceClassification(listing) {
  if (!listing || typeof listing !== 'object') return null;

  const sourceType = typeof listing.sourceType === 'string' ? listing.sourceType : '';
  const sourceFromType = listingTypeSources[listing.listingType] || '';
  const classification = sourceClassifications[sourceType] || null;

  if (!classification) return null;
  if (sourceFromType && sourceFromType !== classification.sourceType) return null;

  return classification;
}

export function formatMarketplacePrice(listing) {
  const priceText = typeof listing?.priceText === 'string' ? listing.priceText.trim() : '';
  if (priceText) return priceText;

  if (!Number.isInteger(listing?.startingPrice) || listing.startingPrice < 0) return null;
  return formatMoney(listing.startingPrice, listing.currency || 'USD');
}

export function getHostedService(slug) {
  return hostedServices.find((listing) => listing.slug === slug);
}

export function getHostedMerch(slug) {
  return hostedMerchandise.find((listing) => listing.slug === slug);
}

export function safeExternalUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
