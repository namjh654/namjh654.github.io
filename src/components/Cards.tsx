import { Link } from "react-router-dom";
import { categories } from "../content/site";
import type { BehindPost, Project } from "../content/types";
import { formatDate } from "../lib/useDocumentTitle";

/** 이미지 위에 글자를 얹는 둥근 카드. tall 이면 세로로 길게 (메이슨리 리듬용) */
export const ProjectCard = ({
  project,
  tall = false,
}: {
  project: Project;
  tall?: boolean;
}) => (
  <Link
    to={`/projects/${project.slug}`}
    className={`overlay-card${tall ? " is-tall" : ""}`}
  >
    <img src={project.cover} alt="" loading="lazy" />
    <span className="overlay-top">
      {categories[project.category]} · {project.year}
    </span>
    <span className="overlay-title">{project.title}</span>
  </Link>
);

export const BehindCard = ({ post }: { post: BehindPost }) => (
  <Link to={`/behind/${post.slug}`} className="behind-card">
    <div className="media">
      <img src={post.cover} alt="" loading="lazy" />
    </div>
    <div className="behind-card-body">
      <p className="meta">
        {formatDate(post.date)}
        {post.tags?.length ? ` · ${post.tags[0]}` : ""}
      </p>
      <h3 className="behind-card-title">{post.title}</h3>
      <p className="muted behind-card-excerpt">{post.excerpt}</p>
    </div>
  </Link>
);

/** 메이슨리: 2열로 쌓고 카드 높이를 번갈아 바꾼다. */
export const ProjectMasonry = ({ list }: { list: Project[] }) => (
  <div className="masonry">
    {list.map((p, i) => (
      <ProjectCard key={p.slug} project={p} tall={i % 3 === 1} />
    ))}
  </div>
);
