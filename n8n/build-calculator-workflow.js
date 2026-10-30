// Generates the importable "BOXX - Calculator Lead" workflow.
// Run: node n8n/build-calculator-workflow.js   ->  n8n/workflows/6-boxx-calculator-lead.json
//
// Flow: /tools/missed-lead-calculator email box -> validate -> upsert "Calculator Leads" tab -> respond 200.
// Own tab on purpose (same reason as Guide Leads): writing to "Leads" would make a later audit request
// look like a duplicate and skip the audit's Email 1.
// Create the "Calculator Leads" tab with the headers in CALC_HEADERS (printed at the end) before activating.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const uuid = () => crypto.randomUUID()
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'REPLACE_ME', name: 'Google Sheets account' } }
const ORIGIN = 'https://boxxautomations.space'

const CONFIG_CODE = `// ====== BOXX CALCULATOR LEAD CONFIG (secrets live in n8n Credentials, not here) ======
return [{ json: { sheetId: '16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g', siteUrl: '${ORIGIN}' } }]`

// Exported separately so n8n/test-calculator-logic.js can run the exact same code.
const VALIDATE_CODE = `const b = $('Calculator webhook').first().json.body || {}
const clean = s => String(s == null ? '' : s).replace(/[\\u0000-\\u001f\\u007f<>]/g, '').trim()
const num = (v, min, max) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : NaN }
const errors = []
const email = clean(b.email).toLowerCase()
if (email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email)) errors.push('invalid_email')
if (clean(b.company)) errors.push('honeypot')
if (b.email_marketing_consent !== true) errors.push('no_consent')
const leads = num(b.leads_per_month, 0, 100000), missed = num(b.missed_pct, 0, 100)
const close = num(b.close_pct, 0, 100), value = num(b.job_value, 0, 10000000)
if ([leads, missed, close, value].some(n => Number.isNaN(n))) errors.push('bad_numbers')
const now = new Date().toISOString()
const lead = {
  email,
  email_marketing_consent: b.email_marketing_consent === true ? 'TRUE' : 'FALSE',
  email_consent_at: now,
  consent_text: clean(b.consent_text).slice(0, 300),
  leads_per_month: leads, missed_pct: missed, close_pct: close, job_value: value,
  lost_monthly: Math.round(leads * missed / 100 * close / 100 * value),
  lost_yearly: Math.round(leads * missed / 100 * close / 100 * value * 12),
  source: clean(b.source).slice(0, 60) || 'missed-lead-calculator',
  page: clean(b.page).slice(0, 300),
  utm_source: clean(b.utm_source).slice(0, 60), utm_medium: clean(b.utm_medium).slice(0, 60),
  utm_campaign: clean(b.utm_campaign).slice(0, 80), utm_content: clean(b.utm_content).slice(0, 80),
  resource: clean(b.resource).slice(0, 10), channel: clean(b.channel).slice(0, 40),
  arrived_from_dlv: clean(b.dlv).slice(0, 60), first_touch: clean(b.first_touch).slice(0, 600),
  updated_at: now,
}
return [{ json: { ok: errors.length === 0, errors, lead, raw: JSON.stringify(b).slice(0, 1500) } }]`

const ERROR_ROW_CODE = `const v = $input.first().json
return [{ json: { error_id: 'err_' + Date.now().toString(36), timestamp: new Date().toISOString(),
  workflow: 'BOXX - Calculator Lead', email: v.lead.email, error_message: 'invalid_submission: ' + v.errors.join(','), payload: v.raw } }]`

const ROW_CODE = `return [{ json: $('Validate & normalize').first().json.lead }]`

const CALC_HEADERS = ['email', 'email_marketing_consent', 'email_consent_at', 'consent_text', 'leads_per_month', 'missed_pct',
  'close_pct', 'job_value', 'lost_monthly', 'lost_yearly', 'source', 'page', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'resource', 'channel', 'arrived_from_dlv', 'first_touch', 'updated_at']

