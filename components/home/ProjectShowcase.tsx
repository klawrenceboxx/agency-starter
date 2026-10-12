import Image from "next/image";

const projects = [
  {
    name: "CamAutoPro",
    kind: "Client work",
    stack: "Shopify + Klaviyo",
    description:
      "An e-commerce website for professional GPR and PDR tools.",
    tags: ["Shopify", "Klaviyo email flows", "Technical SEO"],
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
      "My own e-commerce website, built with the same conversion-first approach I use for clients.",
    tags: ["Next.js e-commerce", "Responsive", "Mobile optimized"],
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
            Websites That Convert
          </h2>
          <p className="lead">
            Real client and personal builds using the same conversion-first
            approach I use for every project.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              className={`project-card project-card--${project.tone}`}
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} live site (opens in a new tab)`}
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

                <span
                  className="btn btn-primary project-card__link"
                >
                  View Live Site <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
