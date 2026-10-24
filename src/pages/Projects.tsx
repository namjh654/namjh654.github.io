import { useSearchParams } from "react-router-dom";
import { ProjectCard } from "../components/Cards";
import { games, platformsOf, workProjects } from "../content";
import type { Project } from "../content/types";
import { useSeo } from "../lib/seo";

interface Props {
  variant: "work" | "games";
}

const COPY = {
  work: {
    label: "Projects",
    title: "프로젝트",
    sub: "직접 기획하고 개발해 운영하는 서비스와, 다음 프로젝트를 위해 만든 템플릿입니다.",
    description: "봉봉이 직접 기획·개발·운영하는 웹 서비스와 관리자·KMP 템플릿.",
  },
  games: {
    label: "Games",
    title: "게임",
    sub: "기획부터 밸런스, 개발까지 혼자 만드는 게임입니다.",
    description: "봉봉이 개발한 게임 목록. 플랫폼과 기술 스택, 개발 상태.",
  },
};

/** 플랫폼 태그로 거르는 프로젝트·게임 목록 */
const Projects = ({ variant }: Props) => {
  const source: Project[] = variant === "games" ? games : workProjects;
  const copy = COPY[variant];
  const [params, setParams] = useSearchParams();
  const current = params.get("platform");
  const list = current ? source.filter((p) => p.platforms.includes(current)) : source;
  useSeo({ title: copy.title, description: copy.description, path: variant === "games" ? "/games" : "/projects" });

  const select = (tag: string | null) => setParams(tag ? { platform: tag } : {}, { replace: true });
  const tabs: [string | null, string, number][] = [
    [null, "전체", source.length],
    ...platformsOf(source).map(([t, n]) => [t, t, n] as [string, string, number]),
  ];

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">{copy.label}</p>
        <h1 className="page-title">{copy.title}</h1>
        <p className="page-sub">{copy.sub}</p>
      </header>

      {tabs.length > 2 && (
        <div className="segment" role="tablist" aria-label="플랫폼">
          {tabs.map(([key, label, n]) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={current === key}
              className={`segment-item${current === key ? " is-active" : ""}`}
              onClick={() => select(key)}
            >
              {label} <span className="segment-count">{n}</span>
            </button>
          ))}
        </div>
      )}

      {list.length ? (
        <div className="card-grid">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <p className="empty">해당 플랫폼의 항목이 아직 없습니다.</p>
      )}
    </section>
  );
};

export default Projects;
