import { Link, useParams } from "react-router-dom";
import { BehindCard } from "../components/Cards";
import { getBehindForProject, getProject, projects } from "../content";
import { categories } from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  useDocumentTitle(project?.title);
  if (!project) return <NotFound />;

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const behind = getBehindForProject(project.slug);

  const facts = [
    ["Category", categories[project.category]],
    ["Location", project.location],
    ["Area", project.area],
    ["Year", String(project.year)],
    ["Client", project.client],
    ["Scope", project.scope?.join(", ")],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <article className="page">
      <header className="container detail-head">
        <Link to="/projects" className="text-link back-link">
          ← Projects
        </Link>
        <p className="eyebrow">{project.titleEn}</p>
        <h1 className="page-title">{project.title}</h1>
      </header>

      <div className="container">
        <div className="detail-cover media">
          <img src={project.cover} alt={project.title} />
        </div>
      </div>

      <div className="container detail-body">
        <dl className="facts">
          {facts.map(([k, v]) => (
            <div key={k} className="fact">
              <dt className="eyebrow">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="prose">
          <p className="lead">{project.summary}</p>
          {project.sections?.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="prose-heading">{s.heading}</h2>}
              {s.body.split("\n").map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </section>
          ))}
        </div>
      </div>

      {!!project.gallery?.length && (
        <div className="container gallery">
          {project.gallery.map((img, i) => (
            <figure key={i} className={`gallery-item${img.wide ? " is-wide" : ""}`}>
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
              <span className="eyebrow">{c.role}</span> {c.name}
            </p>
          ))}
        </div>
      )}

      {behind.length > 0 && (
        <section className="section container">
          <p className="eyebrow">Behind this project</p>
          <h2 className="section-title">이 프로젝트의 비하인드</h2>
          <div className="behind-grid">
            {behind.map((post) => (
              <BehindCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {next && next !== project && (
        <Link to={`/projects/${next.slug}`} className="next-project">
          <div className="container next-inner">
            <span className="eyebrow">Next Project</span>
            <span className="next-title">{next.title} →</span>
          </div>
        </Link>
      )}
    </article>
  );
};

export default ProjectDetail;
