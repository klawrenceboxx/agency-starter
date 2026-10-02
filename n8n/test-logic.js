// Runs the Code-node scripts from the generated workflows against sample data.
// Run: node n8n/build-workflows.js && node n8n/test-logic.js
// Tests the decision logic only. It does not call n8n, Google Sheets, SendGrid or Calendly.
const path = require('path')
const wf = f => require(path.join(__dirname, 'workflows', f + '.json'))
const W = { intake: wf('1-boxx-lead-intake'), sched: wf('2-boxx-nurture-scheduler'), book: wf('3-boxx-booking-exit') }

function run(w, nodeName, { input = [], nodes = {}, itemIndex = 0 } = {}) {
  const node = w.nodes.find(n => n.name === nodeName)
  if (!node) throw new Error('no node ' + nodeName)
  const wrap = arr => arr.map(json => ({ json }))
  const $input = { all: () => wrap(input), first: () => wrap(input)[0], item: wrap(input)[itemIndex] }
  const $ = name => {
    const arr = nodes[name]
    if (!arr) throw new Error('test missing upstream node: ' + name)
    return { first: () => wrap(arr)[0], all: () => wrap(arr), item: wrap(arr)[itemIndex] }
  }
  const res = new Function('$input', '$', node.parameters.jsCode)($input, $)
  return Array.isArray(res) ? res.map(r => r.json) : res.json
}

