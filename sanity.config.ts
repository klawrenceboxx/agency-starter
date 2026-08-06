import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/index'

export default defineConfig({
  name: 'default',
  title: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Agency Site',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site Settings').id('siteSettings').child(
              S.document().schemaType('siteSettings').documentId('siteSettings')
            ),
            S.listItem().title('Home Page').id('homePage').child(
              S.document().schemaType('homePage').documentId('homePage')
            ),
            S.listItem().title('About Page').id('aboutPage').child(
              S.document().schemaType('aboutPage').documentId('aboutPage')
            ),
            S.divider(),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('caseStudy').title('Case Studies'),
            S.documentTypeListItem('processStep').title('Process Steps'),
            S.documentTypeListItem('teamMember').title('Team Members'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
