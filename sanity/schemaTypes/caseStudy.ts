import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', title: 'Client Name', type: 'string', description: 'e.g. "Anonymous Retailer" or real name if approved' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string', description: 'e.g. E-commerce, Healthcare, Legal, Real Estate' }),
    defineField({ name: 'challenge', title: 'The Challenge', type: 'text', rows: 3, description: '2-3 sentences — the problem before working together' }),
    defineField({ name: 'solution', title: 'The Solution', type: 'text', rows: 3, description: 'What was built or implemented' }),
    defineField({
      name: 'results',
      title: 'Results / Metrics',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'metric', type: 'string', title: 'Metric', description: 'e.g. "Lead response time"' },
          { name: 'value', type: 'string', title: 'Value', description: 'e.g. "4hr → 4min" or "3x"' },
        ],
        preview: { select: { title: 'metric', subtitle: 'value' } },
      }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. AI Automation, CRM Integration, Website',
    }),
    defineField({ name: 'featured', title: 'Show on Home Page', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishedAt', title: 'Published Date', type: 'date' }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (optional override)',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (optional override)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'body',
      title: 'Full Case Study Body (optional)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'industry' },
  },
})
