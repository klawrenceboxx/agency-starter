// Generates the importable "BOXX - Guide Delivery" workflow from content/guides/*.json.
// Run: node n8n/build-guide-workflow.js   ->  n8n/workflows/5-boxx-guide-delivery.json
// Re-run after adding a guide JSON so the Config node knows the new slug.
//
// Flow: guide page form -> validate -> upsert "Guide Leads" tab -> respond 200 -> SendGrid PDF email -> log.
// Guide leads live in their own tab on purpose: writing them to "Leads" would make a later audit
// request look like a duplicate and skip the audit's Email 1.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const uuid = () => crypto.randomUUID()
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'REPLACE_ME', name: 'Google Sheets account' } }
const CRED_SG = { sendGridApi: { id: 'REPLACE_ME', name: 'SendGrid account' } }

const root = path.join(__dirname, '..')
const guideDir = path.join(root, 'content/guides')
const guides = {}
for (const f of fs.readdirSync(guideDir).filter((f) => f.endsWith('.json'))) {
  const g = JSON.parse(fs.readFileSync(path.join(guideDir, f), 'utf8'))
  guides[g.slug] = {
    number: g.guide_number,
    title: g.title,
    promise: g.promise,
    prompts: g.steps.length,
    builtWith: g.tools.filter((t) => t.used_in_video).slice(0, 2).map((t) => t.name.replace(/\s*\(.*\)\s*/, '').toUpperCase()).join(' + '),
    pdfPath: g.pdf_url,
    cover: g.cover || '',
  }
}

const nodes = []
const connections = {}
const A = (n, x, y) => { nodes.push({ id: uuid(), position: [x * 260, y * 200], ...n }); return n.name }
const link = (from, to, out = 0) => {
  connections[from] = connections[from] || { main: [] }
  while (connections[from].main.length <= out) connections[from].main.push([])
  connections[from].main[out].push({ node: to, type: 'main', index: 0 })
}
const chain = (...names) => names.slice(1).forEach((n, i) => link(names[i], n))
const code = (name, js, mode = 'runOnceForAllItems') => ({ name, type: 'n8n-nodes-base.code', typeVersion: 2, parameters: { mode, jsCode: js } })
const ifTrue = (name, leftValue) => ({
  name, type: 'n8n-nodes-base.if', typeVersion: 2,
  parameters: {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 1 },
      conditions: [{ id: uuid(), leftValue, rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
      combinator: 'and',
    },
    options: {},
  },
})
const sheetDoc = { __rl: true, mode: 'id', value: "={{ $('Config').first().json.sheetId }}" }
const tab = (t) => ({ __rl: true, mode: 'name', value: t })
const sheetsWrite = (name, t, operation, match) => ({
  name, type: 'n8n-nodes-base.googleSheets', typeVersion: 4.5, credentials: CRED_SHEETS,
  retryOnFail: true, maxTries: 3, waitBetweenTries: 2000,
  parameters: {
    resource: 'sheet', operation, documentId: sheetDoc, sheetName: tab(t),
    columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: match ? [match] : [], schema: [] },
    options: { handlingExtraData: 'ignoreIt' },
  },
})
const respond = (name, codeNum, body) => ({
  name, type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1,
  parameters: {
    respondWith: 'json', responseBody: body,
    options: { responseCode: codeNum, responseHeaders: { entries: [{ name: 'Access-Control-Allow-Origin', value: 'https://boxxautomations.space' }] } },
  },
})

// ------------------------------------------------------------------ nodes
A({ name: 'Guide form webhook', type: 'n8n-nodes-base.webhook', typeVersion: 2, webhookId: uuid(),
  parameters: { httpMethod: 'POST', path: 'boxx-guide', responseMode: 'responseNode', options: { allowedOrigins: 'https://boxxautomations.space' } } }, 0, 1)

