import Image from "next/image";

const projects = [
  {
    name: "CamAutoPro",
    kind: "Client work",
    stack: "Shopify + Klaviyo",
    description:
      "An e-commerce website for professional GPR and PDR tools. I worked on the website and conversion experience, technical SEO, and automated email flows.",
    tags: ["Shopify", "Klaviyo email flows", "Technical SEO", "Conversion-focused design"],
    image: "/projects/camautopro-mockup.png",
    imageAlt:
      "CamAutoPro e-commerce website shown on desktop and mobile devices",
    url: "https://camautopro.com",
    tone: "red",
  },
  {
    name: "PosterGenius",
    kind: "Personal project",
    stack: "Next.js + e-commerce",
    description:
      "My own e-commerce business, designed and developed as a real-world implementation of the same conversion-first principles I use for client work.",
    tags: ["Next.js e-commerce", "Custom design", "Responsive", "Mobile optimized"],
    image: "/projects/postergenius-mockup.png",
    imageAlt:
      "PosterGenius e-commerce website shown on desktop and mobile devices",
    url: "https://postergenius.ca",
    tone: "purple",
  },
] as const;

export default function ProjectShowcase() {
  return (
    <section className="project-showcase" aria-labelledby="project-showcase-title">
      <div className="wrap">
        <div className="project-showcase__head">
          <span className="eyebrow">Real projects, real builds</span>
          <h2 className="h2" id="project-showcase-title">
            Websites that convert. Not just look good.
          </h2>
          <p className="lead">
            Real client and personal builds using the same conversion-first
            approach I use for every project.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article
              className={`project-card project-card--${project.tone}`}
              key={project.name}
            >
              <div className="project-card__meta">
                <span>{project.kind}</span>
                <span>{project.stack}</span>
              </div>

              <div className="project-card__visual">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  width={1670}
                  height={942}
                  sizes="(max-width: 860px) calc(100vw - 64px), 548px"
                />
              </div>

              <div className="project-card__body">
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <ul className="project-tags" aria-label={`${project.name} capabilities`}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <a
                  className="btn btn-primary project-card__link"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} live site (opens in a new tab)`}
                >
                  View Live Site <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
