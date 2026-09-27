import LeakSim from './LeakSim'

export default function ProblemSection() {
  return (
    <section>
      <div className="wrap">
        <div className="problem-head">
          <h2 className="h2">You got their attention. What happens next?</h2>
          <p className="lead">Ads, social media and networking events already cost you time and money. Most of those leads slip away at one of three points.</p>
        </div>
        <div className="leak">
          <div className="stage">
            <div className="node"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg></div>
            <div className="drip" aria-hidden="true"><i /><i /></div>
            <h3>Visit <span className="arrow">&rarr;</span> Leave</h3>
            <p>Your website doesn&rsquo;t give them enough reason to act.</p>
          </div>
          <div className="stage">
            <div className="node"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z" /></svg></div>
            <div className="drip" aria-hidden="true"><i /><i /></div>
            <h3>Inquire <span className="arrow">&rarr;</span> Wait</h3>
            <p>A warm lead gets colder while nobody follows up.</p>
          </div>
          <div className="stage">
            <div className="node"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg></div>
            <div className="drip" aria-hidden="true"><i /><i /></div>
            <h3>Not ready <span className="arrow">&rarr;</span> Forgotten</h3>
            <p>No follow-up means you&rsquo;re forgotten when they&rsquo;re finally ready to buy.</p>
          </div>
        </div>
        <LeakSim />
      </div>
    </section>
  )
}
