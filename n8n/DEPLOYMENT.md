# BOXX deployment status

Source reviewed: `2d19802` on `main` (2026-10-02 UTC).

## Completed

- Read the setup guide, generators, workflows, email assets, Sheet templates, and website form integration.
- Existing 45 decision-logic checks pass.
- Fixed four IF v2 nodes that used the legacy IF v1 conditions format. Generator and JSON agree; business decisions are unchanged.
- Created and verified the native Google Sheets workbook **BOXX Automation CRM**:
  https://docs.google.com/spreadsheets/d/16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g/edit
- Exact CSV headers verified in `Leads`, `Email Events`, and `Error Log`; no lead data added.
- Added the existing 11-phase, 77-item framework PDF at `public/BOXX-Website-Conversion-Framework.pdf`.

## Still required before activation

- Import all three corrected workflows and set `sheetId` to `16s4qGSyevCuW_aZjPkbQDoDForhP7V-DzIqXQihAG6g` in all four Config nodes.
- Connect Google Sheets OAuth2, SendGrid Header Auth, and Calendly credentials. None existed in the live credential list at inspection.
- Verify sender, create the eight existing email templates and an unsubscribe group, then fill sender/reply-to/address/group/template placeholders.
- Confirm the Calendly plan supports the trigger and the event is 15 minutes.
- Verify the PDF is served by the production site after deployment.
- Test intake, email delivery, nurture, booking exit, cancellation and reminders with the owner's address before activating production schedules and connecting Sanity.
- Set Sanity `n8nLeadWebhookUrl` only when the intake workflow is ready; production URL should be copied from the live node.

## Environment blocker

n8n sign-in succeeded and the workflow/credential lists were readable. The cloud browser's native credential protection blocked the file chooser and subsequently prevented the runtime from resuming. No BOXX workflow was imported or activated, no Sanity settings were changed, and no email was sent.

The known limits listed in README remain in effect. In particular, the checks above cover Code-node decisions, not live provider integration.
