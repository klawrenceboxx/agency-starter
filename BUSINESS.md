# BOXX Automations: Business Context

Stable business model, offers, customer journey and systems. Read this before changing copy, forms, CTAs, lead handling, CRM, email automation, booking, or anything in the customer journey. Technical details live in `CONTEXT.md`, visual system in `DESIGN.md`. Revenue targets and project status are deliberately not kept here (they go stale).

---

## 1. What BOXX is

Solo agency run by Kaleel Lawrence-Boxx, Vaughan, Ontario. Helps businesses convert more of the leads and traffic they already paid for.

**Core promise:** "You already paid for these leads. Let's make sure they convert." Not "we build websites."

**Two services (everything else supports these):**

1. **Conversion-focused websites.** Audits, redesigns and new builds planned around one conversion goal before any design starts.
2. **Automated email follow-up.** Welcome/nurture, abandoned cart, post-purchase and win-back flows. For online stores and high-ticket one-to-one services.

**Supporting only (never equal billing):** free website audits, SEO basics.

**Differentiator:** sites built around one specific conversion goal, not generic AI-commoditized site building.

**Authority:** mechanical engineering degree (Toronto Metropolitan University), about 7 years coding, studies buyer behaviour, runs a small business himself.

**Proof strategy:** no client portfolio yet. The proof is BOXX's own site and funnel, built with the same framework it sells. Never add placeholder testimonials, stats or logos. When real testimonials exist they lead with the client's prior hesitation, not generic praise.

**Capacity:** only 5 client slots at a time. Site shows a live counter driven by CRM data. It must never be hardcoded. When full, the funnel shows a waitlist state.

**Guarantee:** 100% money-back. Not happy with the website within 30 days of launch, or the email system within 90 days of launch: client chooses a full refund, or BOXX keeps working at no extra cost until they are happy.

**Primary audience:** small business owners in the Vaughan area, reached via the Vaughan Chamber of Commerce and similar local networking, plus ads and social. Shared identity: small business owner in Vaughan.

---

## 2. Customer journey (end to end)

1. **Entry.** Visitor clicks "Get Your Free Audit" on the site (or scans a QR code on a business card at a networking event).
2. **Audit modal** (not a new page), 4 steps:
   1. Contact: name, email, phone, website
   2. Service interest: website conversion / automated emails / both (multi-select)
   3. Budget: three forced-choice tiers only: Under $1,000 / $1,000–$2,500 / $2,500+ (no "not sure")
   4. Confirmation: "You're in" (slot available) or "You're on the waitlist" (full). Both end with "check your email."
3. **Instant delivery.** n8n writes the lead to the CRM, then emails the visitor the promised asset immediately (the BOXX Website Conversion Framework, i.e. the lead magnet). Kaleel is notified too. The lead magnet is never called a "lead magnet" to the visitor.
4. **Personal review.** Kaleel reviews the prospect's site and sends a personalized Loom (about 5 minutes) plus the audit deck. **Do not mention the Loom in public site or form copy.** Public step 4 stays "Get your recommendations: what I'd fix first."
5. **Booking.** The Loom/audit email drives to a Calendly discovery call. Site "Book a call" link also exists in Contact, but the audit is the single primary conversion path. No "book a call instead" alternative in the funnel.
6. **Discovery call.** Walk through the audit, discover goals, then scope and pricing.
7. **If they proceed:** proposal, access checklist and invoice (see section 5), then kickoff call, then implementation.

**Nurture handling:** leads who don't book enter the email nurture (section 4). Leads who book exit nurture and move to a booked-call sequence.

---

## 3. Website conversion framework

BOXX's methodology. It is the lead magnet, the audit checklist, the build process, and the basis for educational videos and email content.