A(code('Config', String.raw`// ====== BOXX GUIDE DELIVERY CONFIG (secrets live in n8n Credentials, not here) ======
// Same sheet, sender and unsubscribe group as the other BOXX workflows.
return [{ json: {
  sheetId: '16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g',
  siteUrl: 'https://boxxautomations.space',
  fromEmail: 'hello@boxxautomations.space',
  fromName: 'Kaleel at BOXX',
  replyTo: 'hello@boxxautomations.space',
  mailingAddress: '54 Cannes Ave, Vaughan, ON, Canada',
  asmGroupId: 42909, // SendGrid unsubscribe group. Unsubscribes here also stop the weekly email.
  resendWindowMinutes: 10, // Same email + same guide inside this window: no second send.
  // Generated from content/guides/*.json by n8n/build-guide-workflow.js
  guides: ${JSON.stringify(guides, null, 2).replace(/\n/g, '\n  ')},
} }]`), 1, 1)

A(code('Validate & normalize', String.raw`const cfg = $('Config').first().json
const b = $('Guide form webhook').first().json.body || {}
const clean = s => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').trim()
const errors = []
const email = clean(b.email).toLowerCase()
if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('invalid_email')
const slug = clean(b.slug).toLowerCase()
if (!cfg.guides[slug]) errors.push('unknown_guide')
if (clean(b.company)) errors.push('honeypot') // bots fill the hidden field
const lead = {
  email, slug,
  email_marketing_consent: b.email_marketing_consent === true,
  consent_text: clean(b.consent_text).slice(0, 300),
  source: clean(b.source).slice(0, 60) || 'guide-page',
  page: clean(b.page).slice(0, 300),
  utm_source: clean(b.utm_source).slice(0, 60),
  utm_medium: clean(b.utm_medium).slice(0, 60),
  utm_campaign: clean(b.utm_campaign).slice(0, 80),
  utm_content: clean(b.utm_content).slice(0, 80),
  resource: clean(b.resource).slice(0, 10),
  channel: clean(b.channel).slice(0, 40),
  dlv: clean(b.dlv).slice(0, 60), // set when they arrived from one of our emails
  first_touch: clean(b.first_touch).slice(0, 600),
}
return [{ json: { ok: errors.length === 0, errors, lead, raw: JSON.stringify(b).slice(0, 1500) } }]`), 2, 1)

A(ifTrue('Valid submission?', '={{ $json.ok }}'), 3, 1)
A(code('Error row: invalid submission', String.raw`const v = $input.first().json
return [{ json: { error_id: 'err_' + Date.now().toString(36), timestamp: new Date().toISOString(),
  workflow: 'BOXX - Guide Delivery', email: v.lead.email, error_message: 'invalid_submission: ' + v.errors.join(','), payload: v.raw } }]`), 4, 2)
A(sheetsWrite('Log invalid submission', 'Error Log', 'append'), 5, 2)
A(respond('Respond 400', 400, "={{ JSON.stringify({ ok: false, errors: $('Validate & normalize').first().json.errors }) }}"), 6, 2)

A({ name: 'Find guide lead', type: 'n8n-nodes-base.googleSheets', typeVersion: 4.5, alwaysOutputData: true, credentials: CRED_SHEETS,
  parameters: { resource: 'sheet', operation: 'read', documentId: sheetDoc, sheetName: tab('Guide Leads'),
    filtersUI: { values: [{ lookupColumn: 'email', lookupValue: "={{ $('Validate & normalize').first().json.lead.email }}" }] }, options: {} } }, 4, 1)

A(code('Decide', String.raw`const cfg = $('Config').first().json
const L = $('Validate & normalize').first().json.lead
const rows = $input.all().map(i => i.json).filter(r => r && r.email)
const ex = rows.find(r => String(r.email).toLowerCase().trim() === L.email)
const T = x => String(x == null ? '' : x).toUpperCase() === 'TRUE'
const now = new Date(), iso = now.toISOString()
const guides = ex && ex.guides ? String(ex.guides).split(',').map(s => s.trim()).filter(Boolean) : []
// Duplicate guard: same guide requested again within the window gets no second email.
const last = ex && ex.last_request_at ? new Date(ex.last_request_at) : null
const recentSame = !!(ex && ex.last_guide === L.slug && last && !isNaN(last) && (now - last) < cfg.resendWindowMinutes * 60000)
// Consent only grows here. An unticked box never erases earlier consent; opt-outs come from SendGrid.
const consent = L.email_marketing_consent || !!(ex && T(ex.email_marketing_consent))
const row = {
  email: L.email,
  lead_id: ex && ex.lead_id ? ex.lead_id : 'gl_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
  first_seen_at: ex && ex.first_seen_at ? ex.first_seen_at : iso,
  last_request_at: iso,
  last_guide: L.slug,
  guides: Array.from(new Set(guides.concat(L.slug))).join(', '),
  request_count: (Number(ex && ex.request_count) || 0) + 1,
  email_marketing_consent: consent ? 'TRUE' : 'FALSE',
  source: L.source, last_page: L.page,
  utm_source: L.utm_source, utm_medium: L.utm_medium, utm_campaign: L.utm_campaign, utm_content: L.utm_content,
  resource: L.resource || cfg.guides[L.slug].number, channel: L.channel, arrived_from_dlv: L.dlv,
  updated_at: iso,
}
if (!ex) row.first_touch = L.first_touch
if (L.email_marketing_consent) {
  row.email_consent_at = iso
  row.email_consent_source = 'BOXX guide page: ' + L.slug
  row.consent_text = L.consent_text
}
return [{ json: { row, lead: Object.assign({}, L, { lead_id: row.lead_id }), send: !recentSame, reason: recentSame ? 'duplicate_within_window' : 'send_pdf' } }]`), 5, 1)

