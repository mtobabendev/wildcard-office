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
    sourceType: 'wildcard',
    displaySuit: 'spade',
    displayLabel: 'WildCard Merch',
    tags: ['DEMO', 'NOT FOR SALE'],
    media: [
      {
        type: 'image',
        src: '/assets/products/penny-pillow/frames/PennyMyPillows01.png',
        alt: 'Penny Pillow 24-frame spin demonstration',
        poster: '',
      },
    ],
    viewer: {
      mode: 'spin-sequence',
      mainFrames: [
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows01.png',
          alt: 'Penny Pillow demo angle 01',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows02.png',
          alt: 'Penny Pillow demo angle 02',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows03.png',
          alt: 'Penny Pillow demo angle 03',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows04.png',
          alt: 'Penny Pillow demo angle 04',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows05.png',
          alt: 'Penny Pillow demo angle 05',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows06.png',
          alt: 'Penny Pillow demo angle 06',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows07.png',
          alt: 'Penny Pillow demo angle 07',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows08.png',
          alt: 'Penny Pillow demo angle 08',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows09.png',
          alt: 'Penny Pillow demo angle 09',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows10.png',
          alt: 'Penny Pillow demo angle 10',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows11.png',
          alt: 'Penny Pillow demo angle 11',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows12.png',
          alt: 'Penny Pillow demo angle 12',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows13.png',
          alt: 'Penny Pillow demo angle 13',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows14.png',
          alt: 'Penny Pillow demo angle 14',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows15.png',
          alt: 'Penny Pillow demo angle 15',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows16.png',
          alt: 'Penny Pillow demo angle 16',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows17.png',
          alt: 'Penny Pillow demo angle 17',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows18.png',
          alt: 'Penny Pillow demo angle 18',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows19.png',
          alt: 'Penny Pillow demo angle 19',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows20.png',
          alt: 'Penny Pillow demo angle 20',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows21.png',
          alt: 'Penny Pillow demo angle 21',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows22.png',
          alt: 'Penny Pillow demo angle 22',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows23.png',
          alt: 'Penny Pillow demo angle 23',
        },
        {
          src: '/assets/products/penny-pillow/frames/PennyMyPillows24.png',
          alt: 'Penny Pillow demo angle 24',
        },
      ],
      sideImages: [],
    },
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

export const listingSourceSystem = {
  wildcard: { displaySuit: 'spade', displayLabel: 'WildCard Merch' },
  'hosted-merch': { displaySuit: 'diamond', displayLabel: 'Hosted Merch' },
  'hosted-service': { displaySuit: 'heart', displayLabel: 'Hosted Service' },
  experimental: { displaySuit: 'club', displayLabel: 'Experimental' },
};

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
