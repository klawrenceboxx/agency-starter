import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
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
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', description: 'e.g. 🤖 or ⚡' }),
    defineField({ name: 'featured', title: 'Show on Home Page', type: 'boolean', initialValue: true }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (optional override)',
      type: 'string',
      description: 'Defaults to service title if blank',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (optional override)',
      type: 'text',
      rows: 2,
      description: 'Max 155 chars. Defaults to short description if blank.',
    }),
    defineField({
      name: 'body',
      title: 'Full Page Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed content shown on the individual service page',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
