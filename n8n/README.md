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

## Setup (in order)

1. **Google Sheet.** Create tabs `Leads`, `Email Events`, `Error Log`. Paste each CSV's header row into row 1 (same column names, same order is fine).
2. **SendGrid.** Verify your sender/domain. Create an unsubscribe group (note its numeric ID). Create 8 Dynamic Templates and paste in `emails/dist/*.html` (plain text from the matching `.txt`). Subjects are in `dist/subjects.json`. Create an API key (Mail Send).
3. **n8n credentials:** Google Sheets OAuth2; Header Auth named `SendGrid API key` (`Authorization` = `Bearer SG...`); Calendly.
4. **Import the 3 workflows.** In each one, open the **Config** node and replace every `REPLACE...` value (sheet ID, sender, reply-to, mailing address, ASM group ID, 8 template IDs). The same Config is in all three workflows, keep them identical. Assign credentials on the Sheets / HTTP / Calendly nodes.
5. **Webhook URL.** In Workflow 1 copy the **Production** URL (`https://<your-n8n>/webhook/boxx-lead`) and paste it into Sanity Studio -> Site Settings -> `n8nLeadWebhookUrl`. No site code change needed. Activate all three workflows.
6. **Framework PDF.** Put it at `public/BOXX-Website-Conversion-Framework.pdf` (not in the repo yet) or change `frameworkUrl` in Config.
7. **Test:** run the form with your own email, check the `Leads` row, the inbox, then book a test call and confirm nurture stops.

## Rules it enforces

- One 5-email sequence per lead. Path (WEBSITE / EMAIL / BOTH) is derived from `services` server-side; browser-sent `path`/state is ignored.
- Dedupe by lowercased email. Repeat within 30 days: updates contact info only. After 30 days: Email 1 is re-sent and nurture restarts (never for unsubscribed, booked, or active clients).
- Timing lives in Config `cadenceDays` (default 2,4,7,10), measured from Email 1 delivery.
- Before every send: skip + mark STOPPED if unsubscribed, booked, or `client_status = ACTIVE`. After Email 5: `COMPLETED`.
- Booking: `calendly_booked=TRUE`, `nurture_status=STOPPED`, `client_status=CALL_BOOKED`. Cancel/reschedule never restarts nurture.
- Failures: 3 tries per Sheets/SendGrid call, then a row in `Error Log`. A failed Email 1 is retried by the scheduler for 48h. A booking from an email that matches no lead is logged.
- No secrets in the JSON. The webhook allows only `https://boxxautomations.space`.

## Verified vs not verified

- Verified: all decision logic in the Code nodes (45 checks in `test-logic.js`): routing, dedupe, 30-day resend, cadence, stop conditions, Email 5 completion, booking/cancel/duplicate/stale events, reminders. Workflow JSON is structurally valid (no broken links).
- **Not verified:** the workflows were never imported into a live n8n, and nothing was sent through SendGrid, Sheets or Calendly. Expect to fix small node-parameter differences on first import (n8n version differences in the Google Sheets / Calendly nodes). Test with your own email first.

## Known limits / follow-ups

- No SendGrid event webhook yet (bounces/spam complaints/unsubscribes). SendGrid still suppresses those addresses itself, but the sheet will not show it and the scheduler keeps advancing them. Next step: a 4th small workflow that sets `unsubscribe_status=TRUE`.
- SendGrid has no idempotency key: if a send succeeds but the sheet write then fails, the next run can resend. Failures land in `Error Log`.
- Google Sheets is not transactional; two near-simultaneous submissions from one email could create two rows.
- Calendly webhooks require a paid Calendly plan. The email says "15-Minute Call": make sure the Calendly event length matches.
- Capacity counter (spots open) is still hand-set in `lib/site-config.ts`; not wired to the sheet.
- Email 4 has no client proof by design. Real `[CLIENT RESULT]`, `[CLIENT QUOTE]`, `[CASE STUDY]` go in `emails/build.js` only once they exist.
- Post-call proposal / access checklist / invoice stay manual (only status auto-updates to CALL_COMPLETED).