A(code('Row only', "return [{ json: $input.first().json.row }]"), 6, 1)
A(sheetsWrite('Save guide lead (upsert by email)', 'Guide Leads', 'appendOrUpdate', 'email'), 7, 1)
A(respond('Respond 200', 200, '={{ JSON.stringify({ ok: true }) }}'), 8, 1)
A(ifTrue('Send PDF email?', "={{ $('Decide').first().json.send }}"), 9, 1)

A(code('Build PDF email', String.raw`const cfg = $('Config').first().json
const L = $('Decide').first().json.lead
const g = cfg.guides[L.slug]
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
// Angus-style tags: guide number, which link, and a unique ID for this send (dlv).
const dlv = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
const tags = (channel, content) => 'resource=' + g.number + '&channel=' + channel + '&utm_source=guide-delivery&utm_medium=email&utm_campaign=' + L.slug + '&utm_content=' + content + '&dlv=' + dlv
const pdfUrl = cfg.siteUrl + g.pdfPath + '?' + tags('email', 'pdf-button')
const auditUrl = cfg.siteUrl + '/audit?' + tags('email-cta', 'audit-button')
// Shown as text: short and clean. The href keeps the tags.
const pdfDisplay = cfg.siteUrl.replace('https://', '') + g.pdfPath
const subject = "Here's " + g.title
const unsub = '<%asm_group_unsubscribe_raw_url%>'
const text = [
  'BOXX AUTOMATIONS / FREE GUIDE',
  g.title + '.',
  "Thanks for grabbing the guide. Here's the PDF you asked for.",
  "Tip: add " + cfg.fromEmail + " to your contacts so the next one lands in your inbox.",
  '',
  'Download the PDF: ' + pdfUrl,
  '',
  "Don't want to build it yourself?",
  "I'll set it up for your business. Start with a free audit and I'll show you where your leads are slipping through.",
  'Get Your Free Audit: ' + auditUrl,
  '',
  "If you get stuck on anything, just reply here. It comes straight to me.",
  'Kaleel',
  '',
  'BOXX Automations · ' + cfg.mailingAddress,
  "You're getting this because you asked for this guide on boxxautomations.space.",
  "You'll also get a weekly email from BOXX. Unsubscribe: " + unsub,
].join('\n')
const btn = (href, label, bg, border) => '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:10px;background:' + bg + ';border:1px solid ' + border + '"><a href="' + esc(href) + '" style="display:inline-block;padding:16px 26px;font:700 16px/1 Inter,Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;border-radius:10px">' + label + '</a></td></tr></table>'
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>' + esc(subject) + '</title></head>'
 + '<body style="margin:0;padding:0;background:#10071b">'
 + '<div style="display:none;max-height:0;overflow:hidden">' + esc(g.promise) + '</div>'
 + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#10071b"><tr><td align="center" style="padding:32px 16px">'
 + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;font-family:Inter,Arial,Helvetica,sans-serif;color:#ffffff">'
 + '<tr><td style="font:700 11px/1.4 Menlo,Consolas,monospace;letter-spacing:2px;color:#d3a0ff;padding:0 0 14px">BOXX AUTOMATIONS / FREE GUIDE</td></tr>'
 + '<tr><td style="font:800 32px/1.1 Inter,Arial,Helvetica,sans-serif;letter-spacing:-0.5px;padding:0 0 12px">' + esc(g.title) + '<span style="color:#9c16f4">.</span></td></tr>'
 + '<tr><td style="font:400 16px/1.6 Inter,Arial,Helvetica,sans-serif;color:#c3b8ce;padding:0 0 24px">Thanks for grabbing the guide. Here&#39;s the PDF you asked for.<br><span style="font-size:13px;color:#8d7f9c">Tip: add ' + esc(cfg.fromEmail) + ' to your contacts so the next one lands in your inbox.</span></td></tr>'
 + '<tr><td style="background:#1b102b;border:1px solid #493058;border-radius:16px;padding:20px">'
 +   '<div style="font:700 10px/1.4 Menlo,Consolas,monospace;letter-spacing:1.5px;color:#d3a0ff;padding:0 0 10px">FREE GUIDE · ' + g.prompts + ' PROMPTS · BUILT WITH ' + esc(g.builtWith) + '</div>'
 +   '<div style="font:700 20px/1.3 Inter,Arial,Helvetica,sans-serif;padding:0 0 8px">' + esc(g.title) + '</div>'
 +   '<div style="font:400 15px/1.55 Inter,Arial,Helvetica,sans-serif;color:#c3b8ce">' + esc(g.promise) + '</div>'
 + '</td></tr>'
 + '<tr><td style="padding:20px 0 8px">' + btn(pdfUrl, 'Download the PDF &#8599;', '#382344', '#78518e') + '</td></tr>'
 + '<tr><td style="font:400 13px/1.6 Inter,Arial,Helvetica,sans-serif;color:#8d7f9c;padding:0 0 28px">Button not working? Copy this link:<br><a href="' + esc(pdfUrl) + '" style="color:#d3a0ff;word-break:break-all">' + esc(pdfDisplay) + '</a></td></tr>'
 + '<tr><td style="background:#370857;border-radius:16px;padding:24px">'
 +   '<div style="font:800 20px/1.25 Inter,Arial,Helvetica,sans-serif;padding:0 0 8px">Don&#39;t want to build it yourself?</div>'
 +   '<div style="font:400 15px/1.6 Inter,Arial,Helvetica,sans-serif;color:#d6c6e8;padding:0 0 18px">I&#39;ll set it up for your business. Start with a free audit and I&#39;ll show you where your leads are slipping through.</div>'
 +   btn(auditUrl, 'Get Your Free Audit &#8599;', '#9c16f4', '#9c16f4')
 + '</td></tr>'
 + '<tr><td style="font:400 16px/1.6 Inter,Arial,Helvetica,sans-serif;color:#ffffff;padding:28px 0 0">If you get stuck on anything, just reply here. It comes straight to me.<br>Kaleel</td></tr>'
 + '<tr><td style="font:400 12px/1.6 Inter,Arial,Helvetica,sans-serif;color:#8d7f9c;padding:32px 0 0;border-top:1px solid #2c1a3c">'
 +   'BOXX Automations · ' + esc(cfg.mailingAddress) + '<br>You&#39;re getting this because you asked for this guide on boxxautomations.space.<br>'
 +   'You&#39;ll also get a weekly email from BOXX. <a href="' + unsub + '" style="color:#d3a0ff">Unsubscribe</a>'
 + '</td></tr></table></td></tr></table></body></html>'
return [{ json: { sgBody: {
  personalizations: [{ to: [{ email: L.email }], subject }],
  from: { email: cfg.fromEmail, name: cfg.fromName }, reply_to: { email: cfg.replyTo },
  content: [{ type: 'text/plain', value: text }, { type: 'text/html', value: html }],
  asm: { group_id: cfg.asmGroupId, groups_to_display: [cfg.asmGroupId] },
  // Our own tags (resource/channel/dlv) do the tracking. SendGrid click tracking would rewrite every
  // link to a sendgrid.net address, which spam filters distrust when link branding isn't set up.
  tracking_settings: { click_tracking: { enable: false, enable_text: false } },
  categories: ['boxx-guide', L.slug],
  custom_args: { lead_id: L.lead_id, email_type: 'guide-pdf', guide: L.slug, resource: g.number, dlv },
}, meta: { lead_id: L.lead_id, email: L.email, email_type: 'guide-pdf:' + L.slug, resource: g.number, dlv } } }]`), 10, 1)

