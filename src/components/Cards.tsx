import { Link } from "react-router-dom";
import { categories } from "../content/site";
import type { BehindPost, Project } from "../content/types";
import { formatDate } from "../lib/seo";

/** 프로젝트 카드. 사진이 있으면 위에 보여주고, 없으면 글자만으로 구성한다. */
export const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/projects/${project.slug}`} className="card project-card">
    {project.cover && (
      <div className="card-photo">
        <img src={project.cover} alt={project.title} loading="lazy" />
      </div>
    )}
    <div className="card-inner">
      <span className="chip">{categories[project.category]}</span>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-text">{project.summary}</p>
      <p className="card-meta">
        {[project.location, project.year].filter(Boolean).join(" · ")}
      </p>
    </div>
  </Link>
);

/** 비하인드 목록 한 줄 */
export const BehindRow = ({ post }: { post: BehindPost }) => (
  <li>
    <Link to={`/behind/${post.slug}`} className="row">
      <div className="row-main">
        <p className="row-meta">
          {formatDate(post.date)}
          {post.tags?.length ? ` · ${post.tags[0]}` : ""}
        </p>
        <h3 className="row-title">{post.title}</h3>
        <p className="row-text">{post.excerpt}</p>
      </div>
      <span className="row-arrow" aria-hidden>
        ›
      </span>
    </Link>
  </li>
);

export const SectionHead = ({
  title,
  sub,
  link,
}: {
  title: string;
  sub?: string;
  link?: { to: string; text: string };
}) => (
  <div className="section-head">
    <div>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
    {link && (
      <Link to={link.to} className="text-link">
        {link.text} ›
      </Link>
    )}
  </div>
);
