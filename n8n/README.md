# BOXX lead + nurture automation (n8n, SendGrid, Google Sheets, Calendly)

Form submit -> Email 1 (framework) -> Emails 2-5 on a schedule -> booking exits nurture -> booked-call emails.
Built for BOXX first; to reuse for a client, copy the Google Sheet, edit the **Config** node, swap the email copy in `emails/build.js`.

## What is here

| Path | What |
|------|------|
| `workflows/1-boxx-lead-intake.json` | Webhook for the audit form. Validates, dedupes by email, saves lead, notifies you, sends Email 1. |
| `workflows/2-boxx-nurture-scheduler.json` | Every 15 min. Sends Emails 2-5 when due. Re-checks stop conditions before every send. |
| `workflows/3-boxx-booking-exit.json` | Calendly booking/cancel -> stops nurture. Also sends confirmation + reminders, flips status to CALL_COMPLETED. |
| `emails/build.js` -> `emails/dist/` | 5 nurture + 3 booking emails (HTML + plain text) from shared components. |
| `sheet-template/*.csv` | Header rows for the 3 Google Sheet tabs. |
| `build-workflows.js`, `test-logic.js` | Generator for the workflow JSON and a logic test (`node n8n/test-logic.js`). |

Edit the generators, not the JSON, then re-run `node n8n/build-workflows.js` / `node n8n/emails/build.js`.

## Continue the existing deployment

The three workflows are already saved in n8n. Update those workflows in place; keep their existing IDs and credential assignments. Generated JSON remains inactive and uses credential-ID placeholders; importing it must not replace working credentials with placeholders.

- CRM Sheet: `16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g`, with `Leads`, `Email Events`, and `Error Log` tabs.
- Credentials: existing Google Sheets OAuth2, native SendGrid API, and native Calendly PAT named **Calendly account**. Do not switch Calendly to OAuth.
- Sender: **BOXX Automations <hello@boxxautomations.space>**; Reply-To: `hello@boxxautomations.space`; unsubscribe group: **42909**. These values are set in the generator's four Config nodes.
- Email assets: eight existing Dynamic Templates (five nurture, three booking), using `emails/dist/*.html`, corresponding plain text and `subjects.json`. Set all eight real template IDs in every Config node. The owner-supplied footer address is **54 Cannes Ave, Vaughan, ON, Canada**, set in all four Config nodes and passed as `mailing_address` to all email templates.
- The framework PDF is already in `public/BOXX-Website-Conversion-Framework.pdf`; verify its live URL before the owner's test.
- When intake is configured, enable intake for the controlled owner test and copy its production webhook URL into Sanity `siteSettings.n8nLeadWebhookUrl`. Test the live website submission, Sheet row, Email 1 delivery, and day 2/4/7/10 due dates before broad production activation.
- Test polling, booking exit, cancellation and reminders with the owner's Calendly booking. Scheduled workflows should be enabled only as needed for the controlled test, then approved by successful end-to-end results for production use.
- Pending Cloudflare forwarding does not block outbound SendGrid testing.

## Calendly PAT polling

Booking Exit now polls every 15 minutes using the saved **Calendly account** credential. It calls `GET /users/me`, resolves the configured discovery-call event type via `/event_types`, lists `/scheduled_events`, then fetches `/scheduled_events/{uuid}/invitees`. List calls paginate and include active and canceled records. No Calendly webhook registration or paid webhook upgrade is required by this implementation.

The scan covers events starting within the last 30 days and all future events, filtered to `Config.calendlyUrl`. Cancellations are processed before replacement bookings. A sequential loop feeds the existing booking/cancellation decisions and then runs existing reminders. Repeated invitee snapshots are checkpointed after downstream handling in workflow static data; Sheets booking state provides the existing second deduplication layer. Static data is persisted by successful active executions, not manual executions. Validate persistence during the controlled scheduled test.

`GET /users/me` has already authenticated with the PAT. Event-type, scheduled-event and invitee access still require a live test with that same PAT; a successful current-user call alone does not verify those endpoints. Keep the token in n8n Credentials. An old credential-test 404 is not grounds to replace a PAT that authenticates against the v2 API.

Primary references: [Calendly list scheduled events](https://developer.calendly.com/api-docs/calendly-api/scheduled-events/list-scheduled-events), [Calendly list event invitees](https://developer.calendly.com/api-docs/calendly-api/scheduled-events/list-event-invitees), [Calendly scopes](https://developer.calendly.com/docs/authentication/scopes).

## Rules it enforces

- One 5-email sequence per lead. Path (WEBSITE / EMAIL / BOTH) is derived from `services` server-side; browser-sent `path`/state is ignored.
- Dedupe by lowercased email. Repeat within 30 days: updates contact info only. After 30 days: Email 1 is re-sent and nurture restarts (never for unsubscribed, booked, or active clients).
- Timing lives in Config `cadenceDays` (default 2,4,7,10), measured from Email 1 delivery.
- Before every send: skip + mark STOPPED if unsubscribed, booked, or `client_status = ACTIVE`. After Email 5: `COMPLETED`.
- Booking: `calendly_booked=TRUE`, `nurture_status=STOPPED`, `client_status=CALL_BOOKED`. Cancel/reschedule never restarts nurture.
- Failures: 3 tries per Sheets/SendGrid call, then a row in `Error Log`. A failed Email 1 is retried by the scheduler for 48h. A booking from an email that matches no lead is logged.
- No secrets in the JSON. The webhook allows only `https://boxxautomations.space`.

## Verified vs not verified

- Verified: all decision logic in the Code nodes (64 checks in `test-logic.js`): routing, dedupe, 30-day resend, cadence, stop conditions, Email 5 completion, booking/cancel/duplicate/stale events, reminders. Workflow JSON is structurally valid (no broken links).
- **Not verified:** the polling revision has not been applied to live n8n. The three earlier workflows were imported and saved, but provider integration and live website end-to-end testing remain outstanding. Check HTTP pagination, sequential loop item selection, credentials, and static-data persistence on the installed n8n version.

## Known limits / follow-ups

- No SendGrid event webhook yet (bounces/spam complaints/unsubscribes). SendGrid still suppresses those addresses itself, but the sheet will not show it and the scheduler keeps advancing them. Next step: a 4th small workflow that sets `unsubscribe_status=TRUE`.
- SendGrid has no idempotency key: if a send succeeds but the sheet write then fails, the next run can resend. Failures land in `Error Log`.
- Google Sheets is not transactional; two near-simultaneous submissions from one email could create two rows.
- Polling can take up to 15 minutes plus execution time to detect a booking. A booking between polls can race a due nurture email. The 30-day historical scan does not discover changes to older calls. Confirm the discovery-call length matches the email copy.
- Capacity counter (spots open) is still hand-set in `lib/site-config.ts`; not wired to the sheet.
- Email 4 has no client proof by design. Real `[CLIENT RESULT]`, `[CLIENT QUOTE]`, `[CASE STUDY]` go in `emails/build.js` only once they exist.
- Post-call proposal / access checklist / invoice stay manual (only status auto-updates to CALL_COMPLETED).
