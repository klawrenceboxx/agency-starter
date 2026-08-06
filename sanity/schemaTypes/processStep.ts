import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'processStep',
  title: 'Process Step',
  type: 'document',
  fields: [
    defineField({ name: 'stepNumber', title: 'Step Number', type: 'number', validation: (r) => r.required().min(1) }),
    defineField({ name: 'title', title: 'Step Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, description: '2-3 sentences explaining what happens in this step' }),
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', description: 'e.g. 📞 🔧 🚀' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'stepNumber' },
    prepare({ title, subtitle }) {
      return { title: `Step ${subtitle}: ${title}` }
    },
  },
  orderings: [
    { title: 'Step Number', name: 'stepNumberAsc', by: [{ field: 'stepNumber', direction: 'asc' }] },
  ],
})
