# agency-starter — Project Instructions

Next.js 14 + Sanity v3 portfolio/agency site for **BOXX Automations**. **→ Full details in @BUSINESS.md, @CONTEXT.md, @DESIGN.md**

---

## Stack & Build

| Task | Command |
|------|---------|
| Dev server | `npm run dev` → http://localhost:3000 |
| Build | `npm run build` → `.next/` |
| Typecheck | `npx tsc --noEmit` |
| Lint | `npm run lint` (ESLint) |
| Seed Sanity | `node scripts/seed.js` (reads `sanity-seed-data.json`) |

Node: 18+ (Next 14 requirement). Package manager: npm.

---

## Architecture

- **`app/`** — Next.js App Router pages + API routes (`/api/subscribe` for Resend email signups)
- **`components/`** — Reusable React components (Header, Hero, ResultsGrid, LeadForm, etc.)
- **`sanity/`** — Sanity v3 config, schemas (7 types: siteSettings, service, caseStudy, processStep, teamMember, homePage, aboutPage), client setup
- **`scripts/seed.js`** — Upserts all Sanity docs from `sanity-seed-data.json`

All colors driven by CSS custom properties set in `app/layout.tsx` from Sanity `siteSettings` — no hardcoded colors.

---

## Environment & Secrets

**`.env.local` (gitignored; copy from `.env.local.example`)**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=bml84tp5
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_...              # Read+write token from sanity.io
NEXT_PUBLIC_COMPANY_NAME=Boxx Automations
NEXT_PUBLIC_SITE_URL=https://boxxautomations.space
RESEND_API_KEY=re_...                # Optional; server-side only (no NEXT_PUBLIC_ prefix)
```

**Vercel (production):** Set all above in project settings. Use `printf 'value' | npx vercel env add VAR_NAME production` on Windows (avoids `\r\n` trailing newlines that break Sanity projectId validation).

---

## Git Workflow

- **Main branch:** `main` (production-ready)
- **Feature work:** Create branches off `main`, PR back to `main`
- **Commits:** No strict message style yet; keep them descriptive

---

## Gotchas

1. **`next.config.mjs` (not `.ts`)** — Next.js 14 doesn't support TS config. Must be `.mjs` with JSDoc types.
2. **`vercel.json` required** — Without it, Vercel skips Next.js auto-detection.
3. **Resend key:** Must NOT have `NEXT_PUBLIC_` prefix. Only accessible via `/api/subscribe` server route.
4. **Windows env vars:** Never use `<<<` heredoc with Vercel. Use `printf 'value' | npx vercel env add NAME`.
5. **n8n webhook:** `n8nLeadWebhookUrl` in Sanity is safe to set before n8n goes live (form will fail gracefully).
6. **Seed data format:** `sanity-seed-data.json` is gitignored (has real token). Template: `sanity-seed-data.example.json`.

---

## Before Making Changes

**MUST READ @BUSINESS.md first for:**
- Copy, forms, CTAs, lead handling
- Email automation, nurture sequences
- Customer journey, booking flow
- Social proof, testimonials (none hardcoded — ever)
- Capacity counter (always from CRM, never hardcoded)

**Schema changes, deploy config, deletes, migrations:** Check with me first — these affect live data and client sites.

**Dev server state:** Sometimes `.next/` cache causes stale pages. Try `rm -rf .next && npm run dev` if you see unexpected behavior.

---

## Testing, Linting, CI

- **No unit/integration tests** currently. ESLint is installed (`npm run lint`).
- **No CI/CD pipeline** (GitHub Actions, etc.) — all deploys manual via `vercel deploy`.
- Consider: pre-commit hooks for lint/typecheck if adding them (request via `/update-config`).

---

## Pages & Components

See @CONTEXT.md tables for full component & page inventory. Notable:
- Home page: Hero → ServicesGrid → TrustSignals → ResultsGrid → ProcessSteps → CTA
- `/studio` — Embedded Sanity Studio for CMS editing
- `/sitemap.xml` auto-generated; `/robots.txt` disallows `/studio/`
- Per-page SEO via `seoTitle`/`seoDescription` fields in Sanity

---

## Excluded (See Other Docs)

- **@BUSINESS.md:** Customer journey, email sequences, copy rules, pricing model, guardrails
- **@CONTEXT.md:** Full Sanity schema docs (7 types, 40+ fields), Portable Text rendering, JSON-LD, Resend integration, n8n workflow, deployment SOP
- **@DESIGN.md:** Visual system, typography, color spec, "Corporate Cybernetic Precision" spec