A({ name: 'Send PDF email (SendGrid)', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, credentials: CRED_SG,
  retryOnFail: true, maxTries: 3, waitBetweenTries: 2000, onError: 'continueErrorOutput',
  parameters: { method: 'POST', url: 'https://api.sendgrid.com/v3/mail/send', authentication: 'predefinedCredentialType', nodeCredentialType: 'sendGridApi',
    sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.sgBody) }}', options: { response: { response: { fullResponse: true } } } } }, 11, 1)

A(code('Row: email event', String.raw`const res = $input.item.json
const src = $('Build PDF email').item.json
return { json: { event_id: 'evt_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  lead_id: src.meta.lead_id, email: src.meta.email, email_type: src.meta.email_type, template_id: '',
  sent_at: new Date().toISOString(), message_id: (res.headers || {})['x-message-id'] || '', status: 'sent',
  resource: src.meta.resource, dlv: src.meta.dlv } }`, 'runOnceForEachItem'), 12, 0)
A(sheetsWrite('Log email event', 'Email Events', 'append'), 13, 0)
A(code('Row: email error', String.raw`const res = $input.item.json
const src = $('Build PDF email').item.json
return { json: { error_id: 'err_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), timestamp: new Date().toISOString(),
  workflow: 'BOXX - Guide Delivery', email: src.meta.email,
  error_message: String((res.error && res.error.message) || res.message || 'SendGrid send failed').slice(0, 500), payload: JSON.stringify(src.meta) } }`, 'runOnceForEachItem'), 12, 2)
