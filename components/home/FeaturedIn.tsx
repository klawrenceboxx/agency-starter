// Real press only. Add new features to the top of this list.
const features = [
  {
    outlet: "PSEEDR",
    title: "Which Part of Your Internal AI Tool Should You Still Own?",
    url: "https://pseedr.com/enterprise/which-part-of-your-internal-ai-tool-should-you-still-own",
  },
] as const;

export default function FeaturedIn() {
  return (
    <section className="featured-in" aria-labelledby="featured-in-title">
      <div className="wrap">
        <span className="eyebrow" id="featured-in-title">
          Featured in
        </span>
        <ul className="featured-in__list">
          {features.map((f) => (
            <li key={f.url}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${f.outlet}: ${f.title} (opens in a new tab)`}
              >
                <strong>{f.outlet}</strong>
                <span>{f.title} &rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
