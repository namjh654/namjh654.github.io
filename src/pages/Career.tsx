import { Link } from "react-router-dom";
import { companies, getProject, tenure } from "../content";
import { personLd, useSeo } from "../lib/seo";

const Career = () => {
  useSeo({
    title: "커리어",
    description: `재직 회사와 회사에서 만든 프로젝트: ${companies
      .map((c) => `${c.name}(${c.projects.map((p) => p.name).join(", ")})`)
      .join(" · ")}`,
    path: "/career",
    jsonLd: personLd,
  });

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Career</p>
        <h1 className="page-title">커리어</h1>
        <p className="page-sub">회사에 재직하며 만든 프로젝트를 시간순으로 정리했습니다. 프로젝트를 누르면 세부 내용으로 이동합니다.</p>
      </header>

      <ol className="timeline">
        {companies.map((c) => (
          <li key={c.key} className="timeline-item">
            <div className="timeline-head">
              <h2 className="timeline-title">{c.name}</h2>
              {c.period && (
                <span className="timeline-period">
                  {c.period}
                  {tenure(c.period) && ` · ${tenure(c.period)}`}
                </span>
              )}
            </div>
            {c.role && <p className="timeline-role">{c.role}</p>}
            {c.summary && <p className="timeline-text">{c.summary}</p>}
            <ul className="job-projects">
              {c.projects.map((p) => (
                <li key={p.name} className="job-card">
                  {p.slug && getProject(p.slug) ? (
                    <Link to={`/projects/${p.slug}`} className="job-name">
                      {p.name} ›
                    </Link>
                  ) : (
                    <span className="job-name">{p.name}</span>
                  )}
                  {p.summary && <span className="job-text">{p.summary}</span>}
                  {(p.slug || !!p.links?.length) && (
                    <span className="job-links">
                      {p.slug && getProject(p.slug) && <Link to={`/projects/${p.slug}`}>세부 내용 ›</Link>}
                      {p.links?.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                          {l.label} ↗
                        </a>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Career;
