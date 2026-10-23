import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { categories } from "../content/site";
import type { BehindPost, Project } from "../content/types";
import { formatDate } from "../lib/seo";

/** 순서대로 조금씩 늦게 나타나게 하는 지연값 */
export const delay = (i: number) => ({ "--delay": `${(i % 3) * 90}ms` } as CSSProperties);

export const ProjectCard = ({
  project,
  index = 0,
  wide = false,
}: {
  project: Project;
  index?: number;
  wide?: boolean;
}) => (
  <Link
    to={`/projects/${project.slug}`}
    className={`project-card${wide ? " is-wide" : ""}`}
    data-reveal
    style={delay(index)}
  >
    <div className="frame">
      <img src={project.cover} alt={project.title} loading="lazy" />
    </div>
    <div className="card-body">
      <h3 className="card-title">{project.title}</h3>
      <p className="card-meta">
        {[categories[project.category], project.location, project.year]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </div>
  </Link>
);

export const BehindCard = ({ post, index = 0 }: { post: BehindPost; index?: number }) => (
  <Link to={`/behind/${post.slug}`} className="behind-card" data-reveal style={delay(index)}>
    <div className="frame">
      <img src={post.cover} alt={post.title} loading="lazy" />
    </div>
    <div className="card-body">
      <p className="card-meta">
        {formatDate(post.date)}
        {post.tags?.length ? ` · ${post.tags[0]}` : ""}
      </p>
      <h3 className="card-title">{post.title}</h3>
      <p className="card-excerpt">{post.excerpt}</p>
    </div>
  </Link>
);

export const SectionHead = ({
  label,
  title,
  link,
}: {
  label: string;
  title: string;
  link?: { to: string; text: string };
}) => (
  <div className="section-head" data-reveal>
    <div>
      <p className="label">{label}</p>
      <h2 className="section-title">{title}</h2>
    </div>
    {link && (
      <Link to={link.to} className="more-link">
        {link.text}
        <span aria-hidden>→</span>
      </Link>
    )}
  </div>
);
