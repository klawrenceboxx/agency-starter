// Generates the importable n8n workflows. Run: node n8n/build-workflows.js
// Output: n8n/workflows/*.json  (import via n8n: Workflows > Import from file)
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// ---------------------------------------------------------------- helpers
const uuid = () => crypto.randomUUID()
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'REPLACE_ME', name: 'Google Sheets account' } }
const CRED_SG = { httpHeaderAuth: { id: 'REPLACE_ME', name: 'SendGrid API key' } }
const CRED_CAL = { calendlyApi: { id: 'REPLACE_ME', name: 'Calendly account' } }

function workflow(name) {
  const nodes = []
  const connections = {}
  const add = (n, x, y) => {
    nodes.push({ id: uuid(), position: [x * 260, y * 200], ...n })
    return n.name
  }
  const link = (from, to, out = 0) => {
    connections[from] = connections[from] || { main: [] }
    while (connections[from].main.length <= out) connections[from].main.push([])
    connections[from].main[out].push({ node: to, type: 'main', index: 0 })
  }
  const chain = (...names) => names.slice(1).forEach((n, i) => link(names[i], n))
  return { name, nodes, connections, add, link, chain }
}

const code = (name, js, mode = 'runOnceForAllItems') => ({
  name, type: 'n8n-nodes-base.code', typeVersion: 2, parameters: { mode, jsCode: js },
})
// IF v2 uses the filter schema; the legacy boolean/string collections belong to IF v1.
const ifEquals = (leftValue, rightValue, type) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 1 },
    conditions: [{ id: uuid(), leftValue, rightValue, operator: { type, operation: 'equals' } }],
    combinator: 'and',
  },
  options: {},
})
const sheetDoc = cfgNode => ({ __rl: true, mode: 'id', value: `={{ $('${cfgNode}').first().json.sheetId }}` })
const sheetTab = t => ({ __rl: true, mode: 'name', value: t })
const sheetsRead = (name, cfgNode, tab, col, valueExpr) => ({
  name, type: 'n8n-nodes-base.googleSheets', typeVersion: 4.5, alwaysOutputData: true, credentials: CRED_SHEETS,
  parameters: {
    resource: 'sheet', operation: 'read', documentId: sheetDoc(cfgNode), sheetName: sheetTab(tab),
    filtersUI: { values: [{ lookupColumn: col, lookupValue: valueExpr }] }, options: {},
  },
})
const sheetsWrite = (name, cfgNode, tab, operation, match) => ({
  name, type: 'n8n-nodes-base.googleSheets', typeVersion: 4.5, credentials: CRED_SHEETS,
  retryOnFail: true, maxTries: 3, waitBetweenTries: 2000,
  parameters: {
    resource: 'sheet', operation, documentId: sheetDoc(cfgNode), sheetName: sheetTab(tab),
    columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: match ? [match] : [], schema: [] },
    options: {},
  },
})
const sendgrid = (name, { errorOutput = false } = {}) => ({
  name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, credentials: CRED_SG,
  retryOnFail: true, maxTries: 3, waitBetweenTries: 2000,
  ...(errorOutput ? { onError: 'continueErrorOutput' } : { onError: 'continueRegularOutput' }),
  parameters: {
    method: 'POST', url: 'https://api.sendgrid.com/v3/mail/send',
    authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
    sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.sgBody) }}',
    options: { response: { response: { fullResponse: true } } },
  },
})
const sticky = (content, w = 420, h = 260) => ({
  name: 'Setup notes', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, parameters: { content, width: w, height: h },
})

// ------------------------------------------------- shared code snippets
const CONFIG_JS = String.raw`// ====== EDIT THESE (placeholders only. Secrets live in n8n Credentials, not here) ======
// Keep the same values in all three BOXX workflows.
const fiveTemplates = ['d-REPLACE_1', 'd-REPLACE_2', 'd-REPLACE_3', 'd-REPLACE_4', 'd-REPLACE_5']
return [{ json: {
  sheetId: 'REPLACE_WITH_GOOGLE_SHEET_ID',
  siteUrl: 'https://boxxautomations.space',
  frameworkUrl: 'https://boxxautomations.space/BOXX-Website-Conversion-Framework.pdf',
  calendlyUrl: 'https://calendly.com/kaleellawrenceboxx/discovery-call',
  fromEmail: 'REPLACE_VERIFIED_SENDER@yourdomain.com',
  fromName: 'Kaleel at BOXX',
  replyTo: 'REPLACE_REPLY_TO@yourdomain.com',
  notifyEmail: 'kaleellawrenceboxx@gmail.com',
  mailingAddress: 'REPLACE: BOXX Automations, street address, Vaughan, ON, Canada',
  asmGroupId: 0, // SendGrid unsubscribe group ID (number)
  // Nurture timing: days after Email 1 for Emails 2,3,4,5. Change here only.
  cadenceDays: [2, 4, 7, 10],
  resendAfterDays: 30,
  // Booked-call reminders (hours before the call)
  dayBeforeHours: 24,
  sameDayHours: 3,
  completedAfterHours: 1,
  // SendGrid dynamic template IDs. One 5-email list per path (can all point to the same 5 for now).
  templates: {
    WEBSITE: fiveTemplates.slice(),
    EMAIL: fiveTemplates.slice(),
    BOTH: fiveTemplates.slice(),
    confirm: 'd-REPLACE_CONFIRM',
    reminder24: 'd-REPLACE_REMINDER_24H',
    reminderDay: 'd-REPLACE_REMINDER_SAMEDAY',
  },
  subjects: [
    'Your BOXX Website Conversion Framework',
    'Every page should ask for one thing',
    'What fixing a homepage looks like',
    'The proof I can show you right now',
    'Straight answers before you decide',
  ],
  bookingSubjects: { confirm: 'You are booked: your BOXX call', reminder24: 'Reminder: your BOXX call is tomorrow', reminderDay: 'Your BOXX call is today' },
} }]`

