'use client';

import { useEffect, useRef, useState } from 'react';

const PURPLE = '#AE12F4';
const SERVICES = [
  { value: 'WEBSITE', icon: '▣', title: 'My website', description: 'Turn more visitors into customers.' },
  { value: 'AUTOMATED_EMAILS', icon: '✉', title: 'My email follow-ups', description: 'Turn more leads into customers.' },
  { value: 'BOTH', icon: '▤', title: 'Both website & emails', description: 'Improve the full customer journey.' },
];
const BUDGETS = [
  { value: 'Under $1,000', title: 'Under $1,000', description: 'Starting small' },
  { value: '$1,000–$2,500', title: '$1,000–$2,500', description: 'Ready to invest' },
  { value: '$2,500+', title: '$2,500+', description: 'A more complete solution' },
  { value: 'Just exploring for now', title: 'Just exploring for now', description: 'Not ready to set a budget' },
];

/**
 * Visual replacement for the existing BOXX audit wizard.
 * Codex integration contract:
 * - Supply the existing submit handler as onSubmit(formData).
 * - Map SERVICES values to the existing CRM/nurture-path enum if necessary.
 * - Keep the existing validation, analytics, error handling, and backend payload contract.
 * - Pass phoneRequired={false} when the phone number is optional.
 * - Set smsConsentEnabled where the submit handler records SMS consent.
 */
