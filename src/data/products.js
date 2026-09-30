export const products = [
  {
    id: 'demo-product',
    slug: 'demo-product',
    type: 'product',
    name: 'Demo Garage Artifact',
    subtitle: 'Mechanics demonstration — not real inventory',
    description: 'A controlled placeholder listing used to prove media, options, quantity, details, and local cart behavior.',
    price: 66,
    compareAtPrice: 88,
    stock: 1,
    status: 'DEMO AVAILABLE',
    featured: true,
    tags: ['DEMO', 'BENCH TESTED'],
    media: [
      {
        type: 'image',
        src: '/assets/penny/PennyWildCard.jpg',
        alt: 'Penny WildCard artwork used as demonstration listing media',
        poster: '',
      },
    ],
    optionGroups: [
      {
        id: 'finish',
        label: 'Demo finish',
        required: true,
        options: [
          { id: 'raw', label: 'Raw Bench', priceModifier: 0, available: true, description: 'Base demonstration option.', mediaIndex: 0 },
          { id: 'chrome', label: 'Chrome-ish', priceModifier: 6, available: true, description: 'Demo price modifier only.', mediaIndex: 0 },
          { id: 'classified', label: 'Classified', priceModifier: 0, available: false, description: 'Unavailable-state demonstration.', mediaIndex: 0 },
        ],
      },
    ],
    details: [
      'Demonstrates listing mechanics only.',
      'Uses one approved legacy image as sample media.',
      'No real stock or fulfillment system is connected.',
    ],
    fulfillment: {
      type: 'demo',
      summary: 'No fulfillment occurs. This is a demonstration record.',
    },
    relatedIds: [],
  },
];
