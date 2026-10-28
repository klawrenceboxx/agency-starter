const cfg = $('Config').first().json
const L = $('Validate & normalize').first().json.lead
const rows = $input.all().map(i => i.json).filter(r => r && r.email)
const ex = rows.find(r => String(r.email).toLowerCase().trim() === L.email)
const T = x => String(x == null ? '' : x).toUpperCase() === 'TRUE'
const now = new Date(), iso = now.toISOString()
// New opt-ins can grant consent. Unticked boxes on a later inquiry never reinstate an opt-out
// or silently erase earlier express consent: opt-outs are handled by dedicated opt-out flows.
const emailOptedOut = !!(ex && (T(ex.unsubscribe_status) || String(ex.email_status || '').toLowerCase() === 'unsubscribed'))
const smsOptedOut = !!(ex && (T(ex.sms_opted_out) || T(ex.sms_opt_out) || String(ex.sms_status || '').toLowerCase() === 'unsubscribed' || !!ex.sms_opt_out_date))
const emailConsent = !emailOptedOut && (L.email_marketing_consent || !!(ex && T(ex.email_marketing_consent)))
const smsConsent = !smsOptedOut && (L.sms_marketing_consent || !!(ex && T(ex.sms_marketing_consent)))
// Attribution (2026-10-28): only write tags that came with this submission, so a later
// untagged visit never wipes the guide/email that brought them. "'" keeps 002 as text.
const A = L.attribution || {}
const attr = {}
for (const k of Object.keys(A)) if (A[k]) attr[k] = k === 'resource' ? "'" + A[k] : A[k]
const contact = { ...(L.budget ? { budget: L.budget } : {}), email: L.email, name: L.name, phone: L.phone || (ex && ex.phone) || '', website: L.website, updated_at: iso, last_submission_at: iso, ...attr }
const consentFields = {
  email_marketing_consent: emailConsent ? 'TRUE' : 'FALSE',
  sms_marketing_consent: smsConsent ? 'TRUE' : 'FALSE',
}
if (L.email_marketing_consent && !emailOptedOut) {
  consentFields.email_consent_at = iso
  consentFields.email_consent_source = 'BOXX /audit checkbox'
}
if (L.sms_marketing_consent && !smsOptedOut) {
  consentFields.sms_consent_at = iso
  consentFields.sms_consent_source = 'BOXX /audit checkbox'
}
const fresh = { interest: L.interest, budget: L.budget, source: L.source, nurture_path: L.nurture_path,
  nurture_status: emailConsent ? 'ACTIVE' : 'HELD', current_email: 0,
  framework_delivered: 'FALSE', next_email_due_at: '', stop_reason: emailConsent ? '' : 'no_email_marketing_consent' }
let row, sendEmail1 = false, reason, isNew = false
if (!ex) {
  isNew = true; sendEmail1 = true; reason = 'new_lead'
  row = Object.assign({ lead_id: 'ld_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), created_at: iso,
    calendly_booked: 'FALSE', unsubscribe_status: 'FALSE', client_status: 'PROSPECT', loom_status: 'PENDING',
    sms_status: smsConsent ? 'subscribed' : 'not_subscribed', sms_opted_out: 'FALSE',
    first_touch: L.first_touch || '' }, contact, fresh, consentFields)
} else {
  const bookedOrClient = T(ex.calendly_booked) || String(ex.client_status || '').toUpperCase() === 'ACTIVE'
  const start = new Date(ex.framework_delivered_at || ex.created_at)
  const ageDays = isNaN(start) ? 0 : (now - start) / 864e5
  // Existing lead: avoid duplicate fulfillment; keep booking and opt-out status intact.
  if (!bookedOrClient && !emailOptedOut && ageDays > cfg.resendAfterDays) {
    sendEmail1 = true; reason = 'resend_after_' + cfg.resendAfterDays + '_days'
    row = Object.assign({}, contact, fresh, consentFields)
  } else {
    reason = bookedOrClient ? 'existing_lead_booked_or_client' : emailOptedOut ? 'existing_email_opted_out' : 'duplicate_within_window'
    row = Object.assign({}, contact, consentFields)
    // When an existing previously HELD lead opts into marketing, allow scheduler to begin
    // only if a fulfillment email was already sent. Never invent a delivered timestamp.
    if (String(ex.nurture_status || '').toUpperCase() === 'HELD' && emailConsent && T(ex.framework_delivered)) {
      row.nurture_status = 'ACTIVE'; row.stop_reason = ''
    }
  }
  if (!ex.first_touch && L.first_touch) row.first_touch = L.first_touch
}
// Do not mark SMS as subscribed if the CRM has an explicit STOP record.
if (smsOptedOut) row.sms_marketing_consent = 'FALSE'
const lead = Object.assign({}, L, { lead_id: ex ? ex.lead_id : row.lead_id })
// One attempt per lead, including prior pending/failed attempts that need manual reconciliation.
const priorSMSAttempt = !!(ex && (ex.sms_confirmation_sid || ex.sms_confirmation_at || ex.sms_confirmation_status || ['pending','accepted','queued','sent','delivered','failed','undelivered'].includes(String(ex.sms_status || '').toLowerCase())))
const sendSMS1 = sendEmail1 && L.sms_marketing_consent === true && smsConsent && !!L.phone && !smsOptedOut && !priorSMSAttempt
return [{ json: { sendEmail1, sendSMS1, reason, isNew, row, lead, emailConsent, smsConsent } }]
