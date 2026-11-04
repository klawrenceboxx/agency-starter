import Link from "next/link";
import { PRESS } from "@/lib/press";

export default function FeaturedIn() {
  return (
    <section className="featured-in" aria-labelledby="featured-in-title">
      <div className="wrap">
        <span className="eyebrow" id="featured-in-title">
          Featured in
        </span>
        <ul className="featured-in__list">
          {PRESS.map((f) => (
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
        <Link className="textlink" href="/press">
          All press
        </Link>
      </div>
    </section>
  );
}
