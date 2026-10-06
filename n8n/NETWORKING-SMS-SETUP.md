# Networking consent and SMS rollout

This extends the existing `/audit` -> BOXX Lead Intake -> BOXX Automation CRM -> SendGrid flow. No new lead webhook, CRM or nurture sequence is created. The normal homepage phone stays optional.

## Current rollout state

Implementation is on `codex/networking-consent-sms` (draft PR #2), not production. Local build and automated tests pass; browser verification of this extension is blocked by the browser runtime credential-protection failure. The existing CRM now has the additive columns and Consent Events tab below. The live intake and scheduler have NOT been replaced or edited. The existing n8n `Twilio account` credential was found; its validity, Account SID, sender and Messaging Service have not been verified. SMS remains disabled in prepared workflow configuration.

The cloud browser's native credential protection blocked obtaining a live workflow export. Do not import the repository's placeholder-configured workflows into production over the working workflows. First download the existing **BOXX - Lead Intake** and **BOXX - Nurture Scheduler** via each editor's top-right `...` -> **Download** in your normal browser. Provide those two exports for the configuration-preserving upgrade. Exports include credential references; don't separately export credentials or provide tokens in chat.

`node n8n/prepare-networking-upgrade.js existing-intake.json upgraded-intake.json`

Run the same command for the scheduler. The script retains existing workflow/node IDs, credentials, configured template IDs, sender settings, webhook path and activation state. It aborts if the expected code is different. Apply the upgraded node definitions and connections to the existing workflow IDs after review; do not append an import to the existing canvas or create new workflows. Do not activate the currently inactive scheduler as part of this rollout.

## Approved consent behavior

Two optional, unchecked boxes only. Phone required on `/audit`, optional on homepage. This version supports Canadian/US NANP numbers (10 digits, or 11 with country code 1); server stores E.164. Format validation does not prove ownership, mobile capability or reachability.

- Email false: send the requested resource/audit-only email, not promotional emails 2-5.
- Email true: existing WEBSITE/EMAIL/BOTH sequence, including all existing unsubscribe, booking, active-client and resend protections.
- SMS false: no text, even though phone is required.
- SMS true: one confirmation SMS after CRM capture, only when Twilio is configured.
- Neither unchecked box prevents the audit request.
- Legacy leads without the new explicit profile keep their existing processing. A later homepage submission cannot silently override stored networking marketing restrictions.
- Existing opted-out or already queued/sent confirmations are not resent. Ambiguous PENDING states require manual review; no automatic API retries, because Twilio does not offer an SMS creation idempotency key here.

The audit-only email omits the original template's promise of 10 days of follow-ups. The SMS mentions the demonstration sequence only for opted-in email recipients. It includes BOXX identity, contact email and STOP, and never describes the Twilio number as a personal number. No recurring promotional SMS campaign is added.

## CRM additions (same spreadsheet)

Leads columns AE:AP:

`consent_profile`, `email_marketing_consent`, `sms_marketing_consent`, `email_consent_at`, `sms_consent_at`, `consent_recorded_at`, `consent_source`, `consent_version`, `sms_confirmation_status`, `sms_confirmation_sid`, `sms_confirmation_at`, `sms_opt_out`.

Booleans are stored as TRUE/FALSE. Server UTC timestamps are used; client timestamps are not trusted. The source is the existing `source = networking`; consent source is `https://boxxautomations.space/audit`. Wording version is `networking-consent-v1`.

**Consent Events** is an append-only audit tab in the same CRM with event ID, lead ID, email, normalized phone, both choices, recorded time, source, version and exact checkbox wording. It preserves each submission's evidence, including declined choices. Existing data and routing columns remain intact.

SMS status distinguishes PENDING, BLOCKED_CONFIGURATION, FAILED and provider API status (e.g. QUEUED). QUEUED is API acceptance, not proof of delivery. Failures go to the existing Error Log and do not delete the lead. A delivered-event callback is not configured; verify actual handset receipt and the Twilio message log before claiming delivery.

## Twilio manual setup

1. In Twilio Console, select the account matching n8n's existing **Twilio account** credential. Copy its **Account SID** (starts AC) for the intake's Config node. Keep the Auth Token inside the existing n8n credential; test that credential in n8n. Never put credentials in Vercel, Sanity or frontend code.
2. Under **Phone Numbers -> Manage -> Active numbers**, choose a number you control with SMS capability and a sender registration that permits the intended Canadian traffic. If buying a number is necessary, the owner must choose and purchase it; no spending has been authorized by this task. A toll-free number must complete toll-free verification before messaging Canadian/US recipients. For US traffic from a US local long code, finish A2P 10DLC registration. Follow the console's required registration for your chosen sender.
3. Go to **Messaging -> Services -> Create Messaging Service** (or select your existing service). Use a BOXX-specific service with the applicable use case. Under **Sender Pool**, add the chosen SMS-capable number. Copy the **Messaging Service SID** (starts MG).
4. Enable **Advanced Opt-Out** for that service and verify STOP/START/HELP behavior and BOXX identification. STOP must block further sends. Configure incoming replies to your supported inbox/handler if you want two-way replies; the prepared text offers email contact until that is verified.
5. Under **Messaging -> Settings -> Geo Permissions**, permit Canada; permit US only if you intend to message US recipients and have completed the sender requirements. Configure SMS pumping protection for the service. A trial account can send only to verified recipients; use an owner-verified test number for testing or upgrade the account yourself.
6. In the existing intake's **Config**, set `twilioAccountSid` and `twilioMessagingServiceSid`. On **Send networking SMS (Twilio)**, select the existing **Twilio account** credential. Leave `smsEnabled: false` until the workflow and sender have been reviewed and tests are ready.
7. Enable `smsEnabled: true` for a controlled owner test; submit a real opted-in mobile number you control. Verify the existing CRM row, email, handset SMS, first name, matching message SID, and STOP. Never send to fabricated test numbers. API acceptance alone does not count as successful SMS delivery.

## Rollout checks

Before releasing the changed form: apply and test the intake consent changes first, and patch the inactive scheduler without activating it. Verify legacy homepage payloads still work. Then preview/test the new form and perform controlled live submissions covering false/false, true/false, false/true and true/true. Validate both independent CRM choices and Consent Events, all three routing paths, and audit-only versus promotional template selection.

Unit tests: `node tests/audit-form.cjs`, `node n8n/test-logic.js`, `node n8n/test-networking-consent.js`. These mock browser fetch or execute node code; they do not prove live n8n execution or Twilio delivery. Keep production deployment blocked until the backend upgrade and consent integration checks pass. Clearly report SMS delivery/STOP as blocked if the sender is not configured.

## Primary references

- CRTC express/implied consent guidance: https://crtc.gc.ca/eng/com500/guide.htm (credibility 10/10, regulator).
- CRTC opt-in/toggling guidance: https://crtc.gc.ca/eng/archive/2012/2012-549.htm (credibility 10/10, regulator).
- Twilio Messaging Policy: https://www.twilio.com/en-us/legal/messaging-policy (credibility 10/10 for provider requirements).

These authoritative rules are used rather than peer-reviewed literature to determine provider and regulatory implementation requirements. This implementation does not decide whether all legacy leads have a legally valid consent basis; legacy processing is preserved as requested.
