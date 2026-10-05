// Transport adapter only: the existing booking decision and reminder nodes remain.
const SELECT_EVENT_TYPE = String.raw`const cfg = $('Config').first().json
const types = $input.all().flatMap(i => i.json.collection || [])
const canonical = s => String(s || '').replace(/\/+$/, '').toLowerCase()
const match = types.find(t => canonical(t.scheduling_url) === canonical(cfg.calendlyUrl))
if (!match) throw new Error('Cannot find the BOXX Calendly event type matching Config.calendlyUrl')
return [{ json: { eventTypeUri: match.uri } }]`

const EXPAND_EVENTS = String.raw`const target = $('Select BOXX event type').first().json.eventTypeUri
const events = $input.all().flatMap(i => i.json.collection || []).filter(e => e.event_type === target)
const unique = [...new Map(events.map(e => [e.uri, e])).values()]
return unique.length ? unique.map(e => ({ json: e })) : [{ json: { noEvents: true } }]`

const NORMALIZE_INVITEES = String.raw`const events = new Map($('Expand scheduled events').all().map(i => [i.json.uri, i.json]))
const state = $getWorkflowStaticData('global')
const seen = state.calendlyPollSeen || {}
const observations = new Map()
for (const page of $input.all()) {
  if (!Array.isArray(page.json.collection)) throw new Error('Invalid Calendly invitee response')
  for (const invitee of page.json.collection) {
    const event = events.get(invitee.event)
    if (!event || !invitee.uri || !invitee.email) throw new Error('Cannot associate Calendly invitee with its scheduled event')
    const canceled = invitee.status === 'canceled' || event.status === 'canceled'
    const type = canceled ? 'invitee.canceled' : invitee.status === 'active' ? 'invitee.created' : ''
    if (!type) continue
    const fingerprint = [type, invitee.updated_at || '', event.updated_at || ''].join('|')
    if (seen[invitee.uri] && seen[invitee.uri].fingerprint === fingerprint) continue
    observations.set(invitee.uri, {
      event: type,
      payload: { email: invitee.email, name: invitee.name, scheduled_event: { uri: event.uri, start_time: event.start_time } },
      poll: { key: invitee.uri, fingerprint, createdAt: invitee.created_at || event.created_at || '' },
    })
  }
}
// Process cancellations before replacement bookings, then oldest-to-newest bookings.
const ordered = [...observations.values()].sort((a, b) => {
  const cancelOrder = Number(b.event === 'invitee.canceled') - Number(a.event === 'invitee.canceled')
  return cancelOrder || a.poll.createdAt.localeCompare(b.poll.createdAt)
})
return ordered.length ? ordered.map(json => ({ json })) : [{ json: { event: 'ignore', payload: {} } }]`

const CHECKPOINT = String.raw`const envelope = $('Process one booking').first().json
if (envelope.poll) {
  const state = $getWorkflowStaticData('global')
  state.calendlyPollSeen = state.calendlyPollSeen || {}
  state.calendlyPollSeen[envelope.poll.key] = { fingerprint: envelope.poll.fingerprint, observedAt: new Date().toISOString() }
  const cutoff = Date.now() - 35 * 864e5
  for (const [key, value] of Object.entries(state.calendlyPollSeen)) {
    if (Date.parse(value.observedAt) < cutoff) delete state.calendlyPollSeen[key]
  }
}
return [{ json: { handled: true } }]`

function addPolling(W, code, credentials) {
  const A = W.add
  const paginated = {
    pagination: { pagination: {
      paginationMode: 'responseContainsNextURL',
      // Fail closed before sending credentials to any pagination URL outside Calendly.
      nextURL: "={{ (() => { const u = $response.body.pagination.next_page; if (!u) return ''; if (!u.startsWith('https://api.calendly.com/')) throw new Error('Invalid Calendly pagination URL'); return u; })() }}",
      paginationCompleteWhen: 'other', completeExpression: '={{ !$response.body.pagination.next_page }}',
      requestInterval: 200,
    } },
  }
  const get = (name, url, query = [], pages = false) => ({
    name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, credentials,
    retryOnFail: true, maxTries: 3, waitBetweenTries: 2000,
    parameters: {
      method: 'GET', url, authentication: 'predefinedCredentialType', nodeCredentialType: 'calendlyApi',
      ...(query.length ? { sendQuery: true, queryParameters: { parameters: query } } : {}),
      options: { response: { response: { responseFormat: 'json' } }, ...(pages ? paginated : {}) },
    },
  })
  A({ name: 'Every 15 minutes (Calendly poll)', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2,
    parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: 15 }] } } }, -6, 1)
  A(get('Calendly current user', 'https://api.calendly.com/users/me'), -4, 1)
  A(get('Calendly event types', 'https://api.calendly.com/event_types', [
    { name: 'user', value: "={{ $('Calendly current user').first().json.resource.uri }}" },
    { name: 'count', value: '100' },
  ], true), -3, 1)
  A(code('Select BOXX event type', SELECT_EVENT_TYPE), -2, 1)
  A(get('Calendly scheduled events', 'https://api.calendly.com/scheduled_events', [
    { name: 'user', value: "={{ $('Calendly current user').first().json.resource.uri }}" },
    { name: 'min_start_time', value: "={{ new Date(Date.now() - $('Config').first().json.calendlyPollLookbackDays * 86400000).toISOString() }}" },
    { name: 'count', value: '100' },
    { name: 'sort', value: 'start_time:asc' },
    // Deliberately no status filter: canceled events must be returned too.
  ], true), -1, 1)
  A(code('Expand scheduled events', EXPAND_EVENTS), 0, 1)
  A({ name: 'Have scheduled events?', type: 'n8n-nodes-base.if', typeVersion: 2,
    parameters: { conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 1 },
      conditions: [{ leftValue: '={{ $json.noEvents !== true }}', rightValue: true, operator: { type: 'boolean', operation: 'equals' } }],
      combinator: 'and',
    }, options: {} } }, 0, 0)
  A(get('Calendly event invitees', "={{ $json.uri + '/invitees' }}", [{ name: 'count', value: '100' }], true), 0, -1)
  A(code('Normalize Calendly poll', NORMALIZE_INVITEES), 1, -1)
  A({ name: 'Process one booking', type: 'n8n-nodes-base.splitInBatches', typeVersion: 3,
    parameters: { batchSize: 1, options: {} } }, 1, 0)
  A(code('Mark poll observation', CHECKPOINT), 12, 3)
  W.chain('Every 15 minutes (Calendly poll)', 'Config', 'Calendly current user', 'Calendly event types', 'Select BOXX event type', 'Calendly scheduled events', 'Expand scheduled events', 'Have scheduled events?')
  W.link('Have scheduled events?', 'Calendly event invitees', 0)
  W.link('Have scheduled events?', 'Config (reminders)', 1)
  W.chain('Calendly event invitees', 'Normalize Calendly poll', 'Process one booking')
  W.link('Process one booking', 'Config (reminders)', 0) // done
  W.link('Process one booking', 'Parse Calendly event', 1) // loop
  for (const terminal of ['Log confirmation event', 'Log confirmation failure', 'Save cancellation (nurture stays stopped)', 'Log unmatched booking']) W.link(terminal, 'Mark poll observation')
  W.link('Route booking action', 'Mark poll observation', 3) // no-op/duplicate fallback
  W.link('Mark poll observation', 'Process one booking')
}

module.exports = { addPolling }