const SG_COMMON = String.raw`const rnd = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
const baseData = cfg => ({ site_url: cfg.siteUrl, calendly_url: cfg.calendlyUrl, framework_url: cfg.frameworkUrl, mailing_address: cfg.mailingAddress })`

const errorRow = (workflowName, buildNode) => String.raw`const res = $input.item.json
const src = $('${buildNode}').item.json
return { json: {
  error_id: 'err_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  timestamp: new Date().toISOString(),
  workflow: '${workflowName}',
  email: src.meta.email,
  error_message: String((res.error && res.error.message) || res.message || 'SendGrid send failed').slice(0, 500),
  payload: JSON.stringify(src.meta),
} }`

const eventRow = buildNode => String.raw`const res = $input.item.json
const src = $('${buildNode}').item.json
return { json: {
  event_id: 'evt_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  lead_id: src.meta.lead_id, email: src.meta.email, email_type: src.meta.email_type,
  template_id: src.sgBody.template_id, sent_at: new Date().toISOString(),
  message_id: (res.headers || {})['x-message-id'] || '', status: 'sent',
} }`

// ======================================================================
// 1) BOXX Lead Intake
// ======================================================================
function intake() {
  const W = workflow('BOXX - Lead Intake')
  const A = W.add

  A({ name: 'Audit form webhook', type: 'n8n-nodes-base.webhook', typeVersion: 2, webhookId: uuid(),
    parameters: { httpMethod: 'POST', path: 'boxx-lead', responseMode: 'responseNode',
      options: { allowedOrigins: 'https://boxxautomations.space' } } }, 0, 1)
  A(code('Config', CONFIG_JS), 1, 1)

  A(code('Validate & normalize', String.raw`const b = $('Audit form webhook').first().json.body || {}
const clean = s => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').trim()
const errors = []
const email = clean(b.email).toLowerCase()
if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('invalid_email')
const name = clean(b.name).slice(0, 100)
if (name.length < 2) errors.push('missing_name')
const website = clean(b.website).toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '').slice(0, 200)
if (!/^[^\s.\/]+(\.[^\s.\/]+)+(\/\S*)?$/.test(website)) errors.push('invalid_website')
const svc = (Array.isArray(b.services) ? b.services : []).map(s => clean(s).toLowerCase())
const hasW = svc.includes('website'), hasE = svc.includes('emails')
if (!hasW && !hasE) errors.push('unknown_interest')
const budgets = ['under-1000', '1000-2500', '2500-plus']
const lead = {
  email, name, first_name: name.split(' ')[0], website,
  phone: clean(b.phone).slice(0, 30),
  interest: hasW && hasE ? 'both' : hasE ? 'emails' : 'website',
  nurture_path: hasW && hasE ? 'BOTH' : hasE ? 'EMAIL' : 'WEBSITE',
  budget: budgets.includes(clean(b.budget)) ? clean(b.budget) : '',
  source: clean(b.source).slice(0, 300),
}
return [{ json: { ok: errors.length === 0, errors, lead, raw: JSON.stringify(b).slice(0, 1500) } }]`), 2, 1)

  A({ name: 'Valid submission?', type: 'n8n-nodes-base.if', typeVersion: 2,
    parameters: ifEquals('={{ $json.ok }}', true, 'boolean') }, 3, 1)

  // invalid path
  A(code('Error row: invalid submission', String.raw`const v = $input.first().json
return [{ json: { error_id: 'err_' + Date.now().toString(36), timestamp: new Date().toISOString(),
  workflow: 'BOXX - Lead Intake', email: v.lead.email, error_message: 'invalid_submission: ' + v.errors.join(','), payload: v.raw } }]`), 4, 0)
  A(sheetsWrite('Log invalid submission', 'Config', 'Error Log', 'append'), 5, 0)
  A({ name: 'Respond 400', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1,
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify({ ok: false, errors: $(\'Validate & normalize\').first().json.errors }) }}',
      options: { responseCode: 400, responseHeaders: { entries: [{ name: 'Access-Control-Allow-Origin', value: 'https://boxxautomations.space' }] } } } }, 6, 0)

  // valid path
  A(sheetsRead('Find existing lead', 'Config', 'Leads', 'email', "={{ $('Validate & normalize').first().json.lead.email }}"), 4, 2)
  A(code('Decide', String.raw`const cfg = $('Config').first().json
const v = $('Validate & normalize').first().json
const L = v.lead
const rows = $input.all().map(i => i.json).filter(r => r && r.email)
const ex = rows.find(r => String(r.email).toLowerCase().trim() === L.email)
const T = x => String(x == null ? '' : x).toUpperCase() === 'TRUE'
const now = new Date(), iso = now.toISOString()
const contact = { email: L.email, name: L.name, phone: L.phone, website: L.website, updated_at: iso, last_submission_at: iso }
const fresh = { interest: L.interest, budget: L.budget, source: L.source, nurture_path: L.nurture_path,
  nurture_status: 'ACTIVE', current_email: 0, framework_delivered: 'FALSE', next_email_due_at: '', stop_reason: '' }
let row, sendEmail1 = false, reason, isNew = false
if (!ex) {
  isNew = true; sendEmail1 = true; reason = 'new_lead'
  row = Object.assign({ lead_id: 'ld_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), created_at: iso,
    calendly_booked: 'FALSE', unsubscribe_status: 'FALSE', client_status: 'PROSPECT', loom_status: 'PENDING' }, contact, fresh)
} else {
  const blocked = T(ex.unsubscribe_status) || T(ex.calendly_booked) || String(ex.client_status || '').toUpperCase() === 'ACTIVE'
  const start = new Date(ex.framework_delivered_at || ex.created_at)
  const ageDays = isNaN(start) ? 0 : (now - start) / 864e5
  if (!blocked && ageDays > cfg.resendAfterDays) {
    sendEmail1 = true; reason = 'resend_after_' + cfg.resendAfterDays + '_days'; row = Object.assign({}, contact, fresh)
  } else {
    reason = blocked ? 'existing_lead_blocked' : 'duplicate_within_window'; row = contact
  }
}
const lead = Object.assign({}, L, { lead_id: ex ? ex.lead_id : row.lead_id })
return [{ json: { sendEmail1, reason, isNew, row, lead } }]`), 5, 2)
  A(code('Row only', String.raw`return [{ json: $input.first().json.row }]`), 6, 2)
  A(sheetsWrite('Save lead (upsert by email)', 'Config', 'Leads', 'appendOrUpdate', 'email'), 7, 2)
  A({ name: 'Respond 200', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1,
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify({ ok: true }) }}',
      options: { responseCode: 200, responseHeaders: { entries: [{ name: 'Access-Control-Allow-Origin', value: 'https://boxxautomations.space' }] } } } }, 8, 2)

  A(code('Build notify email', String.raw`const cfg = $('Config').first().json
const d = $('Decide').first().json, L = d.lead
const lines = ['Name: ' + L.name, 'Email: ' + L.email, 'Phone: ' + (L.phone || '-'), 'Website: ' + L.website,
  'Interest: ' + L.interest + ' (path ' + L.nurture_path + ')', 'Budget: ' + (L.budget || '-'), 'Source: ' + (L.source || '-'), '', 'System action: ' + d.reason]
const subject = (d.isNew ? 'New audit request: ' : 'Repeat audit request: ') + L.name + ' (' + L.website + ')'
return [{ json: { sgBody: {
  personalizations: [{ to: [{ email: cfg.notifyEmail }], subject }],
  from: { email: cfg.fromEmail, name: 'BOXX system' },
  content: [{ type: 'text/plain', value: lines.join('\n') }],
}, meta: { email: L.email } } }]`), 9, 2)
  A(sendgrid('Notify Kaleel'), 10, 2)

  A({ name: 'Send Email 1?', type: 'n8n-nodes-base.if', typeVersion: 2,
    parameters: ifEquals("={{ $('Decide').first().json.sendEmail1 }}", true, 'boolean') }, 11, 2)

  A(code('Build Email 1 request', SG_COMMON + String.raw`
const cfg = $('Config').first().json
const L = $('Decide').first().json.lead
return [{ json: { sgBody: {
  personalizations: [{ to: [{ email: L.email }], subject: cfg.subjects[0],
    dynamic_template_data: Object.assign(baseData(cfg), { first_name: L.first_name, website: L.website, subject: cfg.subjects[0] }) }],
  from: { email: cfg.fromEmail, name: cfg.fromName }, reply_to: { email: cfg.replyTo },
  template_id: cfg.templates[L.nurture_path][0],
  asm: { group_id: cfg.asmGroupId },
  categories: ['boxx-nurture', 'email-1'], custom_args: { lead_id: L.lead_id, email_type: 'nurture-1' },
}, meta: { lead_id: L.lead_id, email: L.email, email_type: 'nurture-1' } } }]`), 12, 1)
  A(sendgrid('Send Email 1 (SendGrid)', { errorOutput: true }), 13, 1)
  A(code('Row: Email 1 sent', String.raw`const cfg = $('Config').first().json
const m = $('Build Email 1 request').first().json.meta
const now = new Date()
return [{ json: { email: m.email, framework_delivered: 'TRUE', framework_delivered_at: now.toISOString(), current_email: 1,
  last_email_sent_at: now.toISOString(), next_email_due_at: new Date(now.getTime() + cfg.cadenceDays[0] * 864e5).toISOString(),
  nurture_status: 'ACTIVE', updated_at: now.toISOString() } }]`), 14, 0)
  A(sheetsWrite('Mark Email 1 sent', 'Config', 'Leads', 'appendOrUpdate', 'email'), 15, 0)
  A(code('Row: Email 1 event', eventRow('Build Email 1 request'), 'runOnceForEachItem'), 14, 1)
  A(sheetsWrite('Log Email 1 event', 'Config', 'Email Events', 'append'), 15, 1)
  A(code('Row: Email 1 error', errorRow('BOXX - Lead Intake', 'Build Email 1 request'), 'runOnceForEachItem'), 14, 3)
  A(sheetsWrite('Log Email 1 failure', 'Config', 'Error Log', 'append'), 15, 3)

  A(sticky(
    '## BOXX - Lead Intake\nWebhook for the site audit form (Sanity siteSettings.n8nLeadWebhookUrl = the PRODUCTION URL of this node).\n\n1. Edit the **Config** node (placeholders).\n2. Assign credentials: Google Sheets, SendGrid (Header Auth: Authorization = Bearer <key>).\n3. Test URL for testing, then publish and use the Production URL.\n\nDedupes by lowercased email. Re-sends Email 1 only after `resendAfterDays`. If SendGrid fails 3x it is logged to Error Log and the scheduler retries Email 1 for up to 48h.'), 0, -2)

  W.chain('Audit form webhook', 'Config', 'Validate & normalize', 'Valid submission?')
  W.link('Valid submission?', 'Find existing lead', 0)
  W.link('Valid submission?', 'Error row: invalid submission', 1)
  W.chain('Error row: invalid submission', 'Log invalid submission', 'Respond 400')
  W.chain('Find existing lead', 'Decide', 'Row only', 'Save lead (upsert by email)', 'Respond 200', 'Build notify email', 'Notify Kaleel', 'Send Email 1?')
  W.link('Send Email 1?', 'Build Email 1 request', 0)
  W.link('Build Email 1 request', 'Send Email 1 (SendGrid)')
  W.link('Send Email 1 (SendGrid)', 'Row: Email 1 sent', 0)
  W.link('Send Email 1 (SendGrid)', 'Row: Email 1 event', 0)
  W.link('Send Email 1 (SendGrid)', 'Row: Email 1 error', 1)
  W.chain('Row: Email 1 sent', 'Mark Email 1 sent')
  W.chain('Row: Email 1 event', 'Log Email 1 event')
  W.chain('Row: Email 1 error', 'Log Email 1 failure')
  return W
}

