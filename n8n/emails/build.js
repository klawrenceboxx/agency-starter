// Generates the 5 nurture emails (HTML + plain text) from shared components.
// Run: node n8n/emails/build.js   ->  writes n8n/emails/dist/
// Variables are SendGrid dynamic-template (Handlebars) tags: {{first_name}} etc.
const fs = require('fs')
const path = require('path')

const C = {
  purple: '#9C16F4', dark: '#370857', tint: '#F6F2FB', line: '#E7DDF2',
  ink: '#14041F', muted: '#5B5566', white: '#FFFFFF',
}
const FONT = "Inter, Arial, Helvetica, sans-serif"

// ---------- components: each returns { html, text } ----------
const eyebrow = t => ({
  html: `<p style="margin:0 0 12px;font:700 12px/1 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.purple}">${t}</p>`,
  text: t.toUpperCase(),
})
const h1 = t => ({
  html: `<h1 style="margin:0 0 16px;font:800 30px/1.15 ${FONT};letter-spacing:-.02em;color:${C.ink}">${t}</h1>`,
  text: t + '\n' + '='.repeat(Math.min(t.length, 60)),
})
const h2 = t => ({
  html: `<h2 style="margin:28px 0 10px;font:700 18px/1.3 ${FONT};color:${C.ink}">${t}</h2>`,
  text: '\n' + t.toUpperCase(),
})
const p = t => ({
  html: `<p style="margin:0 0 16px;font:400 16px/1.6 ${FONT};color:${C.muted}">${t}</p>`,
  text: t.replace(/<[^>]+>/g, ''),
})
const small = t => ({
  html: `<p style="margin:12px 0 0;font:400 13px/1.5 ${FONT};color:${C.muted}">${t}</p>`,
  text: t.replace(/<[^>]+>/g, ''),
})
const button = (label, url) => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 8px"><tr><td>
<a class="btn" href="${url}" style="display:inline-block;background:${C.purple};color:${C.white};padding:16px 28px;border-radius:10px;font:600 16px/1 ${FONT};text-decoration:none">${label}</a>
</td></tr></table>`,
  text: `${label}: ${url}`,
})
const outlineButton = (label, url) => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 8px"><tr><td>
<a class="btn" href="${url}" style="display:inline-block;border:2px solid ${C.purple};color:${C.purple};padding:13px 24px;border-radius:10px;font:600 15px/1 ${FONT};text-decoration:none">${label}</a>
</td></tr></table>`,
  text: `${label}: ${url}`,
})
const list = items => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px">${items
    .map(i => `<tr><td width="24" valign="top" style="padding:0 0 10px;font:700 16px/1.5 ${FONT};color:${C.purple}">&bull;</td><td style="padding:0 0 10px;font:400 16px/1.5 ${FONT};color:${C.muted}">${i}</td></tr>`)
    .join('')}</table>`,
  text: items.map(i => '- ' + i.replace(/<[^>]+>/g, '')).join('\n'),
})
const steps = items => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px">${items
    .map((i, n) => `<tr><td width="36" valign="top" style="padding:0 0 12px"><div style="width:26px;height:26px;border-radius:13px;background:${C.purple};color:${C.white};font:700 13px/26px ${FONT};text-align:center">${n + 1}</div></td><td style="padding:2px 0 12px;font:400 16px/1.5 ${FONT};color:${C.muted}">${i}</td></tr>`)
    .join('')}</table>`,
  text: items.map((i, n) => `${n + 1}. ${i.replace(/<[^>]+>/g, '')}`).join('\n'),
})
const card = (title, inner) => ({
  html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 20px;background:${C.tint};border:1px solid ${C.line};border-radius:12px"><tr><td style="padding:20px 22px">
<p style="margin:0 0 10px;font:700 12px/1 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.purple}">${title}</p>
${inner.map(b => b.html).join('\n')}
</td></tr></table>`,
  text: `[${title}]\n` + inner.map(b => b.text).join('\n'),
})
const sign = () => ({
  html: `<p style="margin:24px 0 0;font:400 16px/1.6 ${FONT};color:${C.ink}">Kaleel Lawrence-Boxx<br><span style="color:${C.muted}">Founder, BOXX Automations</span></p>`,
  text: '\nKaleel Lawrence-Boxx\nFounder, BOXX Automations',
})
const cardP = t => ({ html: `<p style="margin:0 0 8px;font:400 15px/1.55 ${FONT};color:${C.ink}">${t}</p>`, text: t.replace(/<[^>]+>/g, '') })

// ---------- layout ----------
function layout({ subject, preheader, blocks }) {
  const body = blocks.map(b => b.html).join('\n')
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>{{subject}}</title>
<style>
@media only screen and (max-width:520px){
  .wrap{width:100%!important} .pad{padding:28px 20px!important}
  .btn{display:block!important;text-align:center!important}
  h1{font-size:26px!important}
}
</style></head>
<body style="margin:0;padding:0;background:${C.tint}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.tint}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${C.white};border:1px solid ${C.line};border-radius:16px;overflow:hidden">
<tr><td style="background:${C.dark};padding:20px 32px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td><div style="width:30px;height:30px;border-radius:8px;background:${C.purple};color:${C.white};font:800 16px/30px ${FONT};text-align:center">B</div></td>
    <td style="padding-left:10px;font:800 17px/1 ${FONT};color:${C.white}">BOXX</td>
    <td style="padding-left:14px;font:400 12px/1 ${FONT};color:#D6C6E8">Websites that convert. Emails that follow up.</td>
  </tr></table>
</td></tr>
<tr><td class="pad" style="padding:40px 32px 32px">
${body}
</td></tr>
<tr><td style="background:${C.tint};border-top:1px solid ${C.line};padding:24px 32px;font:400 12px/1.6 ${FONT};color:${C.muted}">
  <strong style="color:${C.ink}">BOXX Automations</strong> &middot; High-converting websites. Automated emails.<br>
  <a href="https://www.linkedin.com/in/klawrenceboxx" style="color:${C.purple}">LinkedIn</a> &middot; <a href="{{site_url}}" style="color:${C.purple}">boxxautomations.space</a><br><br>
  You are getting this because you asked for a free audit at {{site_url}}.<br>
  <a href="<%asm_group_unsubscribe_raw_url%>" style="color:${C.muted}">Unsubscribe</a> &middot; <a href="<%asm_preferences_raw_url%>" style="color:${C.muted}">Email preferences</a><br>
  {{mailing_address}}
</td></tr>
</table></td></tr></table></body></html>`
}

function plain({ blocks }) {
  return (
    blocks.map(b => b.text).join('\n\n') +
    '\n\n--\nBOXX Automations. High-converting websites. Automated emails.\n' +
    'You are getting this because you asked for a free audit at {{site_url}}.\n' +
    'Unsubscribe: <%asm_group_unsubscribe_raw_url%>\n{{mailing_address}}\n'
  )
}

// ---------- the sequence: Deliver > Teach > Demonstrate > Prove > Ask ----------
// Proof placeholders for later (never shipped as fact): [CLIENT RESULT] [CLIENT QUOTE] [CASE STUDY]
const emails = [
  {
    file: 'email-1-deliver',
    subject: 'Your BOXX Website Conversion Framework',
    preheader: 'Download it now. Here is what happens next.',
    blocks: [
      eyebrow('Your free audit starts here'),
      h1('Your Website Conversion Framework is ready'),
      p('Hi {{first_name}}, thanks for asking. This is the same checklist I use when I audit or build a site.'),
      button('Download the Framework (PDF)', '{{framework_url}}'),
      small('Opens a PDF. No sign-up needed.'),
      h2('What is inside'),
      list([
        '<strong>11 phases</strong>, from strategy to measuring results.',
        '<strong>77 checklist items.</strong> Each has a question to check your site and an action to fix it.',
        'You can start on {{website}} today.',
      ]),
      h2('What happens next'),
      steps([
        '<strong>Today:</strong> Download it and skim the phase titles.',
        '<strong>Soon:</strong> I will look at {{website}} myself and send you my recommendations: what I would fix first.',
        '<strong>Over 10 days:</strong> A few short emails with ideas you can use even if you never work with me.',
      ]),
      p('Nothing else to do right now. Just keep an eye on your inbox.'),
      sign(),
    ],
  },
  {
    file: 'email-2-teach',
    subject: 'Every page should ask for one thing',
    preheader: 'A 5-minute check you can do on your homepage.',
    blocks: [
      eyebrow('Idea 1 of 4'),
      h1('Every page should ask for one thing'),
      p('Most sites ask visitors to do five things at once: call, book, subscribe, follow, read the blog. When a page asks for everything, people do nothing.'),
      card('Try this in 5 minutes', [
        steps([
          'Open your homepage.',
          'Count every button and link that asks the visitor to act.',
          'Pick the one action that matters most to your business.',
          'Make that button the biggest and brightest. Quiet the rest.',
        ]),
      ]),
      p('This is Phase 7 of the framework (Conversion Mechanics). Do it before you change anything else. It costs nothing.'),
      p('Hit reply and tell me which action you picked. I read every reply.'),
      p('Not ready to change anything yet? That is fine. Keep the emails. The next one shows what this looks like.'),
      sign(),
    ],
  },
  {
    file: 'email-3-demonstrate',
    subject: 'What fixing a homepage looks like',
    preheader: 'A before and after example (not a client).',
    blocks: [
      eyebrow('Idea 2 of 4'),
      h1('What fixing a homepage looks like'),
      p('Here is a made-up example, so you can see the kind of change I mean. It is <strong>not a client</strong> and these are not results.'),
      card('Before', [
        cardP('<strong>Headline:</strong> "Welcome to our website. We offer quality dog services."'),
        cardP('<strong>Buttons:</strong> Call Us &middot; Get a Quote &middot; Subscribe &middot; Follow Us'),
      ]),
      card('After', [
        cardP('<strong>Headline:</strong> "Dog walking in Vaughan. Book your first walk in 60 seconds."'),
        cardP('<strong>Button:</strong> Book a Walk (everything else is quieter)'),
      ]),
      h2('What changed'),
      list([
        'The headline says who it is for and what they get.',
        'There is one clear action instead of four.',
        'A visitor can tell what happens after they click.',
      ]),
      p('This is the kind of fix I put in your recommendations: plain words, one goal, clear next step.'),
      outlineButton('See how I work', '{{site_url}}/how-it-works'),
      p('Not ready yet? Keep the emails. Two more are coming.'),
      sign(),
    ],
  },
  {
    file: 'email-4-prove',
    subject: 'The proof I can show you right now',
    preheader: 'No made-up results. Here is what I can show.',
    blocks: [
      eyebrow('Idea 3 of 4'),
      h1('The proof I can show you right now'),
      p('I do not have a client portfolio yet, and I will not invent results or quotes. Here is what I can show: the page you filled in and the emails you are reading were built with the same framework I sent you.'),
      card('Check it yourself', [
        list([
          'The site asks for one thing: your free audit.',
          'You got what I promised right away.',
          'Every email has one job.',
          'I told you what happens next before I asked for anything.',
        ]),
      ]),
      card('My guarantee', [
        cardP('Not happy with the website within 30 days of launch, or the email system within 90 days? You pick: a full refund, or I keep working at no extra cost until you are happy.'),
      ]),
      h2('Who is behind this'),
      p('I am Kaleel. I have a mechanical engineering degree from Toronto Metropolitan University, about 7 years of coding, and I run a small business myself.'),
      outlineButton('About me', '{{site_url}}/about'),
      p('Not ready yet? Keep the emails. One more idea is coming.'),
      sign(),
      // [CLIENT RESULT] [CLIENT QUOTE] [CASE STUDY]: add real ones here only when they exist.
    ],
  },
  {
    file: 'email-5-ask',
    subject: 'Straight answers before you decide',
    preheader: 'Price, time, and doing it yourself.',
    blocks: [
      eyebrow('Idea 4 of 4'),
      h1('Straight answers before you decide'),
      p('Here are the questions I hear most.'),
      h2('"What does it cost?"'),
      p('Your audit is free. If we work together, I price it after a call, based on what you need. It is a startup fee plus a fee tied to new customers I help you win. I will explain it on the call.'),
      h2('"How long does it take?"'),
      p('A standard project is about 5 weeks from kickoff to launch.'),
      h2('"Can I just do it myself?"'),
      p('Yes. The framework is yours. Many people use it on their own. If you get stuck, I am here.'),
      h2('"What if I am not happy?"'),
      p('See the guarantee in my last email. Full refund, or I keep working until you are happy.'),
      card('If you want to talk', [
        cardP('Book a short call. We will look at your audit together and you can ask anything.'),
        button('Book a 15-Minute Call', '{{calendly_url}}'),
      ]),
      p('Not ready yet? That is okay. This is the last email in this series. You can reply any time.'),
      sign(),
    ],
  },
]

// ---------- booked-call flow (no sales CTAs: these leads have left nurture) ----------
const bookingEmails = [
  {
    file: 'booking-confirm',
    subject: 'You are booked: your BOXX call',
    preheader: 'Your call is confirmed for {{call_time}}.',
    blocks: [
      eyebrow('Call confirmed'),
      h1('You are booked, {{first_name}}'),
      p('Your call is set for <strong>{{call_time}}</strong> (Eastern time).'),
      card('Before the call', [
        list([
          'Nothing to prepare.',
          'If you have a goal or a question in mind, jot it down.',
          'Need a different time? Use the reschedule link in your Calendly confirmation email.',
        ]),
      ]),
      p('Talk soon.'),
      sign(),
    ],
  },
  {
    file: 'booking-reminder-24h',
    subject: 'Reminder: your BOXX call is tomorrow',
    preheader: 'Your call is at {{call_time}}.',
    blocks: [
      eyebrow('Reminder'),
      h1('Your call is tomorrow'),
      p('Hi {{first_name}}, a quick reminder. Your call is at <strong>{{call_time}}</strong> (Eastern time).'),
      p('Need to change it? Use the reschedule link in your Calendly confirmation email.'),
      sign(),
    ],
  },
  {
    file: 'booking-reminder-day',
    subject: 'Your BOXX call is today',
    preheader: 'See you at {{call_time}}.',
    blocks: [
      eyebrow('Today'),
      h1('Your call is today'),
      p('Hi {{first_name}}, we are talking at <strong>{{call_time}}</strong> (Eastern time). Check your Calendly confirmation email for the meeting link.'),
      sign(),
    ],
  },
]

const out = path.join(__dirname, 'dist')
fs.mkdirSync(out, { recursive: true })
const manifest = {}
emails.forEach((e, i) => {
  fs.writeFileSync(path.join(out, e.file + '.html'), layout(e))
  fs.writeFileSync(path.join(out, e.file + '.txt'), plain(e))
  manifest[i + 1] = { file: e.file, subject: e.subject }
})
bookingEmails.forEach(e => {
  fs.writeFileSync(path.join(out, e.file + '.html'), layout(e))
  fs.writeFileSync(path.join(out, e.file + '.txt'), plain(e))
  manifest[e.file] = { file: e.file, subject: e.subject }
})
fs.writeFileSync(path.join(out, 'subjects.json'), JSON.stringify(manifest, null, 2))
console.log('Built', emails.length, 'emails ->', out)
