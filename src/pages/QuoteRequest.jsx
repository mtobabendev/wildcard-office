import { useMemo, useState } from 'react';
import { services } from '../data/services.js';

const urgencyOptions = [
  ['standard', 'Standard'],
  ['time-sensitive', 'Time Sensitive'],
  ['production-down', 'Production Down'],
];

const engagementOptions = [
  ['diagnosis', 'Diagnosis Only'],
  ['repair', 'Repair / Implementation'],
  ['build', 'Build From Scratch'],
  ['consultation', 'Consultation'],
];

const fieldLimits = {
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
};

function initialForm() {
  const params = new URLSearchParams(window.location.search);
  return {
    name: '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    platform: params.get('platform') || '',
    urgency: params.get('urgency') || 'standard',
    engagement: params.get('engagement') || '',
    project: '',
    problem: '',
    outcome: '',
    budget: '',
    deadline: '',
    details: '',
    companyWebsite: '',
    startedAt: Date.now(),
  };
}

function validate(values) {
  const errors = {};
  const required = ['name', 'email', 'service', 'urgency', 'project', 'outcome'];

  required.forEach((field) => {
    if (!String(values[field] || '').trim()) errors[field] = 'Required.';
  });

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  Object.entries(fieldLimits).forEach(([field, max]) => {
    if (String(values[field] || '').length > max) {
      errors[field] = 'Keep this field under ' + max + ' characters.';
    }
  });

  const repairStyle = ['repair-remediation', 'technical-troubleshooting'].includes(values.service);
  if (repairStyle && !String(values.problem || '').trim()) {
    errors.problem = 'Describe the current problem for repair or troubleshooting work.';
  }

  return errors;
}

export default function QuoteRequest() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const selectedService = useMemo(
    () => services.find((service) => service.slug === form.service),
    [form.service],
  );

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setStatus({ type: 'error', message: 'Check the highlighted fields and try again.' });
      return;
    }

    setStatus({ type: 'submitting', message: 'Sending work order…' });

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sourcePath: window.location.pathname + window.location.search,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'The work order could not be delivered.');
      }

      setStatus({
        type: 'success',
        message: 'WORK ORDER RECEIVED. Penny has your problem on the bench. We’ll review the request before any work, payment, or commitment begins.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Delivery failed. Your form is still here so you can retry.',
      });
    }
  };

  return (
    <section className="section-shell page-shell quote-page">
      <header className="page-heading">
        <p className="eyebrow">INTAKE TERMINAL // WORK ORDER REQUEST</p>
        <h1>Quote Request</h1>
        <p>Tell the garage what wandered in. Intake is a request only. Scope and pricing must be agreed before work begins, and submitting this form does not create a charge.</p>
      </header>

      {selectedService && (
        <div className="quote-context" aria-label="Selected service context">
          <span className="panel-kicker">SELECTED SERVICE</span>
          <strong>{selectedService.name}</strong>
          <span>{selectedService.pricingModel === 'hourly' ? '$' + selectedService.startingPrice + ' / hour' : 'Quote required'}</span>
        </div>
      )}

      <form className="quote-form" onSubmit={submit} noValidate>
        <Field label="Name" name="name" required value={form.name} onChange={update} error={errors.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" required value={form.email} onChange={update} error={errors.email} autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} autoComplete="tel" />

        <label>
          Service <span aria-hidden="true">*</span>
          <select name="service" required value={form.service} onChange={update} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'service-error' : undefined}>
            <option value="">Choose a service</option>
            {services.map((service) => <option key={service.id} value={service.slug}>{service.name}</option>)}
          </select>
          {errors.service && <span id="service-error" className="field-error">{errors.service}</span>}
        </label>

        <Field label="Platform / device" name="platform" value={form.platform} onChange={update} error={errors.platform} placeholder="Website, Linux, Raspberry Pi, Android, Windows, mixed…" />

        <label>
          Urgency <span aria-hidden="true">*</span>
          <select name="urgency" required value={form.urgency} onChange={update} aria-invalid={Boolean(errors.urgency)} aria-describedby={errors.urgency ? 'urgency-error' : undefined}>
            {urgencyOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          {errors.urgency && <span id="urgency-error" className="field-error">{errors.urgency}</span>}
        </label>

        <label>
          Engagement
          <select name="engagement" value={form.engagement} onChange={update}>
            <option value="">Not sure yet</option>
            {engagementOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>

        <Field label="What are we fixing or building?" name="project" required value={form.project} onChange={update} error={errors.project} />
        <Field label="Budget range" name="budget" value={form.budget} onChange={update} error={errors.budget} />
        <Field label="Deadline / target date" name="deadline" value={form.deadline} onChange={update} error={errors.deadline} />

        <TextField label="What happened / current problem?" name="problem" value={form.problem} onChange={update} error={errors.problem} />
        <TextField label="Desired outcome" name="outcome" required value={form.outcome} onChange={update} error={errors.outcome} />
        <TextField label="Additional details" name="details" value={form.details} onChange={update} error={errors.details} />

        <label className="honeypot" aria-hidden="true">
          Company website
          <input name="companyWebsite" tabIndex="-1" autoComplete="off" value={form.companyWebsite} onChange={update} />
        </label>

        <div className="full-field privacy-note">
          <strong>Keep secrets out of the intake form.</strong>
          <p>Do not include passwords, private keys, payment details, API secrets, seed phrases, or other authentication secrets.</p>
        </div>

        <div className="full-field">
          <button type="submit" className="button button-primary" disabled={status.type === 'submitting'}>
            {status.type === 'submitting' ? 'Sending…' : 'Submit Work Order Request'}
          </button>
          <p className="fine-print">Requests are reviewed before any work, payment, or commitment begins.</p>
          {status.message && (
            <p className={'form-status ' + status.type} role="status" aria-live="polite">{status.message}</p>
          )}
        </div>
      </form>
    </section>
  );
}

function Field({ label, name, required = false, error, ...props }) {
  const errorId = name + '-error';
  return (
    <label>
      {label}{required && <span aria-hidden="true"> *</span>}
      <input
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <span id={errorId} className="field-error">{error}</span>}
    </label>
  );
}

function TextField({ label, name, required = false, error, ...props }) {
  const errorId = name + '-error';
  return (
    <label className="full-field">
      {label}{required && <span aria-hidden="true"> *</span>}
      <textarea
        name={name}
        rows="5"
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <span id={errorId} className="field-error">{error}</span>}
    </label>
  );
}
