import QRCode from 'qrcode'

export const metadata = {
  title: 'Scan for Your Free Audit',
  robots: { index: false, follow: false },
}

const AUDIT_URL = 'https://boxxautomations.space/audit'

export default async function AuditQrPage() {
  const svg = await QRCode.toString(AUDIT_URL, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#0a0f1e', light: '#ffffff' },
  })
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24, textAlign: 'center' }}>
      <h1 style={{ margin: 0 }}>Scan for your free audit</h1>
      <div
        role="img"
        aria-label="QR code linking to boxxautomations.space/audit"
        style={{ width: 'min(80vw, 420px)', background: '#fff', padding: 12, borderRadius: 12 }}
        dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ') }}
      />
      <p style={{ margin: 0 }}>boxxautomations.space/audit</p>
    </main>
  )
}
