import HomeHero from '@/components/home/HomeHero'
import AuthorityStrip from '@/components/home/AuthorityStrip'
import ProblemSection from '@/components/home/ProblemSection'
import ServicesCore from '@/components/ServicesCore'
import FaqGuarantee from '@/components/home/FaqGuarantee'
import ProcessStepsHome from '@/components/home/ProcessStepsHome'
import FinalCta from '@/components/home/FinalCta'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AuthorityStrip />
      <ProblemSection />
      <section className="tinted">
        <div className="wrap">
          <ServicesCore showHeader />
        </div>
      </section>
      <FaqGuarantee />
      <ProcessStepsHome />
      <FinalCta />
    </>
  )
}
