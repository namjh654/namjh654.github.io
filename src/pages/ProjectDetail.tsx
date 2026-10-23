import { Link, useParams } from "react-router-dom";
import { BehindCard } from "../components/Cards";
import { getBehindForProject, getProject, projects } from "../content";
import { categories, site } from "../content/site";
import { absoluteUrl, pageUrl, useSeo } from "../lib/seo";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const path = `/projects/${slug}`;
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
      image: [project.cover, ...(project.gallery ?? []).map((g) => g.src)].map(absoluteUrl),
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
    <article className="page detail">
      <header className="container detail-head" data-reveal>
        <Link to="/projects" className="back-link">
          ← 프로젝트
        </Link>
        <p className="label">
          {project.titleEn ?? categories[project.category]}
        </p>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-lead">{project.summary}</p>
      </header>

      <div className="container-wide">
        <div className="detail-cover">
          <img src={project.cover} alt={project.title} />
        </div>
      </div>

      <div className="container">
        <dl className="facts" data-reveal>
          {facts.map(([k, v]) => (
            <div key={k} className="fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        {project.sections?.map((s, i) => (
          <section key={i} className="story" data-reveal>
            <h2 className="story-heading">{s.heading}</h2>
            <div className="story-body">
              {s.body.split("\n").map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {!!project.gallery?.length && (
        <div className="container-wide gallery">
          {project.gallery.map((img, i) => (
            <figure key={i} className={`gallery-item${img.wide ? " is-wide" : ""}`} data-reveal>
              <img src={img.src} alt={img.caption ?? project.title} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      {!!project.credits?.length && (
        <div className="container credits">
          {project.credits.map((c) => (
            <p key={c.role}>
              <span>{c.role}</span> {c.name}
            </p>
          ))}
        </div>
      )}

      {behind.length > 0 && (
        <section className="section container">
          <p className="label">Behind</p>
          <h2 className="section-title section-title-gap">이 프로젝트의 비하인드</h2>
          <div className="behind-grid">
            {behind.map((post, i) => (
              <BehindCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      {next && next !== project && (
        <Link to={`/projects/${next.slug}`} className="next-project">
          <img src={next.cover} alt="" loading="lazy" />
          <span className="next-shade" />
          <span className="container next-content">
            <span className="next-label">다음 프로젝트</span>
            <span className="next-title">{next.title}</span>
          </span>
        </Link>
      )}
    </article>
  );
};

export default ProjectDetail;
