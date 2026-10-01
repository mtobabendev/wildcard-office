/**
 * @typedef {Object} HostedServiceListing
 * @property {string} id
 * @property {string} slug
 * @property {'service'} listingType
 * @property {'hosted-service'} sourceType
 * @property {'heart'} displaySuit
 * @property {'Hosted Service'} displayLabel
 * @property {string=} providerName
 * @property {string=} businessName
 * @property {string} title
 * @property {string=} subtitle
 * @property {string} description
 * @property {string=} category
 * @property {string=} serviceArea
 * @property {string=} pricingModel
 * @property {number|string=} startingPrice
 * @property {string=} priceText
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
 * @property {'diamond'} displaySuit
 * @property {'Hosted Merch'} displayLabel
 * @property {string=} providerName
 * @property {string=} businessName
 * @property {string} title
 * @property {string=} subtitle
 * @property {string} description
 * @property {string=} category
 * @property {Array<{src:string,alt?:string}>=} images
 * @property {string=} priceText
 * @property {number|string=} startingPrice
 * @property {string=} purchaseUrl
 * @property {{website?:string}=} contact
 * @property {Object=} viewer
 * @property {string=} status
 * @property {boolean=} featured
 * @property {string[]=} tags
 * @property {string[]=} disclosures
 */

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
