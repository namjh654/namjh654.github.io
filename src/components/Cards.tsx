import { Link } from "react-router-dom";
import { getCompany } from "../content";
import { kinds, stages } from "../content/site";
import type { Post, Project } from "../content/types";
import { formatDate } from "../lib/seo";

export const StageBadge = ({ stage }: { stage?: Project["stage"] }) =>
  stage ? (
    <span className={`stage stage-${stage}`}>
      <span className="stage-dot" aria-hidden />
      {stages[stage]}
    </span>
  ) : null;

export const Tags = ({ items, tone = "gray" }: { items: string[]; tone?: "gray" | "blue" }) =>
  items.length ? (
    <ul className={`tags tags-${tone}`}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  ) : null;

/** 자체/커리어 구분 표시. 예) "자체 · 서비스", "커리어 · 엠투엠테크" */
export const originLabel = (p: Project) =>
  p.kind === "career" ? `커리어 · ${getCompany(p.company)?.name ?? "회사"}` : `자체 · ${kinds[p.kind]}`;

/** 프로젝트 카드. 목록은 글자만으로 맞추고, 사진·스크린샷은 상세 페이지에서 보여준다. */
export const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/projects/${project.slug}`} className="card project-card">
    <div className="card-inner">
      <div className="card-top">
        <span className={`card-kind${project.kind === "career" ? " is-career" : ""}`}>{originLabel(project)}</span>
        <StageBadge stage={project.stage} />
      </div>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-text">{project.summary}</p>
      <div className="card-foot">
        <Tags items={project.platforms} tone="blue" />
        {project.period && <span className="card-meta">{project.period}</span>}
      </div>
    </div>
  </Link>
);

/** 블로그 목록 한 줄 */
export const PostRow = ({ post }: { post: Post }) => (
  <li>
    <Link to={`/blog/${post.slug}`} className="row">
      <div className="row-main">
        <p className="row-meta">
          {formatDate(post.date)}
          {post.tags?.length ? ` · ${post.tags.join(" · ")}` : ""}
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
