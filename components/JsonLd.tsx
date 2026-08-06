type Props = {
  type: 'Organization' | 'WebSite' | 'Service'
  data: Record<string, unknown>
}

export default function JsonLd({ type, data }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
