// Runs the exact Validate code from build-calculator-workflow.js against sample payloads.
const assert = require('node:assert/strict')
const { VALIDATE_CODE, build } = require('./build-calculator-workflow')
let n = 0
const check = (c, l) => { assert.ok(c, l); n++; console.log('PASS', l) }
const run = (body) => new Function('$', VALIDATE_CODE)(() => ({ first: () => ({ json: { body } }) }))[0].json
const good = { email: 'Owner@Biz.com ', email_marketing_consent: true, consent_text: 'x', leads_per_month: 40, missed_pct: 25, close_pct: 20, job_value: 1500, company: '' }

let r = run(good)
check(r.ok && r.lead.email === 'owner@biz.com' && r.lead.lost_monthly === 3000 && r.lead.lost_yearly === 36000, 'valid payload accepted, email normalized, loss recomputed server-side')
check(!run({ ...good, email: 'nope' }).ok && run({ ...good, email: 'nope' }).errors.includes('invalid_email'), 'bad email rejected')
check(run({ ...good, email_marketing_consent: false }).errors.includes('no_consent'), 'missing consent rejected')
check(run({ ...good, email_marketing_consent: 'true' }).errors.includes('no_consent'), 'string "true" is not consent')
check(run({ ...good, company: 'bot' }).errors.includes('honeypot'), 'honeypot rejected')
check(run({ ...good, leads_per_month: 'abc' }).errors.includes('bad_numbers'), 'non-numeric inputs rejected')
r = run({ ...good, missed_pct: 500 })
check(r.lead.missed_pct === 100, 'out-of-range numbers are clamped')
r = run({ ...good, lost_monthly: 999999 })
check(r.lead.lost_monthly === 3000, 'client-sent result is ignored; server recomputes')
const wf = build()
const names = new Set(wf.nodes.map((x) => x.name))
check(Object.keys(wf.connections).every((k) => names.has(k)) && Object.values(wf.connections).every((c) => c.main.flat().every((t) => names.has(t.node))), 'every connection points at a real node')
check(wf.active === false && wf.nodes.filter((x) => x.credentials).every((x) => x.credentials.googleSheetsOAuth2Api.id === 'REPLACE_ME'), 'ships inactive with placeholder credentials')
console.log(`${n} calculator workflow checks passed`)
