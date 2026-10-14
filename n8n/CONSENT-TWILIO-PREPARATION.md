# Consent and Twilio preparation — 2026-10-14

## Verified live Google Sheets changes

Existing CRM: [BOXX Automation CRM](https://docs.google.com/spreadsheets/d/16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g/edit).

All original 42 Leads columns and all rows were preserved; only five headers were appended at AQ:AU: `email_consent_source`, `sms_consent_source`, `sms_status`, `sms_opt_out_date`, `sms_opted_out`.

Existing `email_marketing_consent`, `sms_marketing_consent`, `email_consent_at`, `sms_consent_at`, `consent_source`, `sms_confirmation_status`, `sms_confirmation_sid`, `sms_confirmation_at`, `sms_opt_out`, and `unsubscribe_status` remain intact. No backfill or lead-row edit occurred. Blank consent never means verified opt-in. Separate source columns identify each channel's origin. Legacy SMS confirmation and opt-out fields remain authoritative history and are checked alongside the new fields.

Created one SMS Events tab with A:I in this exact order: `event_id,lead_id,email,channel,email_type,sent_at,message_id,status,phone`.

Readback confirmed all 47 Leads headers, SMS Events headers, and the existing Email Events and Error Log headers. Existing Consent Events remains intact. Header formatting was checked through cell metadata; the browser preview required Google sign-in. CSV files are reference schemas only: do not import them over the live CRM.

## Reviewed import artifact

Use `workflows/BOXX-Lead-Intake-Consent-Twilio.json` to review/update the existing Lead Intake workflow. It is the supplied export with scoped compatibility fixes, saved inactive. It preserves supplied node IDs, Google Sheets/SendGrid credential references, the `Twilio account` credential name, webhook path, and original outbound message content. No secrets are embedded. The generic generator does not overwrite this separately maintained import artifact. `1-boxx-lead-intake.json` remains the earlier marketing-gated baseline; do not activate both intake workflows at the same webhook path.

Changes from the supplied export:

- Only literal boolean `true` grants consent. Missing, blank, string, and numeric flags do not. The updated intake uses separate fields, without inferring them from legacy `consent`, email, or phone.
- Blank optional phone submissions preserve existing CRM phone data. Local CA/US formatting uses +1; international numbers require an explicit + prefix. Extensions, multiple plus signs, and ambiguous bare international numbers fail SMS preflight. E.164 syntax does not prove SMS deliverability.
- Preserves unsubscribe, booking/client state, prior express consent, and both legacy/new SMS opt-outs. New unconsented leads are not marked SMS subscribed. Each newly granted channel has its own timestamp and source.
- Prior SMS confirmation SID/status/time or known send/attempt status blocks another welcome even after the email resend window. An explicit SMS opt-in on the current submission is required for a new welcome.
- Records `sms_confirmation_status=pending` before Twilio. Automatic Twilio retries are disabled to avoid repeated sends after ambiguous network failures. Acceptance records SID/time and provider status; queued is not delivered. Failures are recorded in Leads, Error Log, and SMS Events. Invalid destinations and missing sender are logged without contacting Twilio. Error 21610 records SMS opt-out fields when its code is available in the error output.
- Sheets writes ignore unexpected input keys instead of creating columns. All emitted fields match the verified live headers.

## Form and send behavior

The /audit checkboxes are optional, independently unchecked by default, and submit real `email_marketing_consent` and `sms_marketing_consent` booleans. Phone is included when supplied and never implies consent. Unticking a checkbox on a later inquiry is not an unsubscribe action; previous verified express consent remains unless an explicit opt-out record blocks it.

Transactional Email 1 sends for a new valid audit request even without marketing consent. It retains the supplied framework-only content and SendGrid transactional unsubscribe bypass; no booking promotion or marketing template is added. Existing requests use the supplied 30-day resend, booking/client, and unsubscribe rules. After SendGrid accepts Email 1, Leads is marked framework delivered. Only effective email marketing consent sets nurture ACTIVE and schedules Email 2; otherwise nurture is HELD with no due date. Provider acceptance is not proof of inbox delivery.

The welcome SMS follows successful Email 1 acceptance and its CRM update. It also requires explicit current SMS opt-in, no SMS opt-out, a recognized destination, configured sender, and no prior welcome attempt. The original BOXX welcome wording, booking link `https://calendly.com/kaleellawrenceboxx/discovery-call`, and `Reply STOP to opt out.` remain unchanged. `Config.twilioFromNumber` is still `+1REPLACE_WITH_TWILIO_NUMBER` and blocks sending until replaced.

## Manual configuration still required

1. Review/import into the existing n8n intake workflow, preserving saved credentials. Rebind `Twilio account` if its name-only reference is not resolved. Verify native Google Sheets/SendGrid credentials and refresh column mappings in the installed n8n version. No live n8n update was performed.
2. Set `Config.twilioFromNumber` to an actual SMS-capable Twilio sender in E.164 format. Verify account access, allowed destinations, trial restrictions if applicable, and required sender registration. No sender was guessed, purchased, or tested.
3. Implement inbound SMS STOP handling before activation. Validate Twilio signatures, match the existing lead by normalized phone, then set `sms_marketing_consent=FALSE`, `sms_opted_out=TRUE`, legacy `sms_opt_out=TRUE`, `sms_status=unsubscribed`, and `sms_opt_out_date`. Preserve email consent and `unsubscribe_status`. Welcome text alone does not synchronize opt-outs with the CRM.
4. Add authenticated Twilio delivery callbacks if actual delivered/undelivered tracking is required. Current SMS Events rows record API acceptance or immediate errors, not later carrier delivery.
5. Serialize intake executions or add an atomic per-lead lock before production. Google Sheets read/reservation is not atomic: concurrent requests can both pass lookup. Investigate pending/failed attempts against Twilio history before any manual retry; do not simply clear history or retry all failures.
6. Apply/review the separate live Nurture Scheduler consent patch before activating Emails 2–5. The local baseline now uses `email_marketing_consent` rather than the stale column name; live scheduler was not updated. Require verified email consent and existing unsubscribe/booking/client guards on each marketing send. Keep no-consent leads HELD and review retry/release behavior with transactional Email 1. No-consent transactional Email 1 retries are not supplied by the older scheduler. Cadence stays `[2, 4, 7, 10]`.

## Verification limits

Offline tests execute code nodes, consent combinations, opt-out/history guards, phone preflight, transactional fulfillment, event shapes, and connections without provider calls. CRM headers were verified through connected Google services. No live n8n workflow was edited/activated, no Twilio secret read or changed, and no SMS or email sent. Provider authentication, installed-version execution, sender ownership, booking-page availability, and actual delivery remain deployment checks.
