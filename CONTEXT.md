# agency-starter — Full Context

## What This Is

A Next.js 14 + Sanity CMS website template built for AI/automation agencies. Currently deployed as **Boxx Automations** (`boxxautomations.space`) — an AI automation agency owned by Kaleel Lawrence.

This template is also a productized service offering. The entire build process (deploy + Google Business + SEO + email marketing + lead nurturing) is documented in `../../projects/ops/sops/premium_website_package_sop.md`.

---

## Live Deployment (Boxx Automations)

| Item | Value |
|------|-------|
| Production URL | https://agency-starter-actbjpxdx-kaleel-lawrence-boxxs-projects.vercel.app |
| Custom domain | boxxautomations.space (DNS pending — add A record 76.76.21.21 in Namecheap) |
| Vercel project | kaleel-lawrence-boxxs-projects / agency-starter |
| Sanity project | bml84tp5 |
| Sanity dataset | production |
| Sanity Studio | https://bml84tp5.sanity.studio (also embedded at /studio on the live site) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.15 (App Router) |
| CMS | Sanity v3 (headless, GROQ queries) |
| Styling | Tailwind CSS + CSS custom properties |
| Typography | @tailwindcss/typography |
| Email signups | Resend Audiences API |
| Lead capture | n8n webhook (local; cloud deploy pending) |
| Hosting | Vercel |
| Fonts | Inter (Google Fonts) |

---

## Theme System

All colors are driven by CSS custom properties set in `app/layout.tsx` from Sanity `siteSettings`. Tailwind maps to those vars.

| CSS Var | Default | Tailwind Class | Purpose |
|---------|---------|----------------|---------|
| `--color-bg` | `#0a0f1e` | `bg-bg` | Page background |
| `--color-surface` | `#111827` | `bg-surface` | Cards, sections |
| `--color-primary` | `#00d4ff` | `text-primary`, `border-primary` | Accent color |
| `--color-accent` | same as primary | `text-accent` | Alias for primary |
| `--color-border` | primary at 20% opacity | — | Borders |
| `--color-text-muted` | `#9ca3af` | `text-muted` | Secondary text |

Changing brand colors in Sanity siteSettings automatically updates the entire site — no code changes needed.

