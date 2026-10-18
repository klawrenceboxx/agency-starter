import Image from 'next/image'
import { CALENDLY_URL } from '@/lib/site-config'
import JourneyTimeline from './JourneyTimeline'
import { milestones } from './journey-data'
import styles from './about.module.css'

export const metadata = {
  title: 'About',
  description: 'Meet Kaleel Lawrence-Boxx, engineer, developer, and founder of BOXX Automations. Discover the journey behind a founder-led approach to websites and automated follow-ups.',
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <Image className={styles.heroImage} src="/about/founder-hero.png" alt="Kaleel Lawrence-Boxx in a purple-lit workspace, with his signature beside him" fill priority sizes="100vw" />
        <div className={`wrap ${styles.heroCopy}`}><p className={styles.eyebrow}>About BOXX Automations</p><h1 className="h1" id="about-title">About BOXX Automations</h1></div>
      </section>
      <section className={styles.journey} aria-labelledby="journey-title">
        <div className={`wrap ${styles.journeyIntro}`}><h2 className="h2" id="journey-title">The journey behind BOXX.</h2><p>I&rsquo;m Kaleel Lawrence-Boxx. Engineer, developer, and founder of BOXX Automations. Here&rsquo;s a little about the experiences that shaped how I think, work, and approach solving problems.</p></div>
        <JourneyTimeline milestones={milestones} />
      </section>
      <section className={styles.why} aria-labelledby="why-title">
        <div className={`wrap ${styles.editorial}`}>
          <div><p className={styles.eyebrow}>Why BOXX exists</p><h2 className="h2" id="why-title">More traffic isn&rsquo;t always the answer.</h2></div>
          <div className={styles.story}>
            <p>Businesses spend time, money, and effort attracting potential customers. But getting someone&rsquo;s attention is only half the job.</p>
            <p>When a website makes it difficult to take the next step, or a potential customer never receives a follow-up, valuable opportunities can slip away.</p>
            <p>My background in engineering taught me to approach problems systematically. My interest in human behaviour and psychology helped me understand that even the best technical solution needs to work for the people using it.</p>
            <p>That&rsquo;s why I built BOXX Automations: to bring those two perspectives together and help businesses make more of the opportunities they&rsquo;re already generating.</p>
          </div>
        </div>
      </section>
      <section className={styles.finalCta} aria-labelledby="about-cta-title">
        <div className="wrap"><h2 className="h2" id="about-cta-title">Let&rsquo;s make more of the opportunities you&rsquo;ve already earned.</h2><p>Whether you&rsquo;re looking to improve your website, automate your follow-ups, or explore what&rsquo;s possible, I&rsquo;d be happy to learn more about your business.</p><a className={`btn btn-primary ${styles.call}`} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Free Strategy Call</a></div>
      </section>
    </div>
  )
}
