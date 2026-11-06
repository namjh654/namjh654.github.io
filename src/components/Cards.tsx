import { Link } from "react-router-dom";
import { getCompany, getSeries, getSeriesPosts, stackUsage } from "../content";
import { kinds, stages, topics } from "../content/site";
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

/** 기술 스택 종합. 각 기술을 쓴 프로젝트 수를 보여주고, 누르면 그 기술로 거른 프로젝트 목록으로 간다. */
export const StackOverview = () => (
  <div className="spec">
    {stackUsage.map((g) => (
      <div key={g.area} className="spec-row">
        <span className="spec-key">{g.area}</span>
        <ul className="stack-list">
          {g.items.map((i) => (
            <li key={i.name}>
              <Link
                to={`/projects?stack=${encodeURIComponent(i.name)}`}
                className="stack-chip"
                title={i.projects.map((p) => p.title).join(", ")}
              >
                {i.name}
                <span className="stack-count">{i.projects.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

type PostSize = NonNullable<Post["size"]>;

/** 카드 크기: 직접 정한 값 → 시리즈 대표(1편) → 사진 있음 → 기본 */
const postSize = (post: Post, emphasize: boolean): PostSize => {
  if (post.size) return post.size;
  if (emphasize && post.series && getSeriesPosts(post.series)[0]?.slug === post.slug) return "lg";
  if (post.cover) return "wide";
  return "sm";
};

/** 블로그 카드. bento 그리드 안에서 크기가 달라진다. */
export const PostCard = ({ post, size }: { post: Post; size: PostSize }) => {
  const series = getSeries(post.series);
  return (
    <li className={`bento-item bento-${size}`}>
      <Link to={`/blog/${post.slug}`} className="card post-card">
        {post.cover && (
          <div className="post-photo">
            <img src={post.cover} alt="" loading="lazy" />
          </div>
        )}
        <div className="card-inner">
          <p className="post-meta">
            {series ? (
              <span className="post-series">
                {series.title}
                {post.seriesOrder ? ` · ${post.seriesOrder}편` : ""}
              </span>
            ) : (
              post.topic && <span className="post-topic">{topics[post.topic]}</span>
            )}
            <span>{formatDate(post.date)}</span>
          </p>
          <h3 className="card-title post-title">{post.title}</h3>
          <p className="card-text post-text">{post.excerpt}</p>
          {!!post.tags?.length && (
            <div className="card-foot">
              <Tags items={post.tags} />
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};

/** 블로그 카드 묶음 (PC 4열 · 태블릿 2열 · 모바일 1열, 빈칸은 뒤 카드가 채운다) */
const CELLS: Record<PostSize, number> = { sm: 1, wide: 2, tall: 2, lg: 4 };

export const PostBento = ({ list, emphasize = true }: { list: Post[]; emphasize?: boolean }) => {
  const sizes = list.map((p) => postSize(p, emphasize));
  // 4열 기준으로 마지막 줄이 비면, 뒤쪽 작은 카드부터 가로로 넓혀 빈칸을 채운다.
  let gap = (4 - (sizes.reduce((n, s) => n + CELLS[s], 0) % 4)) % 4;
  for (let i = sizes.length - 1; i >= 0 && gap > 0; i--) {
    if (sizes[i] === "sm" && !list[i].size) {
      sizes[i] = "wide";
      gap--;
    }
  }
  return (
    <ul className="bento">
      {list.map((post, i) => (
        <PostCard key={post.slug} post={post} size={sizes[i]} />
      ))}
    </ul>
  );
};

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
