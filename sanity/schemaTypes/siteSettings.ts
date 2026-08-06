import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'companyName', title: 'Company Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Contact Email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'Short badge text above the hero headline (e.g. "AI Automation Agency")' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'heroSubheadline', title: 'Hero Subheadline', type: 'string' }),
    defineField({
      name: 'brandPrimaryColor',
      title: 'Brand Primary Color (hex)',
      type: 'string',
      initialValue: '#00d4ff',
      description: 'e.g. #00d4ff — used for accent text, borders, and highlights',
    }),
    defineField({
      name: 'brandBgColor',
      title: 'Background Color (hex)',
      type: 'string',
      initialValue: '#0a0f1e',
      description: 'e.g. #0a0f1e — main dark background',
    }),
    defineField({
      name: 'brandSurfaceColor',
      title: 'Surface Color (hex)',
      type: 'string',
      initialValue: '#111827',
      description: 'e.g. #111827 — card and section backgrounds',
    }),
    defineField({ name: 'calendlyUrl', title: 'Calendly URL', type: 'url', description: 'Book a Demo link (Calendly or any booking page)' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'twitterUrl', title: 'Twitter / X URL', type: 'url' }),
    defineField({ name: 'siteUrl', title: 'Site URL', type: 'url', description: 'Full URL of the live site (e.g. https://boxxautomations.com) — used for SEO and JSON-LD' }),
    defineField({ name: 'n8nLeadWebhookUrl', title: 'Lead Form Webhook URL', type: 'url', description: 'n8n webhook that receives lead form submissions' }),
    defineField({ name: 'googleBusinessUrl', title: 'Google Business URL', type: 'url', description: 'Google Business Profile review link' }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage', title: 'OG / Social Share Image', type: 'image', description: 'Used as the default Open Graph image for social sharing (1200x630px recommended)' }),
  ],
})