---

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home: Hero → ServicesGrid → TrustSignals → ResultsGrid → ProcessSteps → CTA |
| `/services` | `app/services/page.tsx` | All services list |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | Individual service page with JSON-LD Service schema |
| `/case-studies` | `app/case-studies/page.tsx` | All case studies |
| `/case-studies/[slug]` | `app/case-studies/[slug]/page.tsx` | Individual case study page |
| `/about` | `app/about/page.tsx` | Founder bio (Portable Text), mission, team, trust signals |
| `/contact` | `app/contact/page.tsx` | LeadForm |
| `/studio` | `app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio (CMS editor) |
| `/sitemap.xml` | `app/sitemap.ts` | Auto-generated from all service + case study slugs |
| `/robots.txt` | `app/robots.ts` | Disallows /studio, references sitemap |

---

## Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `components/Header.tsx` | Nav (Services, Results, About, Contact) + "Book a Demo" CTA button |
| `Footer` | `components/Footer.tsx` | Company name, email, LinkedIn/Twitter links. No address or phone. |
| `Hero` | `components/Hero.tsx` | Full-screen hero. Badge from `tagline` field. Dual CTA: "Book a Demo" (Calendly) + "See Our Work" (scrolls to results). Grid overlay + glow blob bg. |
| `ServicesGrid` | `components/ServicesGrid.tsx` | "What We Build" section. Cards from Sanity services with emoji icon, title, description. |
| `TrustSignals` | `components/TrustSignals.tsx` | Stats bar. Values from `homePage.stats` (e.g. "50+ Automations Built"). |
| `ResultsGrid` | `components/ResultsGrid.tsx` | Case study cards. Shows `featured: true` docs. Industry tag, metric callouts (value in accent color), tags. Links to /case-studies/[slug]. |
| `ProcessSteps` | `components/ProcessSteps.tsx` | "How It Works" numbered steps. Horizontal on desktop with connector lines, vertical on mobile. |
| `LeadForm` | `components/LeadForm.tsx` | Contact/lead capture. Fields: name*, email*, company, need (textarea), budget (select). Newsletter checkbox calls /api/subscribe. On submit: POST to n8nLeadWebhookUrl from siteSettings. |
| `JsonLd` | `components/JsonLd.tsx` | Renders `<script type="application/ld+json">`. Supports Organization (layout), Service (service pages), WebSite types. |

---

## Sanity Schemas (7 types)

### `siteSettings` (singleton — `_id: "siteSettings"`)
Global site config. All fields editable from the Studio.

| Field | Type | Purpose |
|-------|------|---------|
| companyName | string | Business name (required) |
| email | string | Contact email (required) |
| tagline | string | Badge text above hero headline (e.g. "AI Automation Agency") |
| heroHeadline | string | Main H1 on home page (required) |
| heroSubheadline | string | Subtitle below H1 |
| brandPrimaryColor | string (hex) | Accent color — default `#00d4ff` |
| brandBgColor | string (hex) | Background — default `#0a0f1e` |
| brandSurfaceColor | string (hex) | Card bg — default `#111827` |
| calendlyUrl | url | "Book a Demo" button href |
| linkedinUrl | url | LinkedIn profile |
| twitterUrl | url | Twitter/X profile |
| siteUrl | url | Full live URL — used for SEO and JSON-LD |
| n8nLeadWebhookUrl | url | Webhook receiving lead form POSTs |
| googleBusinessUrl | url | Google Business Profile review link |
| metaTitle | string | Default `<title>` tag |
| metaDescription | text | Default meta description |
| ogImage | image | Open Graph / social share image (1200x630px) |

### `service`
| Field | Type | Notes |
|-------|------|-------|
| title | string | Required |
| slug | slug | Auto-generated from title |
| description | text | Short description for cards |
| icon | string | Emoji icon |
| featured | boolean | Show on home page |
| seoTitle | string | Override for `<title>` |
| seoDescription | text | Override for meta description |
| body | array (blocks) | Portable Text for full service page |

### `caseStudy`
| Field | Type | Notes |
|-------|------|-------|
| title | string | Required |
| slug | slug | Auto-generated |
| client | string | e.g. "Anonymous Retailer" |
| industry | string | e.g. "E-commerce" |
| challenge | text | The problem before working together |
| solution | text | What was built |
| results | array of `{metric, value}` | e.g. metric="Lead response time", value="4hr → 4min" |
| tags | string[] | e.g. ["AI Automation", "CRM"] |
| featured | boolean | Show on home page in ResultsGrid |
| publishedAt | date | |
| seoTitle / seoDescription | string / text | SEO overrides |
| body | array (blocks) | Full case study Portable Text |

### `processStep`
| Field | Type | Notes |
|-------|------|-------|
| stepNumber | number | Required, min 1 — controls order |
| title | string | Required |
| description | text | 2-3 sentences |
| icon | string | Emoji icon |

### `teamMember`
| Field | Type | Notes |
|-------|------|-------|
| name | string | Required |
| role | string | Required |
| bio | text | |
| photo | image | Hotspot-enabled |
| linkedinUrl | url | |
| order | number | Lower = displayed first. Default 99. |

### `homePage` (singleton — `_id: "homePage"`)
| Field | Type | Notes |
|-------|------|-------|
| featuredServices | reference[] → service | Up to 4, shown in ServicesGrid |
| featuredResults | reference[] → caseStudy | Up to 3, shown in ResultsGrid |
| processSteps | reference[] → processStep | Shown in ProcessSteps section |
| ctaHeadline | string | Bottom CTA section headline |
| ctaSubheadline | string | Bottom CTA section subtitle |
| stats | array of `{value, label}` | Trust bar stats |

