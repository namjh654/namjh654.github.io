import { Link, useParams } from "react-router-dom";
import { PostRow, StageBadge, Tags, originLabel } from "../components/Cards";
import { getCompany, getPostsForProject, getProject, projects, tenure } from "../content";
import { site } from "../content/site";
import { absoluteUrl, pageUrl, useSeo } from "../lib/seo";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const path = `/projects/${slug}`;
  const images = project
    ? Array.from(
        new Set(
          [project.cover, ...(project.screenshots ?? []).map((s) => s.src), ...(project.gallery ?? []).map((g) => g.src)]
        )
      ).filter(Boolean)
    : [];
  useSeo({
    title: project?.title,
    description: project?.summary,
    image: project?.cover,
    path,
    type: "article",
    jsonLd: project && {
      "@context": "https://schema.org",
      "@type": project.kind === "game" ? "VideoGame" : "SoftwareApplication",
      name: project.title,
      alternateName: project.titleEn,
      description: project.summary,
      applicationCategory: project.kind === "game" ? "GameApplication" : "WebApplication",
      operatingSystem: project.platforms.join(", "),
      ...(images.length && { image: images.map((src) => absoluteUrl(src as string)) }),
      ...(project.links?.live && { url: project.links.live }),
      ...(project.kind === "career"
        ? {
            contributor: { "@type": "Person", name: site.brandKo, url: site.url },
            ...(getCompany(project.company) && {
              publisher: { "@type": "Organization", name: getCompany(project.company)?.name },
            }),
          }
        : { author: { "@type": "Person", name: site.brandKo, url: site.url } }),
      mainEntityOfPage: pageUrl(path),
    },
  });
  if (!project) return <NotFound />;

  const list = projects.filter((p) => p.kind === project.kind);
  const next = list[(list.indexOf(project) + 1) % list.length];
  const related = getPostsForProject(project.slug);
  const company = getCompany(project.company);
  const back =
    project.kind === "career" ? ["/career", "커리어"] : project.kind === "game" ? ["/games", "게임"] : ["/projects", "프로젝트"];
  const span = tenure(project.period);
  const facts = [
    ["기간", project.period && (span ? `${project.period} (${span})` : project.period)],
    ["역할", project.role],
    ["운영", project.operator],
    ["저장소", project.links?.github ? "공개" : project.privateRepo ? "비공개 저장소" : undefined],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <article className="page container">
      <header className="detail-head">
        <Link to={back[0]} className="back-link">
          ‹ {back[1]}
        </Link>
        <div className="card-top">
          <span className={`card-kind${project.kind === "career" ? " is-career" : ""}`}>{originLabel(project)}</span>
          {project.titleEn && <span className="eyebrow">{project.titleEn}</span>}
          <StageBadge stage={project.stage} />
        </div>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-sub">{project.summary}</p>
        {(project.links?.live || project.links?.store || project.links?.github) && (
          <div className="link-row">
            {project.links.live && (
              <a href={project.links.live} className="btn" target="_blank" rel="noreferrer">
                서비스 보기 ↗
              </a>
            )}
            {project.links.store && (
              <a href={project.links.store} className="btn" target="_blank" rel="noreferrer">
                스토어에서 보기 ↗
              </a>
            )}
            {project.links.github && (
              <a href={project.links.github} className="btn btn-secondary" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            )}
          </div>
        )}
      </header>

      {project.screenshots?.length ? (
        <div
          className={`shots shots-${project.screenshots.length > 1 ? "multi" : "single"}${
            project.screenshots.filter((s) => s.device !== "mobile").length > 1 ? " shots-many" : ""
          }`}
        >
          {project.screenshots.map((shot, i) =>
            shot.device === "mobile" ? (
              <figure key={i} className="shot shot-mobile">
                <div className="phone">
                  <img src={shot.src} alt={shot.caption ?? `${project.title} 모바일 화면`} loading="lazy" />
                </div>
                {shot.caption && <figcaption>{shot.caption}</figcaption>}
              </figure>
            ) : (
              <figure key={i} className="shot shot-desktop">
                <div className="browser">
                  <div className="browser-bar" aria-hidden>
                    <span />
                    <span />
                    <span />
                    {project.links?.live && <em>{project.links.live.replace(/^https?:\/\//, "")}</em>}
                  </div>
                  <img src={shot.src} alt={shot.caption ?? `${project.title} 화면`} loading="lazy" />
                </div>
                {shot.caption && <figcaption>{shot.caption}</figcaption>}
              </figure>
            )
          )}
        </div>
      ) : (
        project.cover && (
          <div className="detail-photo">
            <img src={project.cover} alt={project.title} />
          </div>
        )
      )}

      {!!project.metrics?.length && (
        <dl className="metrics">
          {project.metrics.map((m) => (
            <div key={m.label} className="metric">
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="spec">
        {facts.map(([k, v]) => (
          <div key={k} className="spec-row">
            <span className="spec-key">{k}</span>
            <span className="spec-value">{v}</span>
          </div>
        ))}
        {company && (
          <div className="spec-row">
            <span className="spec-key">회사</span>
            <Link to="/career" className="spec-value spec-link">
              {company.name}
              {company.period && ` · ${company.period}`} ›
            </Link>
          </div>
        )}
        <div className="spec-row">
          <span className="spec-key">플랫폼</span>
          <Tags items={project.platforms} tone="blue" />
        </div>
        <div className="spec-row">
          <span className="spec-key">기술</span>
          <Tags items={project.stack} />
        </div>
      </div>

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

      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title section-gap">관련 글</h2>
          <ul className="rows">
            {related.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      )}

      {next && next !== project && (
        <Link to={`/projects/${next.slug}`} className="next-card">
          <span className="next-label">다음 {next.kind === "game" ? "게임" : "프로젝트"}</span>
          <span className="next-title">{next.title} ›</span>
        </Link>
      )}
    </article>
  );
};

export default ProjectDetail;