export default function BoxxAuditForm({
  onSubmit,
  phoneRequired = true,
  smsConsentEnabled = false,
  websiteRequired = true,
}) {
  const submitLock = useRef(false);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    service: '', fullName: '', email: '', website: '', phone: '',
    emailConsent: false, smsConsent: false, budget: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => { if (step > 0) headingRef.current?.focus(); }, [step]);

  function validateContact() {
    const errors = {};
    if (form.fullName.trim().length < 2) errors.fullName = 'Enter your name so I know who the audit is for.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Enter an email like you@business.com.';
    if ((websiteRequired || form.website.trim()) && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(form.website.trim())) errors.website = 'Enter your website address, like yourbusiness.com.';
    if ((phoneRequired && !form.phone.trim()) || (form.phone.trim() && form.phone.replace(/\D/g, '').length < 10)) errors.phone = phoneRequired ? 'Enter a valid phone number, including area code.' : 'That number looks too short. Check it or leave it blank.';
    setFieldErrors(errors);
    const first = Object.keys(errors)[0];
    if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    return !first;
  }

  function validateStep() {
    if (step === 0 && !form.service) return 'Choose what you would like reviewed.';
    if (step === 1 && !validateContact()) return 'Check the highlighted fields.';
    return '';
  }

  function next() {
    const message = validateStep();
    if (message) { setError(message); return; }
    setError('');
    setStep((s) => Math.min(2, s + 1));
  }

  async function submit(event) {
    event.preventDefault();
    if (step !== 2 || submitLock.current) return;
    if (!form.service) { setStep(0); setError('Choose what you would like reviewed.'); return; }
    if (!validateContact()) { setStep(1); return; }
    if (typeof onSubmit !== 'function') {
      setError('The submission handler has not been connected yet.');
      return;
    }
    setError('');
    submitLock.current = true;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, smsConsent: smsConsentEnabled ? form.smsConsent : false });
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  const styles = {
    page: { background: '#15091F', color: '#F8F4FC', padding: '0', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
    shell: { maxWidth: 540, margin: '0 auto' },
    panel: { border: '1px solid #463052', borderRadius: 24, padding: '26px 22px', background: '#190B25' },
    card: (selected) => ({ width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', border: `1px solid ${selected ? PURPLE : '#483053'}`, background: selected ? '#311341' : '#21102D', color: '#F8F4FC', borderRadius: 15, padding: '16px 14px', cursor: 'pointer', minHeight: 82 }),
    input: { width: '100%', boxSizing: 'border-box', background: '#1A0B26', color: '#FFFFFF', border: '1px solid #4A3256', borderRadius: 12, padding: '15px 14px', fontSize: 16, outlineColor: PURPLE },
    button: { width: '100%', background: 'linear-gradient(145deg, #b54dff, #9c16f4 60%, #8513d1)', color: '#FFFFFF', border: 0, borderRadius: 12, padding: '16px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 },
    muted: { color: '#C8B6D2', lineHeight: 1.55 },
  };

  const heading = ['What would you like to improve?', 'Where should I send your free audit?', 'What budget would you be comfortable with?'][step];
  const subheading = ["I'll personally review your website, email follow-ups, or both. Free.", '', 'Your audit is completely free. This just helps me recommend the right next steps.'][step];

  return (
    <div className="boxx-audit-form" style={styles.page}>
      <div style={styles.shell}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <a className="logo" href="/" aria-label="Boxx Automations home"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span><b>BOXX AUTOMATIONS</b></a>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#C8B6D2', whiteSpace: 'nowrap' }}>Step {step + 1} of 3</span>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, marginBottom: 18 }} aria-label={`Step ${step + 1} of 3`}>
          {[0, 1, 2].map((index) => <div key={index} style={{ height: 6, borderRadius: 9, background: index <= step ? PURPLE : '#3B2548' }} />)}
        </div>

        <form ref={formRef} onSubmit={(event) => { if (step < 2) { event.preventDefault(); next(); } else submit(event); }} style={styles.panel} noValidate>
            <>
              <h2 id="audit-question" ref={headingRef} tabIndex={-1} style={{ fontSize: 'clamp(24px, 6vw, 32px)', lineHeight: 1.17, letterSpacing: '-.035em', margin: step === 1 ? '0 0 24px' : '0 0 12px', fontWeight: 750 }}>{heading}</h2>
              {subheading && <p style={{ ...styles.muted, fontSize: 15, margin: '0 0 26px' }}>{subheading}</p>}

              {step === 0 && <div style={{ display: 'grid', gap: 11 }}>
                {SERVICES.map((service) => <button type="button" key={service.value} aria-pressed={form.service === service.value} onClick={() => { update('service', service.value); setError(''); }} style={styles.card(form.service === service.value)}>
                  <span aria-hidden="true" style={{ width: 45, height: 45, flexShrink: 0, display: 'grid', placeItems: 'center', background: '#421354', borderRadius: 12, fontSize: 24, color: '#DB79FF' }}>{service.icon}</span>
                  <span style={{ flex: 1 }}><strong style={{ display: 'block', fontSize: 15, marginBottom: 5 }}>{service.title}</strong><span style={{ color: '#CBB9D6', fontSize: 13 }}>{service.description}</span></span>
                  <span aria-hidden="true" style={{ width: 19, height: 19, borderRadius: '50%', border: `2px solid ${form.service === service.value ? '#C652FF' : '#6B4C79'}`, background: form.service === service.value ? PURPLE : 'transparent', boxShadow: form.service === service.value ? 'inset 0 0 0 3px #311341' : 'none' }} />
                </button>)}
              </div>}

              {step === 1 && <div style={{ display: 'grid', gap: 16 }}>
                {[
                  { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'First and last name', required: true },
                  { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@business.com', required: true },
                  { key: 'website', label: 'Your website', type: 'url', placeholder: 'yourbusiness.com', required: websiteRequired },
                  { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '(416) 123-4567', required: phoneRequired },
                ].map((field) => <label key={field.key} style={{ display: 'grid', gap: 7 }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>{field.label}{!field.required && <span style={{ color: '#BDA9C9', fontWeight: 400 }}> (optional)</span>}</span>
                  <input className="audit-contact-input" name={field.key} autoComplete={{ fullName: 'name', email: 'email', website: 'url', phone: 'tel' }[field.key]} inputMode={field.key === 'website' ? 'url' : field.key === 'phone' ? 'tel' : field.key === 'email' ? 'email' : undefined} aria-invalid={!!fieldErrors[field.key]} aria-describedby={fieldErrors[field.key] ? `error-${field.key}` : undefined} type={field.type} value={form[field.key]} onChange={(e) => update(field.key, e.target.value)} placeholder={field.placeholder} required={field.required} style={{ ...styles.input, borderColor: fieldErrors[field.key] ? '#FFB8C0' : '#4A3256' }} />
                  {fieldErrors[field.key] && <span id={`error-${field.key}`} style={{ color: '#FFB8C0', fontSize: 13 }}>{fieldErrors[field.key]}</span>}
                </label>)}
                <div className="audit-consents">
                  <p style={{ fontSize: 13, color: '#CDBCD8', margin: 0 }}>Read our <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Terms of Service</a>.</p>
                  <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.5, color: '#CDBCD8' }}>
                    <input className="audit-consent-checkbox" name="email_marketing_consent" type="checkbox" checked={form.emailConsent} onChange={(e) => update('emailConsent', e.target.checked)} style={{ accentColor: PURPLE, width: 18, height: 18, flexShrink: 0 }} />
                    Yes, email me my audit follow-ups and occasional tips from BOXX Automations. I can unsubscribe at any time.
                  </label>
                  {smsConsentEnabled && <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.5, color: '#CDBCD8' }}>
                    <input className="audit-consent-checkbox" name="sms_marketing_consent" type="checkbox" checked={form.smsConsent} onChange={(e) => update('smsConsent', e.target.checked)} style={{ accentColor: PURPLE, width: 18, height: 18, flexShrink: 0 }} />
                    Yes, text me follow-ups and occasional tips from BOXX Automations. Message frequency varies. Reply STOP to opt out.
                  </label>}
                </div>
              </div>}

              {step === 2 && <div style={{ display: 'grid', gap: 11 }}>
                {BUDGETS.map((budget) => <button key={budget.value} type="button" aria-pressed={form.budget === budget.value} onClick={() => update('budget', form.budget === budget.value ? '' : budget.value)} style={styles.card(form.budget === budget.value)}>
                  <span style={{ flex: 1 }}><strong style={{ display: 'block', fontSize: 15, marginBottom: 5 }}>{budget.title}</strong><span style={{ color: '#CBB9D6', fontSize: 13 }}>{budget.description}</span></span>
                  <span aria-hidden="true" style={{ width: 19, height: 19, borderRadius: '50%', border: `2px solid ${form.budget === budget.value ? '#C652FF' : '#6B4C79'}`, background: form.budget === budget.value ? PURPLE : 'transparent' }} />
                </button>)}
                <p style={{ ...styles.muted, fontSize: 12, margin: '2px 0 0' }}>Optional — you can submit without choosing a budget.</p>
              </div>}

              {step === 2 && <p style={{ ...styles.muted, fontSize: 12, marginBottom: 0 }}>Free. No sales call required.</p>}
              {error && <p role="alert" style={{ color: '#FFB8C0', fontSize: 13, marginTop: 16 }}>{error}</p>}

              <div style={{ marginTop: 25 }}>
                {step < 2 ? <button type="button" style={styles.button} onClick={next}>Continue →</button> : <button type="submit" style={{ ...styles.button, opacity: submitting ? .7 : 1 }} disabled={submitting} aria-busy={submitting}>{submitting ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><svg className="audit-submit-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25" /><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Submitting…</span> : 'Send My Free Audit →'}</button>}
              </div>
              {step > 0 && <button type="button" disabled={submitting} onClick={() => { setError(''); setStep((s) => s - 1); }} style={{ border: 0, background: 'transparent', color: '#D7B7EE', padding: '14px 0 0', cursor: 'pointer', fontSize: 14 }}>← Back</button>}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 22, color: '#BDA9C9', fontSize: 12 }}><span>No sales call required</span><span>Free personal audit</span></div>
            </>
        </form>
      </div>
    </div>
  );
}