// ======================================================================
// 2) BOXX Nurture Scheduler
// ======================================================================
function scheduler() {
  const W = workflow('BOXX - Nurture Scheduler')
  const A = W.add
  A({ name: 'Every 15 minutes', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2,
    parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: 15 }] } } }, 0, 1)
  A(code('Config', CONFIG_JS), 1, 1)
  A(sheetsRead('Get ACTIVE leads', 'Config', 'Leads', 'nurture_status', 'ACTIVE'), 2, 1)
  A(code('Plan sends', String.raw`const cfg = $('Config').first().json
const now = new Date()
const T = x => String(x == null ? '' : x).toUpperCase() === 'TRUE'
const out = []
for (const { json: r } of $input.all()) {
  if (!r.email) continue
  const cs = String(r.client_status || '').toUpperCase()
  let stop = ''
  if (String(r.nurture_status).toUpperCase() !== 'ACTIVE') continue
  if (T(r.unsubscribe_status)) stop = 'unsubscribed'
  else if (T(r.calendly_booked)) stop = 'booked'
  else if (cs === 'ACTIVE') stop = 'client_active'
  if (stop) { out.push({ json: { action: 'stop', email: r.email, reason: stop } }); continue }

  const delivered = T(r.framework_delivered)
  const last = parseInt(r.current_email || 0, 10) || 0
  const path = ['WEBSITE', 'EMAIL', 'BOTH'].includes(r.nurture_path) ? r.nurture_path : 'WEBSITE'
  let next, nextDue = ''
  if (!delivered) {
    const ageH = (now - new Date(r.created_at)) / 36e5
    if (!(ageH <= 48)) { out.push({ json: { action: 'stop', email: r.email, reason: 'email1_failed' } }); continue }
    next = 1
    nextDue = new Date(now.getTime() + cfg.cadenceDays[0] * 864e5).toISOString()
  } else {
    if (last >= 5) { out.push({ json: { action: 'complete', email: r.email, reason: 'sequence_complete' } }); continue }
    next = Math.max(last, 1) + 1
    let start = new Date(r.framework_delivered_at || r.last_email_sent_at)
    if (isNaN(start)) continue
    const due = new Date(start.getTime() + cfg.cadenceDays[next - 2] * 864e5)
    if (now < due) continue
    if (next < 5) nextDue = new Date(start.getTime() + cfg.cadenceDays[next - 1] * 864e5).toISOString()
  }
  out.push({ json: { action: 'send', email: r.email, lead_id: r.lead_id, first_name: String(r.name || '').split(' ')[0],
    website: r.website, path, n: next, nextDue } })
}
return out`), 3, 1)
  A({ name: 'Send due email?', type: 'n8n-nodes-base.if', typeVersion: 2,
    parameters: ifEquals('={{ $json.action }}', 'send', 'string') }, 4, 1)

  A(code('Row: stop lead', String.raw`const it = $input.item.json
return { json: { email: it.email, nurture_status: it.action === 'complete' ? 'COMPLETED' : 'STOPPED', stop_reason: it.reason, updated_at: new Date().toISOString() } }`, 'runOnceForEachItem'), 5, 3)
  A(sheetsWrite('Save stop', 'Config', 'Leads', 'appendOrUpdate', 'email'), 6, 3)

  A(code('Build SendGrid request', SG_COMMON + String.raw`
const cfg = $('Config').first().json
return $input.all().map(({ json: it }) => ({ json: { sgBody: {
  personalizations: [{ to: [{ email: it.email }], subject: cfg.subjects[it.n - 1],
    dynamic_template_data: Object.assign(baseData(cfg), { first_name: it.first_name, website: it.website, subject: cfg.subjects[it.n - 1] }) }],
  from: { email: cfg.fromEmail, name: cfg.fromName }, reply_to: { email: cfg.replyTo },
  template_id: cfg.templates[it.path][it.n - 1],
  asm: { group_id: cfg.asmGroupId },
  categories: ['boxx-nurture', 'email-' + it.n], custom_args: { lead_id: it.lead_id, email_type: 'nurture-' + it.n },
}, meta: { lead_id: it.lead_id, email: it.email, email_type: 'nurture-' + it.n, n: it.n, nextDue: it.nextDue } } }))`), 5, 0)
  A(sendgrid('Send email (SendGrid)', { errorOutput: true }), 6, 0)
  A(code('Row: lead advanced', String.raw`const m = $('Build SendGrid request').item.json.meta
const now = new Date().toISOString()
const row = { email: m.email, current_email: m.n, last_email_sent_at: now, next_email_due_at: m.nextDue || '',
  nurture_status: m.n >= 5 ? 'COMPLETED' : 'ACTIVE', updated_at: now }
if (m.n === 1) { row.framework_delivered = 'TRUE'; row.framework_delivered_at = now }
return { json: row }`, 'runOnceForEachItem'), 7, -0.3)
  A(sheetsWrite('Advance lead', 'Config', 'Leads', 'appendOrUpdate', 'email'), 8, -0.3)
  A(code('Row: email event', eventRow('Build SendGrid request'), 'runOnceForEachItem'), 7, 0.7)
  A(sheetsWrite('Log email event', 'Config', 'Email Events', 'append'), 8, 0.7)
  A(code('Row: send error', errorRow('BOXX - Nurture Scheduler', 'Build SendGrid request'), 'runOnceForEachItem'), 7, 1.7)
  A(sheetsWrite('Log send failure', 'Config', 'Error Log', 'append'), 8, 1.7)

  A(sticky('## BOXX - Nurture Scheduler\nRuns every 15 min. Reads leads where nurture_status = ACTIVE and sends the next email when due. Timing comes from `cadenceDays` in Config, measured from framework_delivered_at (no drift).\n\nBefore every send it re-checks: unsubscribed, booked, active client. Any hit marks the lead STOPPED and sends nothing. After Email 5 the lead is marked COMPLETED.\n\nA failed Email 1 (framework_delivered = FALSE) is retried here for up to 48h.\n\nKnown limit: SendGrid has no idempotency key. If the sheet write fails right after a successful send, the next run could resend. Failures are logged to Error Log.', 460, 330), 0, -2)

  W.chain('Every 15 minutes', 'Config', 'Get ACTIVE leads', 'Plan sends', 'Send due email?')
  W.link('Send due email?', 'Build SendGrid request', 0)
  W.link('Send due email?', 'Row: stop lead', 1)
  W.chain('Row: stop lead', 'Save stop')
  W.chain('Build SendGrid request', 'Send email (SendGrid)')
  W.link('Send email (SendGrid)', 'Row: lead advanced', 0)
  W.link('Send email (SendGrid)', 'Row: email event', 0)
  W.link('Send email (SendGrid)', 'Row: send error', 1)
  W.chain('Row: lead advanced', 'Advance lead')
  W.chain('Row: email event', 'Log email event')
  W.chain('Row: send error', 'Log send failure')
  return W
}