### `aboutPage` (singleton — `_id: "aboutPage"`)
| Field | Type | Notes |
|-------|------|-------|
| headline | string | Required |
| missionStatement | text | |
| founderBio | array (blocks) | Portable Text rich text |
| body | array (blocks) | Additional content below bio |
| teamMembers | reference[] → teamMember | |
| trustSignals | string[] | e.g. "100+ Automations Built" |

---

## Environment Variables

### Required (local dev — `.env.local`)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=bml84tp5
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...          # Sanity API token with read+write access
NEXT_PUBLIC_COMPANY_NAME=Boxx Automations
NEXT_PUBLIC_SITE_URL=https://boxxautomations.space
```

### Optional (adds email signup feature)
```
RESEND_API_KEY=re_...            # Server-side only — never prefixed with NEXT_PUBLIC_
```

### Set on Vercel (production)
All of the above are set in Vercel project settings for the `agency-starter` project. Use `printf 'value' | npx vercel env add VAR_NAME production` to avoid trailing newline issues on Windows.

---

## API Routes

### `POST /api/subscribe`
Adds an email to a Resend Audience. Called by the newsletter checkbox in `LeadForm`.

Request body: `{ email: string, firstName?: string }`

- Uses `RESEND_API_KEY` (server-side — never exposed to client)
- Audience ID comes from the request body (passed from the form)
- Returns `200` on success, `400` on validation error, `500` on Resend API failure

---

## Seed System

### How it works
`scripts/seed.js` reads `sanity-seed-data.json` from project root and upserts all content into Sanity using `createOrReplace` with deterministic `_id` values. Safe to re-run — won't create duplicates.

### Run it
```bash
node scripts/seed.js
```

### Data file format
`sanity-seed-data.json` (gitignored — contains real token):
```json
{
  "projectId": "bml84tp5",
  "sanityToken": "sk...",
  "siteSettings": { "companyName": "...", "heroHeadline": "...", ... },
  "services": [{ "title": "...", "slug": "...", "description": "...", "icon": "🤖" }],
  "caseStudies": [{ "title": "...", "industry": "...", "results": [...], "featured": true }],
  "processSteps": [{ "stepNumber": 1, "title": "...", "description": "...", "icon": "📞" }],
  "teamMembers": [{ "name": "...", "role": "...", "bio": "...", "order": 1 }],
  "homePage": { "ctaHeadline": "...", "stats": [{ "value": "50+", "label": "Automations Built" }] },
  "aboutPage": { "headline": "...", "missionStatement": "...", "trustSignals": ["..."] }
}
```

`sanity-seed-data.example.json` (committed) — same structure, pre-filled with Boxx Automations content, with placeholder token.

---

## SEO

- `app/layout.tsx` — `generateMetadata()` pulls title, description, OG image from `siteSettings`
- `app/sitemap.ts` — auto-generates `/sitemap.xml` listing all service and case study slugs
- `app/robots.ts` — allows all crawlers, disallows `/studio/`, references sitemap
- Per-page metadata on `/services/[slug]` and `/case-studies/[slug]` with optional `seoTitle`/`seoDescription` overrides from Sanity
- JSON-LD `Organization` schema on every page via `JsonLd` component in layout
- JSON-LD `Service` schema on each service detail page

---

## Lead Form Flow

1. User fills out LeadForm at `/contact` (or any page that embeds it)
2. On submit: POST to `n8nLeadWebhookUrl` (from `siteSettings` in Sanity) with `{ name, email, company, need, budget, source }`
3. If newsletter checkbox checked: also POST to `/api/subscribe` → Resend Audiences API
4. n8n workflow (see `../../projects/ops/client-workflows/boxx_lead_nurture.md`) handles the rest:
   - Appends row to Google Sheet
   - Sends acknowledgement email to lead via Resend
   - Sends notification to Kaleel
   - If budget >= $5k: sends Calendly follow-up
   - After 3 days: sends follow-up #2

**Note:** n8n is currently local only. Lead form POSTs will succeed once n8n is deployed to n8n Cloud.

---

## Deploying a New Instance (for a client)

1. Copy `sanity-seed-data.example.json` → `sanity-seed-data.json`, fill in client data
2. Create a new Sanity project at sanity.io (free tier: up to 3 projects)
3. Update `.env.local` with new `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_TOKEN`
4. Run seed: `node scripts/seed.js`
5. Deploy to Vercel: `npx vercel deploy --prod --yes`
6. Set env vars on Vercel: `printf 'value' | npx vercel env add VAR_NAME production`
7. Add custom domain: `npx vercel domains add clientdomain.com`
8. Add DNS records at registrar (A: `76.76.21.21`, CNAME www: `cname.vercel-dns.com`)

Full SOP: `../../projects/ops/sops/premium_website_package_sop.md`

---

## File Structure

```
agency-starter/
  app/
    layout.tsx                    # Root layout — CSS vars from Sanity, JsonLd, Header/Footer
    page.tsx                      # Home page
    globals.css                   # CSS vars + Tailwind base + prose dark overrides
    about/page.tsx
    contact/page.tsx
    services/
      page.tsx
      [slug]/page.tsx             # Service detail + JSON-LD Service schema
    case-studies/
      page.tsx
      [slug]/page.tsx             # Case study detail
    api/
      subscribe/route.ts          # POST — adds email to Resend Audience
    sitemap.ts                    # Auto-generates /sitemap.xml
    robots.ts                     # /robots.txt
    studio/[[...tool]]/page.tsx   # Embedded Sanity Studio at /studio
  components/
    Header.tsx
    Footer.tsx
    Hero.tsx
    ServicesGrid.tsx
    TrustSignals.tsx
    ResultsGrid.tsx               # Case study cards with metric callouts
    ProcessSteps.tsx              # Numbered "How It Works" steps
    LeadForm.tsx                  # Lead capture form with newsletter checkbox
    JsonLd.tsx                    # JSON-LD structured data renderer
  sanity/
    client.ts                     # Sanity client config
    index.ts                      # Schema type registry
    schemaTypes/
      siteSettings.ts
      service.ts
      caseStudy.ts
      processStep.ts
      teamMember.ts
      homePage.ts
      aboutPage.ts
  scripts/
    seed.js                       # Seeds all 7 schema types from sanity-seed-data.json
  sanity-seed-data.example.json   # Example seed data (committed)
  sanity-seed-data.json           # Real seed data with credentials (gitignored)
  .env.local.example              # Example env vars (committed)
  .env.local                      # Real env vars (gitignored)
  sanity.config.ts                # Sanity Studio config
  tailwind.config.ts              # Tailwind + CSS var color mapping
  next.config.mjs                 # Next.js config (note: .mjs not .ts — Next 14 requirement)
  vercel.json                     # { "framework": "nextjs" } — required for Vercel detection
  package.json
```

---

## Known Gotchas

- **`next.config.mjs` not `.ts`** — Next.js 14.2.x doesn't support TypeScript config files. Must be `.mjs` with JSDoc type comment.
- **Vercel env vars on Windows** — Use `printf 'value' | npx vercel env add NAME production`. Do NOT use `<<<` heredoc (adds trailing `\r\n`, breaks Sanity projectId validation).
- **`vercel.json` is required** — Without it, Vercel doesn't auto-detect Next.js and throws "No Output Directory named public".
- **Sanity `__experimental_actions`** — Removed from Sanity v3 type definitions. Don't include it in schema files.
- **Resend API key** — Must NOT have `NEXT_PUBLIC_` prefix. Only accessible via the `/api/subscribe` server-side route.
- **n8n webhook** — The `n8nLeadWebhookUrl` in siteSettings is fine to set even before n8n is live. Form will fail gracefully, but Sanity Studio can store the URL in advance.
