export const marketplaceCategories = {
  services: ['Housekeeping', 'Lawn Care', 'Massage Therapy', 'Mobile Detailing', 'Handyman Services', 'Beauty Services', 'Pet Care'],
  merchandise: ['Locally Produced Merchandise', 'Digital Products', 'Physical Products'],
};

export const hostedServices = [];
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
