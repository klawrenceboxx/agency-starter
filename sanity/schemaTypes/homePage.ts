import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredServices',
      title: 'Featured Services (shown on home)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'featuredResults',
      title: 'Featured Case Studies (shown on home)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
      validation: (r) => r.max(3),
      description: 'Pick up to 3 case studies to feature on the home page',
    }),
    defineField({
      name: 'processSteps',
      title: 'How We Work (Process Steps)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'processStep' }] }],
      description: 'Steps shown in the "How It Works" section',
    }),
    defineField({ name: 'ctaHeadline', title: 'CTA Section Headline', type: 'string' }),
    defineField({ name: 'ctaSubheadline', title: 'CTA Section Subheadline', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Stats / Trust Numbers',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', type: 'string', title: 'Value', description: 'e.g. "50+"' },
          { name: 'label', type: 'string', title: 'Label', description: 'e.g. "Automations Built"' },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    }),
  ],
})
