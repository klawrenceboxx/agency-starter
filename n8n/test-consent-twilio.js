// Offline regression checks. Never calls Twilio, Google Sheets, SendGrid, or n8n.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const workflow = require('./workflows/BOXX-Lead-Intake-Consent-Twilio.json')
const nodes = Object.fromEntries(workflow.nodes.map(node => [node.name, node]))
let checks = 0
function check(condition, message) { assert.ok(condition, message); checks++ }
function run(name, input = {}, upstream = {}) {
  const wrap = value => ({ json: value })
  const result = new Function('$input', '$', nodes[name].parameters.jsCode)(
    { first: () => wrap(input), item: wrap(input), all: () => [wrap(input)] },
    name => ({ first: () => wrap(upstream[name]), item: wrap(upstream[name]) }),
  )
  return Array.isArray(result) ? result[0].json : result.json
}
const cfg = run('Config')
const base = { name: 'QA Lead', email: 'qa@example.com', website: 'example.com', services: ['website'], phone: '(416) 555-1234', source: 'networking' }
const validate = body => run('Validate & normalize', {}, { 'Audit form webhook': { body: { ...base, ...body } } })
function decide(body = {}, existing = {}) {
  return run('Decide', existing, { Config: cfg, 'Validate & normalize': validate(body) })
}
function sms(decision, overrides = {}) {
  return run('Build welcome SMS', {}, { Config: { ...cfg, twilioFromNumber: '+14165559876', ...overrides }, Decide: decision })
}
function schema(row, tab) {
  const headers = tab === 'Leads'
    ? fs.readFileSync(path.join(__dirname, 'sheet-template/Leads.csv'), 'utf8').trim().split(',')
    : tab === 'SMS Events' ? 'event_id,lead_id,email,channel,email_type,sent_at,message_id,status,phone'.split(',')
      : tab === 'Email Events' ? 'event_id,lead_id,email,email_type,template_id,sent_at,message_id,status'.split(',')
        : 'error_id,timestamp,workflow,email,error_message,payload'.split(',')
  check(Object.keys(row).every(key => headers.includes(key)), `${tab} row matches live headers`)
}
check(workflow.active === false, 'Import is inactive')
assert.deepEqual(cfg.cadenceDays, [2, 4, 7, 10]); checks++
check(cfg.sheetId === '16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g', 'Existing CRM retained')
for (const node of workflow.nodes) {
  if (node.type === 'n8n-nodes-base.code') { new Function('$input', '$', node.parameters.jsCode); checks++ }
  if (node.type === 'n8n-nodes-base.googleSheets') {
    check(['Leads', 'SMS Events', 'Email Events', 'Error Log'].includes(node.parameters.sheetName.value), 'Worksheet exists')
    if (['append','update','appendOrUpdate'].includes(node.parameters.operation)) check(node.parameters.options.handlingExtraData === 'ignoreIt', 'No unexpected columns inserted')
  }
}
for (const [from, outputs] of Object.entries(workflow.connections)) {
  check(!!nodes[from], 'Connection source exists')
  for (const branch of outputs.main) for (const edge of branch) check(!!nodes[edge.node], 'Connection destination exists')
}
for (const email of [false, true]) for (const smsConsent of [false, true]) {
  const d = decide({ email_marketing_consent: email, sms_marketing_consent: smsConsent })
  check(d.sendEmail1 && d.isNew, 'New request gets transactional fulfillment independently of marketing')
  check(d.emailConsent === email && d.smsConsent === smsConsent && d.sendSMS1 === smsConsent, 'Channels independent')
  check(d.row.sms_status === (smsConsent ? 'subscribed' : 'not_subscribed'), 'Unconsented SMS not marked subscribed')
  schema(d.row, 'Leads')
  const marked = run('Row: Email 1 sent', {}, { Config: cfg, Decide: d, 'Build Email 1 request': {meta:{email:base.email}} })
  check(marked.nurture_status === (email ? 'ACTIVE' : 'HELD') && (!!marked.next_email_due_at === email), 'Nurture scheduling requires email consent')
  schema(marked, 'Leads')
}
for (const bad of [undefined, null, '', 'true', 'false', 1]) {
  const d = decide({ email_marketing_consent: bad, sms_marketing_consent: bad, consent: true })
  check(!d.emailConsent && !d.smsConsent && !d.sendSMS1, 'Nonboolean/missing consent fails closed, no legacy inference')
}
const old = {email:base.email,lead_id:'ld_old',created_at:'2025-01-01',framework_delivered_at:'2025-01-01',framework_delivered:'TRUE',sms_marketing_consent:'TRUE',phone:'+14165551234'}
check(validate({budget:'just-exploring'}).lead.budget === 'just-exploring', 'Exploring budget survives intake normalization')
check(decide({budget:'just-exploring'},{...old,budget:'under-1000'}).row.budget === 'just-exploring', 'Explicit updated budget reaches CRM for an existing lead')
check(validate({budget:''}).lead.budget === '', 'Skipped budget remains empty')
const optedIn = {email_marketing_consent:true,sms_marketing_consent:true}
for (const stop of [{sms_opt_out:'TRUE'}, {sms_opted_out:'TRUE'}, {sms_status:'unsubscribed'}, {sms_opt_out_date:'2026-01-01'}]) {
  check(!decide(optedIn,{...old,...stop}).sendSMS1, 'Every existing opt-out representation blocks welcome')
}
for (const history of [{sms_confirmation_sid:'SMprior'}, {sms_confirmation_status:'pending'}, {sms_confirmation_status:'failed'}, {sms_confirmation_at:'2026-01-01'}, {sms_status:'sent'}]) {
  check(!decide(optedIn,{...old,...history}).sendSMS1, 'Welcome history suppresses repeat even after 30 days')
}
check(!decide({email_marketing_consent:true},old).sendSMS1, 'Stored consent alone does not trigger a new welcome')
check(!decide(optedIn,{...old,created_at:new Date().toISOString(),framework_delivered_at:new Date().toISOString()}).sendSMS1, 'Routine duplicate suppressed')
check(decide({phone:''},old).row.phone === old.phone, 'Blank optional phone preserves CRM value')
const request = run('Build Email 1 request', {}, {Config:cfg, Decide:decide()})
check(!request.sgBody.template_id && !request.sgBody.asm && !request.sgBody.content[0].value.includes(cfg.calendlyUrl), 'Transactional content excludes marketing template and promotion')
check(request.sgBody.content[0].value.includes(cfg.frameworkUrl), 'Framework link retained')
check(request.sgBody.mail_settings.bypass_unsubscribe_management.enable, 'Fulfillment retains transactional bypass')
const d = decide(optedIn)
for (const [phone, expected] of [['(416) 555-1234','+14165551234'], ['+44 20 7183 8750','+442071838750']]) {
  const built = sms({...d,lead:{...d.lead,phone}})
  check(built.canSend && built.toNumber === expected, 'Recognized destination normalized to E.164')
}
for (const phone of ['4165551234 ext 25','++14165551234','123','not a phone','442071838750']) check(!sms({...d,lead:{...d.lead,phone}}).canSend, 'Invalid/ambiguous phone cannot send')
check(!sms(d,{twilioFromNumber:cfg.twilioFromNumber}).canSend, 'Missing sender blocks SMS')
const built = sms(d)
check(built.message.includes(cfg.calendlyUrl) && built.message.includes('Reply STOP to opt out.') && built.message.includes('BOXX Automations'), 'Original welcome content and booking link retained')
assert.deepEqual(nodes['Send welcome SMS (Twilio)'].credentials,{twilioApi:{name:'Twilio account'}}); checks++
check(nodes['Send welcome SMS (Twilio)'].retryOnFail === false, 'No blind SMS retries')
const up = {'Build welcome SMS':built}
schema(run('Row: SMS pending',{},up),'Leads')
const confirmation = run('Row: SMS confirmation',{sid:'SMtest',status:'queued'},up)
check(confirmation.sms_confirmation_sid === 'SMtest' && confirmation.sms_confirmation_status === 'queued','Queued acceptance is not labeled delivered')
schema(confirmation,'Leads')
const event = run('Row: SMS sent',{sid:'SMtest',status:'queued'},up)
schema(event,'SMS Events')
check(event.status === 'queued','Provider status retained in events')
schema(run('Row: SMS error',{error:{message:'offline'}},up),'Error Log')
schema(run('Row: SMS config error',{}, {'Build welcome SMS':{...built,problem:'configure_twilio_from_number'}}),'Error Log')
schema(run('Row: SMS failure event',{},up),'SMS Events')
const rejected = run('Row: SMS failed',{error:{code:21610,message:'opted out'}},up)
check(rejected.sms_opted_out === 'TRUE' && rejected.sms_opt_out === 'TRUE' && rejected.sms_marketing_consent === 'FALSE','Twilio opt-out failure stops future welcome attempts')
schema(rejected,'Leads')
check(workflow.connections['SMS configuration valid?'].main[0][0].node === 'Row: SMS pending','Attempt reservation precedes Twilio')
check(workflow.connections['Reserve welcome SMS attempt'].main[0][0].node === 'Send welcome SMS (Twilio)','Twilio waits for successful CRM reservation')
check(workflow.connections['Send welcome SMS (Twilio)'].main[1].some(e=>e.node==='Row: SMS error'),'SMS errors routed to log')
console.log(`${checks} consent/Twilio checks passed (offline; no messages sent)`)
