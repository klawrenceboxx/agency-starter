import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first', initialValue: 99 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
