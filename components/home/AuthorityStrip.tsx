import Link from 'next/link'

export default function AuthorityStrip() {
  return (
    <section className="authority">
      <div className="wrap">
        <div>
          <h2>Built with the same system I use for clients.</h2>
          <p>You&rsquo;re looking at it right now. This site was planned, written and built using my 10-phase conversion framework.</p>
          <div className="creds">
            <span>Mechanical engineering degree</span>
            <span>About 7 years coding</span>
            <span>Studies buyer behaviour</span>
            <span>Vaughan small business owner</span>
          </div>
        </div>
        <Link className="textlink" href="/how-it-works">See how this site was built &rarr;</Link>
      </div>
    </section>
  )
}
