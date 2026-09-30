const DEFAULT_RECIPIENT = 'matt@wildcarddev.com';
const MIN_SUBMISSION_MS = 1500;

const limits = {
  name: 120,
  email: 254,
  phone: 60,
  service: 80,
  platform: 160,
  urgency: 60,
  engagement: 80,
  secondChanceProgram: 20,
  project: 500,
  problem: 3000,
  outcome: 3000,
  budget: 120,
  deadline: 120,
  details: 4000,
  sourcePath: 500,
};

const serviceNames = new Map([
  ['web-app-build', 'Web & App Build'],
  ['repair-remediation', 'Repair & Remediation'],
  ['linux-raspberry-pi', 'Linux & Raspberry Pi'],
  ['automation-integration', 'Automation & Integration'],
  ['technical-troubleshooting', 'Technical Troubleshooting'],
  ['custom-weirdness', 'Custom Weirdness'],
]);

const secondChanceLabels = new Map([
  ['yes', 'Yes'],
  ['no', 'No'],
  ['private', 'Prefer to discuss privately'],
]);

const allowedServices = new Set(serviceNames.keys());

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function singleLine(value) {
  return text(value).replace(/[\r\n]+/g, ' ');
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

  if (body.secondChanceProgram && !secondChanceLabels.has(text(body.secondChanceProgram))) {
    errors.secondChanceProgram = 'Invalid program preference.';
  }

  for (const [field, max] of Object.entries(limits)) {
    if (text(body[field]).length > max) errors[field] = 'Too long.';
  }

  if (['repair-remediation', 'technical-troubleshooting'].includes(text(body.service)) && !text(body.problem)) {
    errors.problem = 'Required for repair/troubleshooting requests.';
  }

  return errors;
}

function formatLine(label, value) {
  return label + ': ' + (text(value) || '—');
}

function formatWorkOrder(payload) {
  return [
    'PENNY\'S GARAGE — QUOTE REQUEST',
    '',
    formatLine('Timestamp', payload.timestamp),
    formatLine('Name', payload.name),
    formatLine('Email', payload.email),
    formatLine('Phone', payload.phone),
    formatLine('Service', payload.serviceName),
    formatLine('Platform / device', payload.platformDevice),
    formatLine('Urgency', payload.urgency),
    formatLine('Engagement', payload.engagement),
    formatLine('SECOND-CHANCE PROGRAM', payload.secondChanceProgramLabel),
    '',
    'PROJECT / BUILD SUMMARY',
    payload.projectSummary || '—',
    '',
    'CURRENT PROBLEM',
    payload.currentProblem || '—',
    '',
    'DESIRED OUTCOME',
    payload.desiredOutcome || '—',
    '',
    formatLine('Budget', payload.budget),
    formatLine('Target date', payload.targetDate),
    '',
    'ADDITIONAL DETAILS',
    payload.additionalDetails || '—',
    '',
    formatLine('Source path', payload.sourcePath),
    '',
    'Intake is a request only. Scope and pricing must be agreed before work begins.',
  ].join('\n');
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

  const apiKey = process.env.RESEND_API_KEY;
  const from = text(process.env.QUOTE_FROM_EMAIL);
  const recipient = text(process.env.QUOTE_TO_EMAIL) || DEFAULT_RECIPIENT;

  if (!apiKey || !from) {
    console.error('Quote delivery configuration missing:', {
      hasResendApiKey: Boolean(apiKey),
      hasQuoteFromEmail: Boolean(from),
    });
    return response.status(503).json({
      error: 'Quote delivery is not configured yet. Your form data has not been sent.',
      code: 'DELIVERY_NOT_CONFIGURED',
    });
  }

  const serviceSlug = text(body.service);
  const secondChanceProgram = text(body.secondChanceProgram);
  const payload = {
    timestamp: new Date().toISOString(),
    recipient,
    name: text(body.name),
    email: text(body.email),
    phone: text(body.phone),
    service: serviceSlug,
    serviceName: serviceNames.get(serviceSlug),
    platformDevice: text(body.platform),
    urgency: text(body.urgency),
    engagement: text(body.engagement),
    secondChanceProgram,
    secondChanceProgramLabel: secondChanceLabels.get(secondChanceProgram) || 'Not specified',
    projectSummary: text(body.project),
    currentProblem: text(body.problem),
    desiredOutcome: text(body.outcome),
    budget: text(body.budget),
    targetDate: text(body.deadline),
    additionalDetails: text(body.details),
    sourcePath: text(body.sourcePath),
  };

  const subject = '[PENNY\'S GARAGE] Quote Request — ' +
    singleLine(payload.serviceName) + ' — ' + singleLine(payload.name);

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: payload.email,
        subject,
        text: formatWorkOrder(payload),
      }),
    });

    if (!resendResponse.ok) {
      let providerCode = '';
      try {
        const providerBody = await resendResponse.json();
        providerCode = singleLine(providerBody?.name || providerBody?.statusCode || '');
      } catch {
        providerCode = '';
      }

      console.error('Resend quote delivery failed:', {
        status: resendResponse.status,
        providerCode: providerCode || undefined,
      });

      return response.status(502).json({
        error: 'The work order could not be delivered. Your form data is still available so you can retry.',
        code: 'DELIVERY_FAILED',
      });
    }

    const accepted = await resendResponse.json().catch(() => ({}));
    if (!accepted?.id) {
      console.error('Resend quote delivery returned no message id.');
      return response.status(502).json({
        error: 'The delivery provider did not confirm the work order. Please retry.',
        code: 'DELIVERY_UNCONFIRMED',
      });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Resend quote delivery request failed:', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });

    return response.status(502).json({
      error: 'The work order could not be delivered. Your form data is still available so you can retry.',
      code: 'DELIVERY_FAILED',
    });
  }
}