const respond = (name, id, pos, code, body) => ({
  id, position: pos, name, type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1,
  parameters: { respondWith: 'json', responseBody: body,
    options: { responseCode: code, responseHeaders: { entries: [{ name: 'Access-Control-Allow-Origin', value: ORIGIN }] } } },
})
const sheet = (name, id, pos, operation, tab, matching) => ({
  id, position: pos, name, type: 'n8n-nodes-base.googleSheets', typeVersion: 4.5, credentials: CRED_SHEETS,
  retryOnFail: true, maxTries: 3, waitBetweenTries: 2000,
  parameters: { resource: 'sheet', operation,
    documentId: { __rl: true, mode: 'id', value: "={{ $('Config').first().json.sheetId }}" },
    sheetName: { __rl: true, mode: 'name', value: tab },
    columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: matching, schema: [] },
    options: { handlingExtraData: 'ignoreIt' } },
})
const code = (name, id, pos, js) => ({ id, position: pos, name, type: 'n8n-nodes-base.code', typeVersion: 2, parameters: { jsCode: js } })

function build() {
  const nodes = [
    { id: uuid(), position: [0, 200], name: 'Calculator webhook', type: 'n8n-nodes-base.webhook', typeVersion: 2, webhookId: uuid(),
      parameters: { httpMethod: 'POST', path: 'boxx-calculator', responseMode: 'responseNode', options: { allowedOrigins: ORIGIN } } },
    code('Config', uuid(), [260, 200], CONFIG_CODE),
    code('Validate & normalize', uuid(), [520, 200], VALIDATE_CODE),
    { id: uuid(), position: [780, 200], name: 'Valid submission?', type: 'n8n-nodes-base.if', typeVersion: 2,
      parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 1 },
        conditions: [{ id: uuid(), leftValue: '={{ $json.ok }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }], combinator: 'and' }, options: {} } },
    code('Error row: invalid submission', uuid(), [1040, 400], ERROR_ROW_CODE),
    sheet('Log invalid submission', uuid(), [1300, 400], 'append', 'Error Log', []),
    respond('Respond 400', uuid(), [1560, 400], 400, "={{ JSON.stringify({ ok: false, errors: $('Validate & normalize').first().json.errors }) }}"),
    code('Row only', uuid(), [1040, 200], ROW_CODE),
    sheet('Save calculator lead (upsert by email)', uuid(), [1300, 200], 'appendOrUpdate', 'Calculator Leads', ['email']),
    respond('Respond 200', uuid(), [1560, 200], 200, '={{ JSON.stringify({ ok: true }) }}'),
    { id: uuid(), position: [0, 420], name: 'Setup notes', type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
      parameters: { width: 640, height: 320, content: '## BOXX - Calculator Lead\n1. Add a "Calculator Leads" tab to the CRM sheet with these headers (row 1):\n`' + CALC_HEADERS.join(', ') + '`\n2. Select your Google Sheets credential on both Sheets nodes.\n3. Activate, then set `NEXT_PUBLIC_CALCULATOR_WEBHOOK_URL` in Vercel to this workflow\'s production URL (…/webhook/boxx-calculator). The email box on /tools/missed-lead-calculator only appears once that env var is set.\n4. Consent is required: submissions without `email_marketing_consent: true` are rejected and logged.' } },
  ]
  const link = (from, to, idx = 0) => ({ [from]: { main: [[{ node: to, type: 'main', index: 0 }]] } })
  const connections = {
    ...link('Calculator webhook', 'Config'),
    ...link('Config', 'Validate & normalize'),
    ...link('Validate & normalize', 'Valid submission?'),
    'Valid submission?': { main: [[{ node: 'Row only', type: 'main', index: 0 }], [{ node: 'Error row: invalid submission', type: 'main', index: 0 }]] },
    ...link('Error row: invalid submission', 'Log invalid submission'),
    ...link('Log invalid submission', 'Respond 400'),
    ...link('Row only', 'Save calculator lead (upsert by email)'),
    ...link('Save calculator lead (upsert by email)', 'Respond 200'),
  }
  return { name: 'BOXX - Calculator Lead', nodes, connections, active: false, settings: { executionOrder: 'v1' }, pinData: {}, meta: { templateCredsSetupCompleted: false } }
}

module.exports = { VALIDATE_CODE, CALC_HEADERS, build }

if (require.main === module) {
  const out = path.join(__dirname, 'workflows', '6-boxx-calculator-lead.json')
  fs.writeFileSync(out, JSON.stringify(build(), null, 2) + '\n')
  console.log('Wrote', out)
  console.log('Calculator Leads tab headers:', CALC_HEADERS.join(','))
}
