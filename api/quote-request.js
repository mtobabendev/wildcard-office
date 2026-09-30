const RECIPIENT = 'matt@wildcarddev.com';
const MIN_SUBMISSION_MS = 1500;

const limits = {
  name: 120,
  email: 254,
  phone: 60,
  service: 80,
  platform: 160,
  urgency: 60,
  engagement: 80,
  project: 500,
  problem: 3000,
  outcome: 3000,
  budget: 120,
  deadline: 120,
  details: 4000,
  sourcePath: 500,
};

const allowedServices = new Set([
  'web-app-build',
  'repair-remediation',
  'linux-raspberry-pi',
  'automation-integration',
  'technical-troubleshooting',
  'custom-weirdness',
]);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validate(body) {
  const errors = {};
  const required = ['name', 'email', 'service', 'urgency', 'project', 'outcome'];

  for (const field of required) {
    if (!text(body[field])) errors[field] = 'Required.';
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(body.email))) {
    errors.email = 'Invalid email.';
  }

  if (body.service && !allowedServices.has(text(body.service))) {
    errors.service = 'Unknown service.';
  }

  for (const [field, max] of Object.entries(limits)) {
    if (text(body[field]).length > max) errors[field] = 'Too long.';
  }

  if (['repair-remediation', 'technical-troubleshooting'].includes(text(body.service)) && !text(body.problem)) {
    errors.problem = 'Required for repair/troubleshooting requests.';
  }

  return errors;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {};

  if (text(body.companyWebsite)) {
    return response.status(200).json({ ok: true });
  }

  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_SUBMISSION_MS) {
    return response.status(429).json({ error: 'Please take a moment before submitting the request.' });
  }

  const errors = validate(body);
  if (Object.keys(errors).length) {
    return response.status(400).json({ error: 'Please correct the highlighted fields.', fields: errors });
  }

  const payload = {
    timestamp: new Date().toISOString(),
    recipient: RECIPIENT,
    name: text(body.name),
    email: text(body.email),
    phone: text(body.phone),
    service: text(body.service),
    selectedOptions: {
      platform: text(body.platform),
      urgency: text(body.urgency),
      engagement: text(body.engagement),
    },
    platformDevice: text(body.platform),
    urgency: text(body.urgency),
    projectSummary: text(body.project),
    currentProblem: text(body.problem),
    desiredOutcome: text(body.outcome),
    budget: text(body.budget),
    targetDate: text(body.deadline),
    additionalDetails: text(body.details),
    sourcePath: text(body.sourcePath),
  };

  // Delivery provider intentionally remains unselected until Owner approval.
  // The validated payload above is the stable boundary for the approved adapter.
  void payload;

  return response.status(503).json({
    error: 'Quote delivery is not configured yet. Your form data has not been sent. Please retry after the business delivery channel is configured.',
    code: 'DELIVERY_NOT_CONFIGURED',
  });
}
