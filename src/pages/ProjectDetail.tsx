import { Link, useParams } from "react-router-dom";
import { BehindRow } from "../components/Cards";
import { getBehindForProject, getProject, projects } from "../content";
import { categories, site } from "../content/site";
import { absoluteUrl, pageUrl, useSeo } from "../lib/seo";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const path = `/projects/${slug}`;
  const images = project
    ? [project.cover, ...(project.gallery ?? []).map((g) => g.src)].filter(Boolean)
    : [];
  useSeo({
    title: project?.title,
    description: project?.summary,
    image: project?.cover,
    path,
    type: "article",
    jsonLd: project && {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      alternateName: project.titleEn,
      description: project.summary,
      ...(images.length && { image: images.map((src) => absoluteUrl(src as string)) }),
      dateCreated: project.date,
      locationCreated: project.location,
      genre: categories[project.category],
      url: pageUrl(path),
      creator: { "@type": "Organization", name: site.brand, url: site.url },
    },
  });
  if (!project) return <NotFound />;

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const behind = getBehindForProject(project.slug);
  const facts = [
    ["분야", categories[project.category]],
    ["위치", project.location],
    ["면적", project.area],
    ["완공", String(project.year)],
    ["의뢰", project.client],
    ["범위", project.scope?.join(", ")],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <article className="page container">
      <header className="detail-head">
        <Link to="/projects" className="back-link">
          ‹ 프로젝트
        </Link>
        <p className="eyebrow">{project.titleEn ?? categories[project.category]}</p>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-sub">{project.summary}</p>
      </header>

      {project.cover && (
        <div className="detail-photo">
          <img src={project.cover} alt={project.title} />
        </div>
      )}

      <dl className="facts">
        {facts.map(([k, v]) => (
          <div key={k} className="fact">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="prose">
        {project.sections?.map((s, i) => (
          <section key={i} className="prose-section">
            {s.heading && <h2 className="prose-heading">{s.heading}</h2>}
            {s.body.split("\n").map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </section>
        ))}
      </div>

      {!!project.gallery?.length && (
        <div className="gallery">
          {project.gallery.map((img, i) => (
            <figure key={i} className={`gallery-item${img.wide ? " is-wide" : ""}`}>
              <img src={img.src} alt={img.caption ?? project.title} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      {!!project.credits?.length && (
        <p className="credits">
          {project.credits.map((c) => (
            <span key={c.role}>
              <span className="muted">{c.role}</span> {c.name}
            </span>
          ))}
        </p>
      )}

      {behind.length > 0 && (
        <section className="section">
          <h2 className="section-title section-gap">이 프로젝트의 비하인드</h2>
          <ul className="rows">
            {behind.map((post) => (
              <BehindRow key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      )}

      {next && next !== project && (
        <Link to={`/projects/${next.slug}`} className="next-card">
          <span className="next-label">다음 프로젝트</span>
          <span className="next-title">{next.title} ›</span>
        </Link>
      )}
    </article>
  );
};

export default ProjectDetail;