// ======================================================================
// 3) BOXX Booking Exit (Calendly -> stop nurture -> booked-call flow)
// ======================================================================
function booking() {
  const W = workflow('BOXX - Booking Exit')
  const A = W.add
  const eq = (v, out) => ({
    conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
      conditions: [{ id: uuid(), leftValue: '={{ $json.action }}', rightValue: v, operator: { type: 'string', operation: 'equals' } }], combinator: 'and' },
    renameOutput: true, outputKey: out,
  })

  // ---- Branch A: Calendly events
  A({ name: 'Calendly booking event', type: 'n8n-nodes-base.calendlyTrigger', typeVersion: 1, webhookId: uuid(), credentials: CRED_CAL,
    parameters: { authentication: 'apiKey', scope: 'user', events: ['invitee.created', 'invitee.canceled'] } }, 0, 1)
  A(code('Config', CONFIG_JS), 1, 1)
  A(code('Parse Calendly event', String.raw`const j = $('Calendly booking event').first().json
const pl = j.payload || (j.body && j.body.payload) || {}
const ev = j.event || (j.body && j.body.event) || ''
const se = pl.scheduled_event || {}
return [{ json: {
  type: ev === 'invitee.created' ? 'created' : ev === 'invitee.canceled' ? 'canceled' : 'ignore',
  email: String(pl.email || '').toLowerCase().trim(), name: pl.name || '',
  eventUri: se.uri || pl.event || '', startTime: se.start_time || '',
} }]`), 2, 1)
  A(sheetsRead('Find lead by email', 'Config', 'Leads', 'email', "={{ $('Parse Calendly event').first().json.email }}"), 3, 1)
  A(code('Decide booking', String.raw`const p = $('Parse Calendly event').first().json
const rows = $input.all().map(i => i.json).filter(r => r && r.email)
const ex = rows.find(r => String(r.email).toLowerCase().trim() === p.email)
const T = x => String(x == null ? '' : x).toUpperCase() === 'TRUE'
const iso = new Date().toISOString()
if (p.type === 'ignore' || !p.email) return [{ json: { action: 'ignore' } }]
if (!ex) return [{ json: { action: 'unmatched', p } }]
const isClient = String(ex.client_status || '').toUpperCase() === 'ACTIVE'
if (p.type === 'created') {
  if (ex.calendly_event_id === p.eventUri && T(ex.calendly_booked)) return [{ json: { action: 'duplicate' } }]
  const row = { email: ex.email, calendly_booked: 'TRUE', calendly_event_id: p.eventUri, call_date: p.startTime,
    nurture_status: 'STOPPED', stop_reason: 'booked', client_status: isClient ? 'ACTIVE' : 'CALL_BOOKED',
    reminder_24h_sent: 'FALSE', reminder_day_sent: 'FALSE', updated_at: iso }
  return [{ json: { action: 'booked', row, lead_id: ex.lead_id, email: ex.email, first_name: String(ex.name || p.name || '').split(' ')[0], startTime: p.startTime } }]
}
if (ex.calendly_event_id && ex.calendly_event_id !== p.eventUri) return [{ json: { action: 'stale_cancel' } }]
const row = { email: ex.email, calendly_booked: 'FALSE', calendly_event_id: '', call_date: '', client_status: isClient ? 'ACTIVE' : 'CALL_CANCELLED', updated_at: iso }
return [{ json: { action: 'canceled', row } }]`), 4, 1)
  A({ name: 'Route booking action', type: 'n8n-nodes-base.switch', typeVersion: 3,
    parameters: { rules: { values: [eq('booked', 'booked'), eq('canceled', 'canceled'), eq('unmatched', 'unmatched')] }, options: {} } }, 5, 1)

  A(code('Row only (booked)', String.raw`return [{ json: $input.first().json.row }]`), 6, 0)
  A(sheetsWrite('Save booking (stops nurture)', 'Config', 'Leads', 'appendOrUpdate', 'email'), 7, 0)
  A(code('Build confirmation email', SG_COMMON + String.raw`
const cfg = $('Config').first().json
const d = $('Decide booking').first().json
const callTime = new Date(d.startTime).toLocaleString('en-CA', { timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
return [{ json: { sgBody: {
  personalizations: [{ to: [{ email: d.email }], subject: cfg.bookingSubjects.confirm,
    dynamic_template_data: Object.assign(baseData(cfg), { first_name: d.first_name, call_time: callTime, subject: cfg.bookingSubjects.confirm }) }],
  from: { email: cfg.fromEmail, name: cfg.fromName }, reply_to: { email: cfg.replyTo },
  template_id: cfg.templates.confirm, asm: { group_id: cfg.asmGroupId },
  categories: ['boxx-booking', 'confirmation'], custom_args: { lead_id: d.lead_id, email_type: 'booking-confirmation' },
}, meta: { lead_id: d.lead_id, email: d.email, email_type: 'booking-confirmation' } } }]`), 8, 0)
  A(sendgrid('Send confirmation (SendGrid)', { errorOutput: true }), 9, 0)
  A(code('Row: confirmation event', eventRow('Build confirmation email'), 'runOnceForEachItem'), 10, 0)
  A(sheetsWrite('Log confirmation event', 'Config', 'Email Events', 'append'), 11, 0)
  A(code('Row: confirmation error', errorRow('BOXX - Booking Exit', 'Build confirmation email'), 'runOnceForEachItem'), 10, 1)
  A(sheetsWrite('Log confirmation failure', 'Config', 'Error Log', 'append'), 11, 1)

  A(code('Row only (canceled)', String.raw`return [{ json: $input.first().json.row }]`), 6, 2)
  A(sheetsWrite('Save cancellation (nurture stays stopped)', 'Config', 'Leads', 'appendOrUpdate', 'email'), 7, 2)

  A(code('Row: unmatched booking', String.raw`const p = $input.first().json.p
return [{ json: { error_id: 'err_' + Date.now().toString(36), timestamp: new Date().toISOString(), workflow: 'BOXX - Booking Exit',
  email: p.email, error_message: 'calendly_booking_no_matching_lead (booker may have used a different email)', payload: JSON.stringify(p) } }]`), 6, 3)
  A(sheetsWrite('Log unmatched booking', 'Config', 'Error Log', 'append'), 7, 3)

  // ---- Branch B: reminders + call-completed status
  A({ name: 'Every 15 minutes (reminders)', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2,
    parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: 15 }] } } }, 0, 6)
  A(code('Config (reminders)', CONFIG_JS), 1, 6)
  A(sheetsRead('Get booked leads', 'Config (reminders)', 'Leads', 'calendly_booked', 'TRUE'), 2, 6)
  A(code('Plan reminders', String.raw`const cfg = $('Config (reminders)').first().json
const now = new Date()
const T = x => String(x == null ? '' : x).toUpperCase() === 'TRUE'
const out = []
for (const { json: r } of $input.all()) {
  if (!r.email || !T(r.calendly_booked)) continue
  const call = new Date(r.call_date)
  if (isNaN(call)) continue
  const h = (call - now) / 36e5
  const base = { email: r.email, lead_id: r.lead_id, first_name: String(r.name || '').split(' ')[0],
    call_time: call.toLocaleString('en-CA', { timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }
  if (h <= 0) {
    if (h < -cfg.completedAfterHours && String(r.client_status).toUpperCase() === 'CALL_BOOKED') out.push({ json: Object.assign({ action: 'completed' }, base) })
    continue
  }
  if (h <= cfg.sameDayHours) { if (!T(r.reminder_day_sent)) out.push({ json: Object.assign({ action: 'remindDay' }, base) }) }
  else if (h <= cfg.dayBeforeHours) { if (!T(r.reminder_24h_sent)) out.push({ json: Object.assign({ action: 'remind24' }, base) }) }
}
return out`), 3, 6)
  A({ name: 'Call already happened?', type: 'n8n-nodes-base.if', typeVersion: 2,
    parameters: ifEquals('={{ $json.action }}', 'completed', 'string') }, 4, 6)
  A(code('Row: call completed', String.raw`return { json: { email: $input.item.json.email, client_status: 'CALL_COMPLETED', updated_at: new Date().toISOString() } }`, 'runOnceForEachItem'), 5, 5)
  A(sheetsWrite('Mark call completed', 'Config (reminders)', 'Leads', 'appendOrUpdate', 'email'), 6, 5)

  A(code('Build reminder email', SG_COMMON + String.raw`
const cfg = $('Config (reminders)').first().json
return $input.all().map(({ json: it }) => {
  const day = it.action === 'remindDay'
  const tpl = day ? cfg.templates.reminderDay : cfg.templates.reminder24
  const subj = day ? cfg.bookingSubjects.reminderDay : cfg.bookingSubjects.reminder24
  const type = day ? 'reminder-sameday' : 'reminder-24h'
  return { json: { sgBody: {
    personalizations: [{ to: [{ email: it.email }], subject: subj,
      dynamic_template_data: Object.assign(baseData(cfg), { first_name: it.first_name, call_time: it.call_time, subject: subj }) }],
    from: { email: cfg.fromEmail, name: cfg.fromName }, reply_to: { email: cfg.replyTo },
    template_id: tpl, asm: { group_id: cfg.asmGroupId },
    categories: ['boxx-booking', type], custom_args: { lead_id: it.lead_id, email_type: type },
  }, meta: { lead_id: it.lead_id, email: it.email, email_type: type, day } } }
})`), 5, 7)
  A(sendgrid('Send reminder (SendGrid)', { errorOutput: true }), 6, 7)
  A(code('Row: reminder sent', String.raw`const m = $('Build reminder email').item.json.meta
const row = { email: m.email, reminder_24h_sent: 'TRUE', updated_at: new Date().toISOString() }
if (m.day) row.reminder_day_sent = 'TRUE'
return { json: row }`, 'runOnceForEachItem'), 7, 6.6)
  A(sheetsWrite('Mark reminder sent', 'Config (reminders)', 'Leads', 'appendOrUpdate', 'email'), 8, 6.6)
  A(code('Row: reminder event', eventRow('Build reminder email'), 'runOnceForEachItem'), 7, 7.6)
  A(sheetsWrite('Log reminder event', 'Config (reminders)', 'Email Events', 'append'), 8, 7.6)
  A(code('Row: reminder error', errorRow('BOXX - Booking Exit', 'Build reminder email'), 'runOnceForEachItem'), 7, 8.6)
  A(sheetsWrite('Log reminder failure', 'Config (reminders)', 'Error Log', 'append'), 8, 8.6)

  A(sticky('## BOXX - Booking Exit\n**Top:** Calendly trigger. On a booking the lead gets calendly_booked = TRUE, nurture_status = STOPPED, client_status = CALL_BOOKED, and a branded confirmation is sent. Cancel/reschedule never restarts nurture (a stale cancel from a reschedule is ignored). A booker whose email matches no lead is logged to Error Log.\n\n**Bottom:** every 15 min sends the 24h and same-day reminders, and flips client_status to CALL_COMPLETED once the call time has passed. Proposal / access checklist / invoice stay manual.\n\nCalendly webhooks need a paid Calendly plan.', 470, 330), 0, -2)

  W.chain('Calendly booking event', 'Config', 'Parse Calendly event', 'Find lead by email', 'Decide booking', 'Route booking action')
  W.link('Route booking action', 'Row only (booked)', 0)
  W.link('Route booking action', 'Row only (canceled)', 1)
  W.link('Route booking action', 'Row: unmatched booking', 2)
  W.chain('Row only (booked)', 'Save booking (stops nurture)', 'Build confirmation email', 'Send confirmation (SendGrid)')
  W.link('Send confirmation (SendGrid)', 'Row: confirmation event', 0)
  W.link('Send confirmation (SendGrid)', 'Row: confirmation error', 1)
  W.chain('Row: confirmation event', 'Log confirmation event')
  W.chain('Row: confirmation error', 'Log confirmation failure')
  W.chain('Row only (canceled)', 'Save cancellation (nurture stays stopped)')
  W.chain('Row: unmatched booking', 'Log unmatched booking')

  W.chain('Every 15 minutes (reminders)', 'Config (reminders)', 'Get booked leads', 'Plan reminders', 'Call already happened?')
  W.link('Call already happened?', 'Row: call completed', 0)
  W.link('Call already happened?', 'Build reminder email', 1)
  W.chain('Row: call completed', 'Mark call completed')
  W.chain('Build reminder email', 'Send reminder (SendGrid)')
  W.link('Send reminder (SendGrid)', 'Row: reminder sent', 0)
  W.link('Send reminder (SendGrid)', 'Row: reminder event', 0)
  W.link('Send reminder (SendGrid)', 'Row: reminder error', 1)
  W.chain('Row: reminder sent', 'Mark reminder sent')
  W.chain('Row: reminder event', 'Log reminder event')
  W.chain('Row: reminder error', 'Log reminder failure')
  return W
}

// ---------------------------------------------------------------- write
const outDir = path.join(__dirname, 'workflows')
fs.mkdirSync(outDir, { recursive: true })
for (const [file, wf] of [['1-boxx-lead-intake', intake()], ['2-boxx-nurture-scheduler', scheduler()], ['3-boxx-booking-exit', booking()]]) {
  const json = { name: wf.name, nodes: wf.nodes, connections: wf.connections, active: false, settings: { executionOrder: 'v1' }, pinData: {} }
  fs.writeFileSync(path.join(outDir, file + '.json'), JSON.stringify(json, null, 2))
  console.log(file, wf.nodes.length, 'nodes')
}
