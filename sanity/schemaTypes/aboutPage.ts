import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'missionStatement', title: 'Mission Statement', type: 'text', rows: 3 }),
    defineField({
      name: 'founderBio',
      title: 'Founder Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text bio of the founder / team',
    }),
    defineField({
      name: 'body',
      title: 'About Page Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Additional content below the founder bio',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),
    defineField({
      name: 'trustSignals',
      title: 'Trust Signals / Credentials',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Anthropic Certified", "100+ Automations Built", "Remote-first team"',
    }),
  ],
})