A(sheetsWrite('Log email failure', 'Error Log', 'append'), 13, 2)

A({ name: 'Setup notes', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, parameters: { width: 460, height: 300, content: `## BOXX - Guide Delivery
Webhook \`POST /webhook/boxx-guide\` receives the soft-gated PDF form on \`/guides/[slug]\`.

**Before activating**
1. Create a tab **Guide Leads** in the BOXX CRM sheet with headers:
\`email, lead_id, first_seen_at, last_request_at, last_guide, guides, request_count, email_marketing_consent, email_consent_at, email_consent_source, consent_text, source, last_page, resource, channel, utm_source, utm_medium, utm_campaign, utm_content, arrived_from_dlv, first_touch, updated_at\`
   Add \`resource, dlv\` at the end of the **Email Events** header row.
2. Select the existing **Google Sheets** and **SendGrid** credentials on the Sheets/SendGrid nodes.
3. Activate, then submit the form on the live page with your own email.

Guide leads stay out of the **Leads** tab so a later audit request still gets Email 1. The PDF email uses unsubscribe group 42909, so anyone who unsubscribed from BOXX emails will not get it.

New guide: add \`content/guides/<slug>.json\` in the site repo, run \`node n8n/build-guide-workflow.js\`, paste the new Config node.` } }, 0, 0)

chain('Guide form webhook', 'Config', 'Validate & normalize', 'Valid submission?')
link('Valid submission?', 'Find guide lead', 0)
link('Valid submission?', 'Error row: invalid submission', 1)
chain('Error row: invalid submission', 'Log invalid submission', 'Respond 400')
chain('Find guide lead', 'Decide', 'Row only', 'Save guide lead (upsert by email)', 'Respond 200', 'Send PDF email?')
link('Send PDF email?', 'Build PDF email', 0)
link('Build PDF email', 'Send PDF email (SendGrid)')
link('Send PDF email (SendGrid)', 'Row: email event', 0)
link('Send PDF email (SendGrid)', 'Row: email error', 1)
link('Row: email event', 'Log email event')
link('Row: email error', 'Log email failure')

const wf = { name: 'BOXX - Guide Delivery', nodes, connections, active: false, settings: { executionOrder: 'v1' }, pinData: {}, meta: { templateCredsSetupCompleted: false } }
const out = path.join(__dirname, 'workflows', '5-boxx-guide-delivery.json')
fs.writeFileSync(out, JSON.stringify(wf, null, 2))
console.log('Wrote', path.relative(root, out), '-', nodes.length, 'nodes,', Object.keys(guides).length, 'guide(s)')
