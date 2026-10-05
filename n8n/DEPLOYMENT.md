# BOXX deployment status

Updated 2026-10-05 UTC, continuing `cce2b9c` on `main`. No system redesign.

## Existing live state

- All three BOXX workflows are imported and saved in n8n, inactive at inspection.
- Google Sheets and native SendGrid credentials are connected (owner-provided state).
- Native Calendly PAT **Calendly account** authenticated against `GET /users/me`; preserve it and do not switch to OAuth.
- CRM workbook: https://docs.google.com/spreadsheets/d/16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g/edit
- SendGrid domain authentication is verified (owner-provided state). Unsubscribe group is **42909**.

## Repository changes completed

- Replaced Calendly webhook transport with 15-minute PAT polling, paginated event-type/event/invitee reads, canceled-event handling, sequential booking processing and persisted snapshot deduplication.
- Preserved booking exit, cancellation, nurture stop, confirmation and reminder decisions. Repeated/historical cancellation cannot clear an unrelated booking.
- Set the CRM Sheet ID, native SendGrid credential type, sender **BOXX Automations <hello@boxxautomations.space>**, Reply-To `hello@boxxautomations.space`, and unsubscribe group **42909** in generated Config nodes.
- Regenerated all workflow JSON, inactive. All **64** logic/structure checks pass. These are local checks, not live provider verification.

## Remaining work before production activation

- Apply the revision to existing live workflow IDs, retaining saved credentials; do not create duplicate production workflows.
- Obtain the owner's physical mailing address. Eight email template IDs and mailing address remain placeholders; outbound email is not ready until they are configured.
- Create/verify eight SendGrid Dynamic Templates and assign their IDs to all four Config nodes.
- Verify the same PAT can list event types, scheduled events and invitees; validate pagination, loop handling and static-data persistence in the installed n8n version.
- Connect Sanity `siteSettings.n8nLeadWebhookUrl` when intake is ready, enable controlled testing, and let the owner submit their own information through the live website.
- Verify n8n execution, correct Sheet row, immediate Email 1, and Emails 2–5 due dates. Then verify a real Calendly test booking is detected within the poll interval, stops nurture and sends confirmation/reminders; test cancellation too.
- Activate appropriate production workflows after successful end-to-end tests. Cloudflare email forwarding must not block outbound testing.

## Current access blocker

Secure n8n sign-in succeeded and the workflow list/editor were readable, but Work browser native credential protection subsequently blocked observation and prevented the runtime from safely resuming. This session did not change live workflows, SendGrid templates, or Sanity, activate anything, or send email. A fresh authorized Work browser session is needed to complete live configuration.

Known limits in README remain. The framework PDF already exists in the repo; confirm its production URL during testing.
