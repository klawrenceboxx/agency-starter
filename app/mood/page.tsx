import type { Metadata } from 'next'
import Image from 'next/image'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import MoodPrompt from './MoodPrompt'
import AuditTrigger from '@/components/audit/AuditTrigger'
import MoodDownloads from './MoodDownloads'
import styles from './mood.module.css'

export const metadata: Metadata = {
  title: 'Mood to Motion — Free three-colour AI design skill',
  description: 'Create cinematic website designs with AI using a repeatable three-colour system. Download the free skill and standalone prompt.',
  alternates: { canonical: 'https://boxxautomations.space/mood' },
  openGraph: { title: 'The first two colours set the mood. The third tells the story.', url: 'https://boxxautomations.space/mood', images: ['/mood/asan.webp'] },
}

const examples = [
  { id: 'asan', name: 'ASAN', mood: 'Quiet → interstellar', colors: [['Space Navy', '#081525'], ['Soul Silver', '#DCE7F0'], ['Solar Orange', '#FF6A00']] },
  { id: 'verite', name: 'VÉRITÉ', mood: 'Sophisticated → electric', colors: [['Deep Teal', '#071C25'], ['French Rosé', '#F2A7C3'], ['Electric Lime', '#B8FF3C']] },
  { id: 'yamaha-r1', name: 'Yamaha R1', mood: 'Fast → electrifying', colors: [['Obsidian Black', '#050711'], ['Electric Blue', '#1648FF'], ['Ultraviolet', '#C13CFF']] },
]

export default function MoodPage() {
  const prompt = readFileSync(path.join(process.cwd(), 'public/mood/Mood_to_Motion_Standalone_Prompt.md'), 'utf8')
  return <div className={styles.page}>
    <section className={styles.hero}><div className="wrap">
      <p className={styles.label}>Mood to Motion · Free creative skill</p>
      <h1>The first two colours set the mood.<br /><span>The third tells the story.</span></h1>
      <p className={styles.intro}>Create cinematic website designs with AI using a repeatable three-colour system.</p>
      <a className={styles.cta} href="#get-skill">Get the Free Skill</a>
      <p className={styles.micro}>A reusable AI skill + a standalone prompt. Free to keep.</p>
      <a className={styles.reelLink} href="https://www.instagram.com/reel/Df3louINpt0/" target="_blank" rel="noopener noreferrer">Watch the three-colour reveal on Instagram</a>
    </div></section>
    <section className={styles.showcase} aria-label="Three website design examples"><div className="wrap">
      {examples.map(example => <figure id={example.id} key={example.id} className={styles.example}>
        <div className={styles.exampleTitle}><h2>{example.name}</h2><span>{example.mood}</span></div>
        <Image src={`/mood/${example.id}.webp`} alt={`${example.name} finished three-colour website design, captured from the original Reel`} width={692} height={390} sizes="(max-width: 768px) 94vw, 1160px" priority={example.id === 'asan'} className={styles.preview} />
        <figcaption className={styles.palette}>{example.colors.map(([name, hex], index) => <div key={hex}><i style={{ backgroundColor: hex }} /><span><small>{['Base', 'Secondary', 'Accent'][index]}</small><strong>{name}</strong><code>{hex}</code></span></div>)}</figcaption>
      </figure>)}
    </div></section>
    <section className={styles.how}><div className="wrap"><h2>Three colours. A repeatable process.</h2><ol>
      <li><b>Choose your mood</b><p>Pick a base and secondary colour. Decide how the design should feel.</p></li>
      <li><b>Build your design</b><p>Lock the subject, composition and typography before changing the colours.</p></li>
      <li><b>Reveal your accent</b><p>Add one deliberate colour through light, details and the main action.</p></li>
    </ol></div></section>
    <section id="get-skill" className={styles.download}><div className="wrap"><div className={styles.downloadInner}>
      <p className={styles.label}>Your next design starts here</p><h2>Get the free Mood to Motion skill.</h2>
      <p>Palette strategy, art direction, consistent phase prompts, a motion brief and a Reel script framework.</p>
      <MoodDownloads emailEnabled={Boolean(process.env.MOOD_DELIVERY_WEBHOOK_URL)} />
    </div></div></section>
    <section className={styles.use}><div className="wrap"><h2>Open your AI. Bring your idea.</h2>
      <div className={styles.instructions}><p><b>Using skills?</b> Unzip the download and add the <code>mood-to-motion</code> folder through your AI client’s skill installation settings. Installation support varies by client and workspace.</p><p><b>Using a regular chat?</b> Copy the standalone prompt below into Claude, ChatGPT or your preferred AI. Add your brand, audience and hero image.</p></div>
      <MoodPrompt text={prompt} />
      <p className={styles.exampleLinks}>Included examples: <a href="#asan">ASAN</a><a href="#verite">VÉRITÉ</a><a href="#yamaha-r1">Yamaha R1</a> · <a href="/mood/examples.md" download>Download example notes</a></p>
      <p className={styles.disclaimer}>Free creative workflow; results depend on your design execution and audience. Not a guarantee of engagement or conversions.</p>
      <div className={styles.audit}>Want help with your own website? <AuditTrigger>Get a free website audit</AuditTrigger></div>
    </div></section>
  </div>
}
