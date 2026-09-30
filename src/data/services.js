export const services = [
  {
    id: 'demo-service',
    slug: 'demo-service',
    type: 'service',
    name: 'Demo Weird Problem Intake',
    subtitle: 'Service mechanics demonstration — no real submission',
    description: 'A placeholder work order proving service-specific options, disclosures, and quote routing without pretending custom work is normal merchandise.',
    pricingModel: 'quote',
    startingPrice: null,
    featured: true,
    tags: ['DEMO', 'QUOTE REQUIRED'],
    media: [],
    optionGroups: [
      {
        id: 'platform',
        label: 'Demo platform',
        required: true,
        options: [
          { id: 'linux', label: 'Linux / Raspberry Pi', priceModifier: 0, available: true, description: 'Demonstration selection.', mediaIndex: 0 },
          { id: 'web', label: 'Web / App', priceModifier: 0, available: true, description: 'Demonstration selection.', mediaIndex: 0 },
        ],
      },
      {
        id: 'urgency',
        label: 'Demo urgency',
        required: false,
        options: [
          { id: 'normal', label: 'Normal Queue', priceModifier: 0, available: true, description: 'No real scheduling attached.', mediaIndex: 0 },
          { id: 'hot-bench', label: 'Hot Bench', priceModifier: 0, available: false, description: 'Unavailable-state demonstration.', mediaIndex: 0 },
        ],
      },
    ],
    details: [
      'Scope is defined before work begins.',
      'This demonstration does not create a real work order.',
    ],
    process: [
      'Describe the problem.',
      'Confirm scope and constraints.',
      'Future implementation will route an approved intake.',
    ],
    turnaround: 'DEMO: determined after scope review',
    relatedIds: [],
  },
];
