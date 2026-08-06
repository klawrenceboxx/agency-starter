/**
 * seed.js — Seed Sanity with data from sanity-seed-data.json
 *
 * Run: node scripts/seed.js
 *
 * Expects sanity-seed-data.json in project root.
 * Uses createOrReplace with deterministic _id values — safe to re-run.
 */

const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// ── Load seed data ────────────────────────────────────────────────────────────

const seedPath = path.join(__dirname, '..', 'sanity-seed-data.json')

if (!fs.existsSync(seedPath)) {
  console.error('[ERR] sanity-seed-data.json not found at:', seedPath)
  console.error('      Create this file or copy from sanity-seed-data.example.json.')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))

const client = createClient({
  projectId: data.projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: data.sanityToken,
  useCdn: false,
})

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\nSeeding Sanity project:', data.projectId)
  console.log('─'.repeat(50))

  // 1. Services
  const serviceIds = []
  for (const svc of (data.services || [])) {
    const slug = svc.slug || svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const id = `service-${slug}`
    await client.createOrReplace({
      _id: id,
      _type: 'service',
      title: svc.title,
      slug: { _type: 'slug', current: slug },
      description: svc.description || '',
      icon: svc.icon || '⚡',
      featured: svc.featured !== false,
    })
    serviceIds.push(id)
    console.log(`  [OK] service: ${svc.title}`)
  }

  // 2. Case Studies
  const caseStudyIds = []
  for (const cs of (data.caseStudies || [])) {
    const slug = cs.slug || cs.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const id = `case-study-${slug}`
    await client.createOrReplace({
      _id: id,
      _type: 'caseStudy',
      title: cs.title,
      slug: { _type: 'slug', current: slug },
      client: cs.client || 'Anonymous Client',
      industry: cs.industry || '',
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      results: (cs.results || []).map((r, i) => ({ ...r, _key: `result-${i}` })),
      tags: cs.tags || [],
      featured: cs.featured === true,
      publishedAt: cs.publishedAt || null,
    })
    if (cs.featured) caseStudyIds.push(id)
    console.log(`  [OK] caseStudy: ${cs.title}`)
  }

  // 3. Process Steps
  const processStepIds = []
  for (const step of (data.processSteps || [])) {
    const id = `process-step-${step.stepNumber}`
    await client.createOrReplace({
      _id: id,
      _type: 'processStep',
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description || '',
      icon: step.icon || String(step.stepNumber),
    })
    processStepIds.push(id)
    console.log(`  [OK] processStep ${step.stepNumber}: ${step.title}`)
  }

  // 4. Team Members
  for (const member of (data.teamMembers || [])) {
    const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const id = `team-member-${slug}`
    await client.createOrReplace({
      _id: id,
      _type: 'teamMember',
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      linkedinUrl: member.linkedinUrl || null,
      order: member.order || 99,
    })
    console.log(`  [OK] teamMember: ${member.name}`)
  }

  // 5. siteSettings singleton
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    companyName: data.siteSettings?.companyName || '',
    email: data.siteSettings?.email || '',
    tagline: data.siteSettings?.tagline || '',
    heroHeadline: data.siteSettings?.heroHeadline || '',
    heroSubheadline: data.siteSettings?.heroSubheadline || '',
    brandPrimaryColor: data.siteSettings?.brandPrimaryColor || '#00d4ff',
    brandBgColor: data.siteSettings?.brandBgColor || '#0a0f1e',
    brandSurfaceColor: data.siteSettings?.brandSurfaceColor || '#111827',
    calendlyUrl: data.siteSettings?.calendlyUrl || null,
    linkedinUrl: data.siteSettings?.linkedinUrl || null,
    twitterUrl: data.siteSettings?.twitterUrl || null,
    siteUrl: data.siteSettings?.siteUrl || null,
    n8nLeadWebhookUrl: data.siteSettings?.n8nLeadWebhookUrl || null,
    googleBusinessUrl: data.siteSettings?.googleBusinessUrl || null,
    metaTitle: data.siteSettings?.metaTitle || '',
    metaDescription: data.siteSettings?.metaDescription || '',
  })
  console.log('  [OK] siteSettings')

  // 6. aboutPage singleton
  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    headline: data.aboutPage?.headline || '',
    missionStatement: data.aboutPage?.missionStatement || '',
    founderBio: data.aboutPage?.founderBio || [],
    body: data.aboutPage?.body || [],
    trustSignals: data.aboutPage?.trustSignals || [],
  })
  console.log('  [OK] aboutPage')

  // 7. homePage singleton
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    featuredServices: serviceIds.map((id, i) => ({
      _type: 'reference',
      _ref: id,
      _key: `svc-ref-${i}`,
    })),
    featuredResults: caseStudyIds.map((id, i) => ({
      _type: 'reference',
      _ref: id,
      _key: `cs-ref-${i}`,
    })),
    processSteps: processStepIds.map((id, i) => ({
      _type: 'reference',
      _ref: id,
      _key: `step-ref-${i}`,
    })),
    ctaHeadline: data.homePage?.ctaHeadline || '',
    ctaSubheadline: data.homePage?.ctaSubheadline || '',
    stats: (data.homePage?.stats || []).map((s, i) => ({ ...s, _key: `stat-${i}` })),
  })
  console.log('  [OK] homePage')

  console.log('\n✅ Seed complete.')
  console.log(`   Studio: https://${data.projectId}.sanity.studio`)
  console.log('   Run `npm run dev` to preview the site.\n')
}

seed().catch((err) => {
  console.error('\n[ERR] Seed failed:', err.message)
  process.exit(1)
})
