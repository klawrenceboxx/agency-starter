// Builds the print-friendly PDF for a guide from content/guides/<slug>.json.
// Run: node scripts/build-guide-pdf.js networking-follow-up
// Needs Playwright with Chromium (npx playwright install chromium). Output: public/guides/pdf/<slug>.pdf
const fs = require('fs')
const path = require('path')

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/build-guide-pdf.js <slug>')
  process.exit(1)
}
const root = path.join(__dirname, '..')
const g = JSON.parse(fs.readFileSync(path.join(root, 'content/guides', `${slug}.json`), 'utf8'))
const SITE = 'https://boxxautomations.space'
const pageUrl = `${SITE}/guides/${g.slug}`
const tags = (channel, content) => `resource=${g.guide_number}&channel=${channel}&utm_source=guide-pdf&utm_medium=pdf&utm_campaign=${g.slug}&utm_content=${content}`
const auditUrl = `${SITE}/audit?${tags('pdf-cta', 'audit-button')}`

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const brackets = (s) => esc(s).replace(/(\[[^\]]+\])/g, '<mark>$1</mark>')
const builtWith = g.tools.filter((t) => t.used_in_video).slice(0, 2).map((t) => t.name.replace(/\s*\(.*\)\s*/, '').toUpperCase()).join(' + ')
const notes = (g.build_notes || '').split('\n').map((s) => s.trim()).filter(Boolean)
const monoFace = process.env.GUIDE_MONO_FONT
  ? `@font-face { font-family: 'JetBrains Mono'; src: url('file://${process.env.GUIDE_MONO_FONT}'); }`
  : ''

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(g.title)}</title>
<style>
${monoFace}
@page { size: Letter; margin: 0.6in 0.65in 0.7in; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, Arial, Helvetica, sans-serif; color: #14041f; font-size: 11pt; line-height: 1.5; }
.mono, .eyebrow, pre, .num, .label, code { font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; }
.cover { height: 9.4in; display: flex; flex-direction: column; justify-content: space-between; padding: 0.5in 0.45in; border-radius: 16px; color: #fff;
  background: radial-gradient(70% 60% at 15% 0%, rgba(156,22,244,.55), transparent 70%), #10071b; break-after: page; }
.brand { font-weight: 800; letter-spacing: .06em; font-size: 12pt; }
.eyebrow { font-size: 9pt; font-weight: 700; letter-spacing: .14em; color: #d3a0ff; margin: 0 0 14px; }
h1 { font-size: 40pt; line-height: 1.03; letter-spacing: -.03em; margin: 0; font-weight: 800; }
h1 .dot, .hl { color: #9c16f4; }
.cover .promise { font-size: 15pt; color: #d6c6e8; max-width: 30em; margin: 20px 0 0; }
.cover .foot { font-size: 10pt; color: #d6c6e8; }
.cover .foot b { color: #fff; }
h2 { font-size: 18pt; letter-spacing: -.02em; margin: 0 0 10px; font-weight: 800; }
h3 { font-size: 14pt; margin: 0; font-weight: 700; }
section { margin: 0 0 26px; }
.muted { color: #5b5566; }
.tools { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.tool { border: 1px solid #e7ddf2; border-radius: 12px; padding: 12px; break-inside: avoid; }
.label { font-size: 8pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #7a10c4; }
.tool b { display: block; margin: 6px 0 4px; }
.tool p { margin: 0; font-size: 9.5pt; color: #5b5566; }
ul.inputs { list-style: none; padding: 0; margin: 10px 0 0; }
ul.inputs li { padding: 7px 0; border-bottom: 1px solid #e7ddf2; }
code, mark { background: #f1e3ff; color: #5a0a92; border-radius: 3px; padding: 0 3px; font-size: .92em; }
.step { break-before: page; }
.stephead { display: flex; gap: 14px; align-items: center; margin-bottom: 14px; }
.num { width: 44px; height: 44px; border-radius: 50%; border: 3px solid #9c16f4; display: grid; place-items: center; font-weight: 700; font-size: 13pt; flex-shrink: 0; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; margin: 0; font-size: 9.5pt; line-height: 1.6; background: #faf7fd; border: 1px solid #e7ddf2; border-radius: 12px; padding: 14px 16px; }
.pbar { display: flex; justify-content: space-between; font-size: 8pt; letter-spacing: .12em; text-transform: uppercase; color: #5b5566; margin: 0 0 6px; }
.check { margin: 12px 0 0; padding: 10px 14px; border-radius: 10px; background: #e9f8f1; border: 1px solid #a8e2c8; break-inside: avoid; }
.check b { color: #1fa971; }
.notes { padding-left: 18px; margin: 8px 0 0; }
.notes li { margin: 0 0 6px; }
.end { break-inside: avoid; margin-top: 24px; border-radius: 16px; background: #370857; color: #fff; padding: 28px 30px; }
.end p { color: #d6c6e8; margin: 8px 0 16px; }
.btn { display: inline-block; background: #9c16f4; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 10px; }
a { color: #7a10c4; }
.small { font-size: 9pt; color: #5b5566; margin-top: 18px; }
</style></head><body>

<div class="cover">
  <div class="brand">BOXX AUTOMATIONS</div>
  <div>
    <p class="eyebrow">FREE GUIDE ${esc(g.guide_number)} · ${g.steps.length} PROMPTS · BUILT WITH ${esc(builtWith)}</p>
    <h1>${esc(g.title)}<span class="dot">.</span></h1>
    <p class="promise">${esc(g.promise)} Copy each prompt into Claude and it builds the system with you.</p>
  </div>
  <div class="foot">Online version with copy buttons: <b>${esc(pageUrl.replace('https://', ''))}</b></div>
</div>

<section>
  <h2>What you'll need</h2>
  <div class="tools">
    ${g.tools.map((t) => `<div class="tool"><span class="label">${esc(t.job)}</span><b>${esc(t.name)}</b><p>${esc(t.role)}</p>${t.alternatives.length ? `<p>Or: ${esc(t.alternatives.join(', '))}</p>` : ''}</div>`).join('')}
  </div>
</section>

<section>
  <h2>Before you start</h2>
  <p class="muted">Replace every <code>[BRACKET]</code> in Prompt 1 with your own details before you paste it. Leave one blank and Claude will ask you for it.</p>
  <ul class="inputs">
    ${g.inputs_needed.map((s) => { const m = s.match(/^(\[[^\]]+\])\s*(?:\((?:e\.g\.\s*)?(.*)\))?$/); return `<li><code>${esc(m ? m[1] : s)}</code>${m && m[2] ? ` <span class="muted">e.g. ${esc(m[2])}</span>` : ''}</li>` }).join('')}
  </ul>
</section>

<section>
  <h2>How to use this</h2>
  <p class="muted">Open the Claude app, start a new chat, and paste the prompts in order, one per message. After each one, check the "You'll know it worked" line before moving on.</p>
</section>

${g.steps.map((s) => `
<section class="step">
  <div class="stephead"><div class="num">${esc(s.number)}</div><div><span class="label">${esc(s.phase)}</span><h3>${esc(s.title)}</h3></div></div>
  <div class="pbar"><span>Prompt ${Number(s.number)}</span><span>Copy everything in the box</span></div>
  <pre>${brackets(s.prompt)}</pre>
  <p class="check"><b>✓</b> ${esc(s.check)}</p>
</section>`).join('')}

${notes.length ? `<section><h2>Build notes</h2><p class="muted">What I learned testing this on my own phone.</p><ul class="notes">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}

<div class="end">
  <h2>Don't want to build it yourself?</h2>
  <p>I'll set it up for your business. Start with a free audit and I'll show you where your leads are slipping through.</p>
  <a class="btn" href="${esc(auditUrl)}">Get Your Free Audit</a>
  <p class="small" style="color:#d6c6e8">BOXX Automations · Vaughan, Ontario · <a style="color:#d3a0ff" href="${SITE}/guides?${tags('pdf', 'more-guides')}">More free guides</a></p>
</div>
</body></html>`

;(async () => {
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'load' })
  const out = path.join(root, 'public/guides/pdf', `${g.slug}.pdf`)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  await page.pdf({
    path: out,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font:8px Inter,Arial;color:#8a8194;padding:0 0.65in;display:flex;justify-content:space-between"><span>BOXX · ${esc(g.title)}</span><span class="pageNumber"></span></div>`,
  })
  await browser.close()
  console.log('Wrote', path.relative(root, out))
})()
