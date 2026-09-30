export const products = [
  {
    id: 'demo-product',
    slug: 'demo-product',
    type: 'product',
    sku: null,
    name: 'Demo Garage Artifact',
    subtitle: 'Reference configuration — not real inventory',
    description: 'A controlled non-sale listing used to exercise product media, variants, quantity, cart identity, and checkout eligibility rules without inventing commercial inventory.',
    status: 'demo',
    featured: true,
    basePrice: null,
    currency: 'USD',
    tags: ['DEMO', 'NOT FOR SALE'],
    media: [
      {
        type: 'image',
        src: '/assets/penny/PennyWildCard.jpg',
        alt: 'Penny WildCard artwork used as non-sale demonstration listing media',
        poster: '',
      },
    ],
    optionGroups: [
      {
        id: 'finish',
        label: 'Reference finish',
        required: true,
        options: [
          { id: 'raw', sku: null, label: 'Raw Bench', priceModifier: 0, available: true, description: 'Reference configuration only.', mediaIndex: 0 },
          { id: 'chrome', sku: null, label: 'Chrome-ish', priceModifier: 0, available: true, description: 'Reference configuration only.', mediaIndex: 0 },
          { id: 'classified', sku: null, label: 'Classified', priceModifier: 0, available: false, description: 'Unavailable-state reference.', mediaIndex: 0 },
        ],
      },
    ],
    fulfillment: {
      type: 'demo',
      shippingRequired: false,
      digitalDelivery: false,
    },
    details: [
      'Demonstrates production catalog mechanics without representing a real item for sale.',
      'No commercial SKU, price, stock quantity, shipping promise, or digital delivery is attached.',
      'Demo listings are rejected by the Square checkout boundary.',
    ],
    relatedIds: [],
  },
];

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

export function isCheckoutEligible(product) {
  return Boolean(
    product &&
    ['available', 'limited'].includes(product.status) &&
    Number.isInteger(product.basePrice) &&
    product.basePrice >= 0
  );
}

export function calculateProductUnitPrice(product, selections = {}) {
  if (!Number.isInteger(product?.basePrice)) return null;

  let total = product.basePrice;
  for (const group of product.optionGroups || []) {
    const selectedId = selections[group.id];
    const option = group.options.find((candidate) => candidate.id === selectedId);
    if (!option || !option.available) {
      if (group.required) return null;
      continue;
    }
    total += Number.isInteger(option.priceModifier) ? option.priceModifier : 0;
  }
  return total;
}

export function validateSelections(product, selections = {}) {
  if (!product) return false;

  for (const group of product.optionGroups || []) {
    const selectedId = selections[group.id];
    if (!selectedId) {
      if (group.required) return false;
      continue;
    }
    const option = group.options.find((candidate) => candidate.id === selectedId);
    if (!option || !option.available) return false;
  }
  return true;
}

export function buildCartKey(productId, selections = {}) {
  return [
    productId,
    ...Object.entries(selections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([groupId, optionId]) => groupId + ':' + optionId),
  ].join('|');
}

export function selectionLabels(product, selections = {}) {
  return (product?.optionGroups || [])
    .map((group) => {
      const option = group.options.find((candidate) => candidate.id === selections[group.id]);
      return option ? [group.label, option.label] : null;
    })
    .filter(Boolean);
}

export function formatMoney(amount, currency = 'USD') {
  if (!Number.isInteger(amount)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function statusLabel(status) {
  const labels = {
    available: 'AVAILABLE',
    'coming-soon': 'COMING SOON',
    'sold-out': 'SOLD OUT',
    limited: 'LIMITED RUN',
    demo: 'DEMO — NOT FOR SALE',
  };
  return labels[status] || String(status || 'UNAVAILABLE').toUpperCase();
}