let pass = 0, fail = 0
const ok = (name, cond, extra) => { cond ? pass++ : fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  ' + (extra || ''))) }
const DAY = 864e5
const ago = d => new Date(Date.now() - d * DAY).toISOString()
const cfg = run(W.intake, 'Config')[0]

// ---- intake: validation + routing
const validate = body => run(W.intake, 'Validate & normalize', { nodes: { 'Audit form webhook': [{ body }] } })[0]
const base = { name: 'Alice Smith', email: '  Alice@Acme.COM ', phone: '555-123-4567', website: 'https://www.Acme.com/', budget: '1000-2500', source: 'https://boxxautomations.space/' }
let v = validate({ ...base, services: ['website'] })
ok('Website lead -> WEBSITE path only', v.ok && v.lead.nurture_path === 'WEBSITE')
ok('Email normalized (lowercase/trim)', v.lead.email === 'alice@acme.com')
ok('Website URL normalized', v.lead.website === 'acme.com')
v = validate({ ...base, services: ['emails'] })
ok('Emails lead -> EMAIL path only', v.ok && v.lead.nurture_path === 'EMAIL')
v = validate({ ...base, services: ['website', 'emails'] })
ok('Both lead -> BOTH path (single sequence)', v.ok && v.lead.nurture_path === 'BOTH')
v = validate({ ...base, services: ['website'], path: 'both', nurture_path: 'BOTH', nurture_status: 'COMPLETED' })
ok('Browser-supplied path/state ignored', v.lead.nurture_path === 'WEBSITE')
ok('Bad email rejected', !validate({ ...base, email: 'nope', services: ['website'] }).ok)
ok('Malformed website rejected', !validate({ ...base, website: 'not a url', services: ['website'] }).ok)
ok('Unknown interest rejected', validate({ ...base, services: ['seo'] }).errors.includes('unknown_interest'))
ok('Missing body does not crash', !run(W.intake, 'Validate & normalize', { nodes: { 'Audit form webhook': [{}] } })[0].ok)
ok('HTML stripped from name', validate({ ...base, name: '<b>Al</b>ice', services: ['website'] }).lead.name === 'bAlice' || !validate({ ...base, name: '<b>Al</b>ice', services: ['website'] }).lead.name.includes('<'))

// ---- intake: dedupe / resend
const decide = (existing, services = ['website']) => {
  const vv = validate({ ...base, services })
  return run(W.intake, 'Decide', { input: existing ? [existing] : [{}], nodes: { Config: [cfg], 'Validate & normalize': [vv] } })[0]
}
let d = decide(null)
ok('New lead: creates row + sends Email 1', d.isNew && d.sendEmail1 && d.row.nurture_status === 'ACTIVE' && d.row.current_email === 0)
const existing = (over = {}) => ({ lead_id: 'ld_1', email: 'alice@acme.com', created_at: ago(5), framework_delivered_at: ago(5), framework_delivered: 'TRUE',
  calendly_booked: 'FALSE', unsubscribe_status: 'FALSE', client_status: 'PROSPECT', nurture_status: 'ACTIVE', current_email: '2', ...over })
d = decide(existing())
ok('Duplicate <30d: updates, no Email 1, nurture untouched', !d.isNew && !d.sendEmail1 && d.row.nurture_status === undefined && d.row.updated_at)
d = decide(existing({ framework_delivered_at: ago(31), created_at: ago(31) }))
ok('Duplicate >30d: Email 1 re-sent, nurture reset', d.sendEmail1 && d.row.nurture_status === 'ACTIVE' && d.row.current_email === 0)
d = decide(existing({ framework_delivered_at: ago(31), unsubscribe_status: 'TRUE' }))
ok('Unsubscribed >30d: never re-sent', !d.sendEmail1)
d = decide(existing({ framework_delivered_at: ago(31), calendly_booked: 'TRUE' }))
ok('Booked >30d: not re-sent', !d.sendEmail1)
d = decide(existing({ framework_delivered_at: ago(31), client_status: 'ACTIVE' }))
ok('Active client >30d: prospect nurture not restarted', !d.sendEmail1)

// ---- scheduler: Plan sends
const plan = rows => run(W.sched, 'Plan sends', { input: rows, nodes: { Config: [cfg] } })
const lead = (over = {}) => ({ lead_id: 'ld_1', email: 'a@b.com', name: 'Alice Smith', website: 'acme.com', nurture_path: 'WEBSITE', nurture_status: 'ACTIVE',
  framework_delivered: 'TRUE', framework_delivered_at: ago(0.1), created_at: ago(0.1), current_email: '1', calendly_booked: 'FALSE',
  unsubscribe_status: 'FALSE', client_status: 'PROSPECT', ...over })
ok('Day 0.1: nothing due', plan([lead()]).length === 0)
let p = plan([lead({ framework_delivered_at: ago(2.01) })])
ok('Day 2: Email 2 due, next due set from anchor', p.length === 1 && p[0].action === 'send' && p[0].n === 2 && !!p[0].nextDue)
p = plan([lead({ framework_delivered_at: ago(3.9), current_email: '2' })])
ok('Day 3.9: Email 3 not due yet', p.length === 0)
p = plan([lead({ framework_delivered_at: ago(4.01), current_email: '2' })])
ok('Day 4: Email 3 due', p[0] && p[0].n === 3)
p = plan([lead({ framework_delivered_at: ago(7.01), current_email: '3' })])
ok('Day 7: Email 4 due', p[0] && p[0].n === 4)
p = plan([lead({ framework_delivered_at: ago(10.01), current_email: '4' })])
ok('Day 10: Email 5 due, no further due date', p[0] && p[0].n === 5 && p[0].nextDue === '')
p = plan([lead({ framework_delivered_at: ago(4.01), current_email: '2', nurture_path: 'BOTH' })])
ok('Path respected (BOTH) and carried through', p[0].path === 'BOTH')
p = plan([lead({ framework_delivered_at: ago(4.01), current_email: '2', calendly_booked: 'TRUE' })])
ok('Booked after Email 2: Emails 3-5 blocked', p.length === 1 && p[0].action === 'stop' && p[0].reason === 'booked')
p = plan([lead({ framework_delivered_at: ago(4.01), current_email: '2', unsubscribe_status: 'TRUE' })])
ok('Unsubscribed: future nurture blocked', p[0].action === 'stop' && p[0].reason === 'unsubscribed')
p = plan([lead({ framework_delivered_at: ago(4.01), current_email: '2', client_status: 'ACTIVE' })])
ok('Active client: prospect nurture blocked', p[0].action === 'stop' && p[0].reason === 'client_active')
p = plan([lead({ current_email: '5', framework_delivered_at: ago(11) })])
ok('Sequence finished: marked complete, nothing sent', p[0].action === 'complete')
p = plan([lead({ framework_delivered: 'FALSE', framework_delivered_at: '', current_email: '0', created_at: ago(0.2) })])
ok('Failed Email 1 is retried (n=1)', p[0] && p[0].action === 'send' && p[0].n === 1)
p = plan([lead({ framework_delivered: 'FALSE', framework_delivered_at: '', current_email: '0', created_at: ago(3) })])
ok('Email 1 retry is bounded to 48h', p[0].action === 'stop' && p[0].reason === 'email1_failed')

// ---- scheduler: row after Email 5
const advance = n => run(W.sched, 'Row: lead advanced', { input: [{}], nodes: { 'Build SendGrid request': [{ meta: { email: 'a@b.com', n, nextDue: '' } }] } })
ok('Email 5 sent -> nurture COMPLETED', advance(5).nurture_status === 'COMPLETED' && advance(5).current_email === 5)
ok('Email 2 sent -> still ACTIVE', advance(2).nurture_status === 'ACTIVE')

// ---- booking
const parse = (event, over = {}) => run(W.book, 'Parse Calendly event', { nodes: { 'Calendly booking event': [{ event, payload: { email: 'A@B.com', name: 'Alice Smith', scheduled_event: { uri: 'ev1', start_time: new Date(Date.now() + 3 * DAY).toISOString() }, ...over } }] } })[0]
const bdecide = (event, ex) => run(W.book, 'Decide booking', { input: ex ? [ex] : [{}], nodes: { 'Parse Calendly event': [parse(event)] } })[0]
const exb = (over = {}) => ({ lead_id: 'ld_1', email: 'a@b.com', name: 'Alice Smith', nurture_status: 'ACTIVE', calendly_booked: 'FALSE', calendly_event_id: '', client_status: 'PROSPECT', ...over })
let b = bdecide('invitee.created', exb())
ok('Booking stops nurture + sets CALL_BOOKED', b.action === 'booked' && b.row.nurture_status === 'STOPPED' && b.row.calendly_booked === 'TRUE' && b.row.client_status === 'CALL_BOOKED')
ok('Invitee email normalized to match lead', b.email === 'a@b.com')
b = bdecide('invitee.created', exb({ calendly_booked: 'TRUE', calendly_event_id: 'ev1', nurture_status: 'STOPPED' }))
ok('Duplicate Calendly event has no effect', b.action === 'duplicate')
b = bdecide('invitee.canceled', exb({ calendly_booked: 'TRUE', calendly_event_id: 'ev1', nurture_status: 'STOPPED', client_status: 'CALL_BOOKED' }))
ok('Cancellation clears booking, does NOT restart nurture', b.action === 'canceled' && b.row.nurture_status === undefined && b.row.calendly_booked === 'FALSE')
b = bdecide('invitee.canceled', exb({ calendly_booked: 'TRUE', calendly_event_id: 'evNEW', nurture_status: 'STOPPED' }))
ok('Stale cancel (from a reschedule) ignored', b.action === 'stale_cancel')
b = bdecide('invitee.created', null)
ok('Booker with no matching lead is logged, not dropped', b.action === 'unmatched')
b = bdecide('invitee.created', exb({ client_status: 'ACTIVE' }))
ok('Active client booking not downgraded', b.row.client_status === 'ACTIVE')

// ---- reminders
const remind = rows => run(W.book, 'Plan reminders', { input: rows, nodes: { 'Config (reminders)': [cfg] } })
const bk = (hoursFromNow, over = {}) => ({ lead_id: 'ld_1', email: 'a@b.com', name: 'Alice', calendly_booked: 'TRUE', client_status: 'CALL_BOOKED',
  call_date: new Date(Date.now() + hoursFromNow * 36e5).toISOString(), reminder_24h_sent: 'FALSE', reminder_day_sent: 'FALSE', ...over })
ok('48h out: no reminder', remind([bk(48)]).length === 0)
ok('23h out: 24h reminder', remind([bk(23)])[0].action === 'remind24')
ok('23h out, already sent: no repeat', remind([bk(23, { reminder_24h_sent: 'TRUE' })]).length === 0)
ok('2h out: same-day reminder', remind([bk(2)])[0].action === 'remindDay')
ok('Call finished: status -> completed', remind([bk(-2)])[0].action === 'completed')
ok('Completed lead not re-flagged', remind([bk(-2, { client_status: 'CALL_COMPLETED' })]).length === 0)

console.log('\n' + pass + ' passed, ' + fail + ' failed')
process.exit(fail ? 1 : 0)
