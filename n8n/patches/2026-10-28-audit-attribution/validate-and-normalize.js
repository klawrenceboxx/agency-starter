const b = $('Audit form webhook').first().json.body || {}
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
const budgets = ['under-1000', '1000-2500', '2500-plus', 'just-exploring']
const lead = {
  email, name, first_name: name.split(' ')[0], website,
  phone: clean(b.phone).slice(0, 30),
  interest: hasW && hasE ? 'both' : hasE ? 'emails' : 'website',
  nurture_path: hasW && hasE ? 'BOTH' : hasE ? 'EMAIL' : 'WEBSITE',
  budget: budgets.includes(clean(b.budget)) ? clean(b.budget) : '',
  source: clean(b.source).slice(0, 300) || 'BOXX audit form',
  email_marketing_consent: b.email_marketing_consent === true,
  sms_marketing_consent: b.sms_marketing_consent === true,
  // Attribution from the site (2026-10-28): which guide, which link, which email send, utm tags.
  attribution: {
    resource: clean(b.resource).slice(0, 10),
    channel: clean(b.channel).slice(0, 40),
    dlv: clean(b.dlv).slice(0, 60),
    utm_source: clean(b.utm_source).slice(0, 60),
    utm_medium: clean(b.utm_medium).slice(0, 60),
    utm_campaign: clean(b.utm_campaign).slice(0, 80),
    utm_content: clean(b.utm_content).slice(0, 80),
  },
  first_touch: clean(b.first_touch).slice(0, 600),
}
return [{ json: { ok: errors.length === 0, errors, lead, raw: JSON.stringify(b).slice(0, 1500) } }]
