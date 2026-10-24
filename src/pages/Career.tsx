import { Link } from "react-router-dom";
import { companies } from "../content";
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
        <p className="page-sub">회사에 재직하며 만든 프로젝트입니다. 최근 순서로 정리했습니다.</p>
      </header>

      <ol className="timeline">
        {companies.map((c) => (
          <li key={c.key} className="timeline-item">
            <div className="timeline-head">
              <h2 className="timeline-title">{c.name}</h2>
              {c.period && <span className="timeline-period">{c.period}</span>}
            </div>
            {c.role && <p className="timeline-role">{c.role}</p>}
            {c.summary && <p className="timeline-text">{c.summary}</p>}
            <ul className="job-projects">
              {c.projects.map((p) => {
                const body = (
                  <>
                    <span className="job-name">{p.name}</span>
                    {p.summary && <span className="job-text">{p.summary}</span>}
                    {p.slug && <span className="job-more">자세히 ›</span>}
                  </>
                );
                return (
                  <li key={p.name}>
                    {p.slug ? (
                      <Link to={`/projects/${p.slug}`} className="job-card is-link">
                        {body}
                      </Link>
                    ) : (
                      <div className="job-card">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Career;
