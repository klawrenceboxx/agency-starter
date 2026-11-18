# Mood landing page handoff

Branch: feat/mood-landing. Not deployed.

## Remaining inputs
- Finished video or actual approved ASAN, VERITE, Yamaha R1 screenshots.
- Convert supplied screenshots to public/mood/asan.webp, verite.webp, yamaha-r1.webp; preserve aspect ratio and update Image dimensions to match actual images.
- Check mobile/desktop layout with actual images, both download HTTP responses and prompt copying before deployment.

## Delivery
- Networking guide and its components/workflow are unchanged.
- Existing n8n guide endpoint uses an allowlist and PDF-specific delivery; /api/subscribe silently succeeds when unconfigured. Neither is treated as verified kit delivery.
- Direct downloads are supplied and ZIP structure checked. Browser/HTTP download checks remain pending.
- Email form is fail-closed and hidden unless MOOD_DELIVERY_WEBHOOK_URL exists. A resource-specific workflow must deliver both download links and return {ok:true} only after a successful send. Test it using an owner-approved email address before enabling the form. Marketing consent is false; kit requests are not newsletter signups.
- Existing GA, Clarity, attribution and site chrome remain intact. Download and request events use mood_download and mood_email_request; prompt copy uses the existing guide_prompt_copy event.

## Checks
- npm run lint: passed.
- npm test: passed all existing suites.
- npx tsc --noEmit: passed.
- npm run build: compiled/typechecked, then failed collecting page data because this fresh checkout lacks NEXT_PUBLIC_SANITY_PROJECT_ID. Use authorized project configuration for the final build; do not invent a Sanity project ID.
- Networking guide, shared guide components, root layout/header/footer unchanged (git diff checked).