**11 phases (0–10), 77 checklist items.** Each item has an **Audit** question (what's wrong) and a **Build** action (the fix). The same checklist runs whether auditing a prospect or building for a client.

| # | Phase | Items | Deliverable |
|---|-------|-------|-------------|
| 0 | Research & Strategy | 7 | Strategy brief |
| 1 | Offer & Positioning | 8 | Positioning + offer sheet |
| 2 | Information Architecture | 5 | Sitemap + page hierarchy |
| 3 | Copy & Messaging | 8 | Final page copy |
| 4 | Attention & Layout | 7 | Wireframe |
| 5 | Trust & Persuasion | 8 | Proof plan |
| 6 | UI & Experience | 7 | Design tokens + components |
| 7 | Conversion Mechanics | 7 | CTA funnel |
| 8 | Lead Capture & Nurture | 6 | Nurture sequences + n8n routing |
| 9 | Technical Foundation | 6 | QA checklist |
| 10 | Measurement & Optimization | 8 | Analytics plan |

Principles that show up everywhere: one primary conversion per page/site; conversion hypothesis before changes (observation, hypothesis, change, how to measure); recommendations based on evidence, not design preference; set expectations before asking for commitment; deliver the promised asset immediately; prevent lost or mishandled leads (routing, error handling, logging, notifications).

**Audit deliverable is not the full checklist.** The audit deck distills findings to: biggest opportunity, three major changes, hero and CTA, navigation, authority, layout and mobile, measurement, first three moves. Plus the Loom.

**Copy rules:** 6th-grade reading level, no jargon, headlines hard for competitors to copy, one CTA per section, CTA button text is "Get Your Free Audit" everywhere.

**Homepage CTA placements are capped at four:** nav, hero, process, final CTA. Don't add more. Homepage order: Hero, Authority, Problem recognition, Services, Objection handling, Process preview, CTA, Footer. Sitemap: Home, Services, How It Works, About, Contact. "Get Your Free Audit" is a persistent nav button, not a nav item.

---

## 4. Automated email system

**Three sequences, one shared 5-email cadence** (Website Conversion, Automated Emails, Both). Chosen by the service-interest answer in the audit modal.

| Email | Timing | Job |
|-------|--------|-----|
| 1 | Immediately | Deliver the audit/framework, set expectations |
| 2 | Day 2 | Insight / educate |
| 3 | Day 4 | Show what BOXX would build |
| 4 | Day 7 | Proof / case study |
| 5 | Day 10 | Objections + the ask |

- Every email ends with a soft "not ready yet, keep the emails" close.
- Personalization is first-name based. Delivery is instant via n8n. All lead and sequence state lands in the CRM automatically.
- Booked leads exit nurture immediately.
- Suppression logic: unsubscribed, booked and already-client contacts never receive nurture.
- **Do not fabricate proof.** Case-study numbers in draft mockups (for example +142% revenue, +38% email revenue) are placeholders until backed by real client results. Do not ship them as fact.

**Backend (n8n):** website form → CRM/lead state → email delivery → nurture → booking state (Calendly), treated as one system with failure handling: routing, logging and notifications when a form, email or CRM write fails.

**Analytics to keep working:** CTA clicks, each modal step, submissions, email opens/clicks, bookings.

---

## 5. Fulfillment and paperwork

Templates live outside the site repo (client-ops files). Use them in this order:

| Stage | Template | Notes |
|-------|----------|-------|
| Audit | Conversion Audit deck (.pptx) | 10 slides. Low words per slide, screenshots pasted in manually, rebrand colors when the site changes |
| After discovery call | Proposal (.docx) | Background, scope (included / not included), investment, access needed, 5-week timeline, next steps. Email confirmation is enough, no signature required |
| With proposal | Access Checklist (.docx) | Google Analytics (viewer), Search Console, CMS admin (separate account), Google Ads if running paid, booking system access or export. Domain and hosting only if a task requires them. About 10–15 minutes for the client |
| Billing | Invoice (.docx) | CAD, payment due on receipt, e-transfer |

**Pricing model (proposal template):** startup fee due before work begins, plus a performance fee (percentage of revenue from new customers above a baseline). Baseline is the average monthly leads/bookings over the 3 months before launch, from analytics. Set term in months from launch. At term end: renegotiate or revert to no ongoing fee. Amounts are per-client and not fixed here. Audits are free.

**Standard timeline:** Week 1 access, baseline and kickoff; Weeks 2–3 design and build; Week 4 review and revisions (two rounds included); Week 5 launch.

**Standard scope items:** hero/headline/CTA rewrite, navigation simplification, typography consistency, key conversion page redesign, mobile fixes, analytics and lead-tracking cleanup. Usually excluded: inner page content, new booking system design, ongoing content updates.

---

## 6. Guardrails for Claude Code

- One primary conversion (the free audit). Don't add competing CTAs, forms, or "book a call instead" paths.
- No placeholder social proof, stats or testimonials anywhere.
- Never hardcode the capacity counter, always read from the CRM.
- Don't reveal the personal Loom in public copy.
- Keep copy at 6th-grade level, jargon-free.
- Any change to the form, CTAs, CRM fields, email triggers or booking must keep the n8n flow intact and update analytics events.
- Keep SEO visually secondary to the two core services.
- When in doubt about a business rule, ask Kaleel rather than guessing.

---

## 7. Open items (confirm with Kaleel)

- Site copy currently says "10-phase" in places, but the framework is 11 phases (0–10) and 77 items. Align on one wording.
- "Both" sequence emails are not finalized.
- Guarantee fine print and performance-fee percentages are set per client.
- Whether SEO gets an equal fourth services card (currently: no, supporting only).
