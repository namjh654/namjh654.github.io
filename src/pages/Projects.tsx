import { Link, useSearchParams } from "react-router-dom";
import { ProjectCard } from "../components/Cards";
import { careerProjects, companies, games, selfProjects } from "../content";
import type { Project } from "../content/types";
import { useSeo } from "../lib/seo";

interface Props {
  variant: "work" | "games";
}

type Group = "all" | "self" | "career";

const GROUPS: { key: Group; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "self", label: "자체 프로젝트" },
  { key: "career", label: "커리어 프로젝트" },
];

const Grid = ({ list }: { list: Project[] }) =>
  list.length ? (
    <div className="card-grid">
      {list.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  ) : (
    <p className="empty">아직 항목이 없습니다.</p>
  );

/** 게임 목록 */
const Games = () => {
  useSeo({
    title: "게임",
    description: "봉봉이 개발한 게임 목록. 플랫폼과 기술 스택, 개발 상태.",
    path: "/games",
  });
  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Games</p>
        <h1 className="page-title">게임</h1>
        <p className="page-sub">기획부터 밸런스, 개발까지 혼자 만드는 게임입니다.</p>
      </header>
      <Grid list={games} />
    </section>
  );
};

/** 프로젝트: 자체 프로젝트와 커리어(회사) 프로젝트를 나눠 보여준다. */
const Work = () => {
  const [params, setParams] = useSearchParams();
  const group = (params.get("group") as Group) || "all";
  useSeo({
    title: "프로젝트",
    description: `직접 만든 자체 프로젝트 ${selfProjects.length}개와 회사에서 만든 커리어 프로젝트 ${careerProjects.length}개.`,
    path: "/projects",
  });

  const counts: Record<Group, number> = {
    all: selfProjects.length + careerProjects.length,
    self: selfProjects.length,
    career: careerProjects.length,
  };
  const select = (key: Group) => setParams(key === "all" ? {} : { group: key }, { replace: true });

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Projects</p>
        <h1 className="page-title">프로젝트</h1>
        <p className="page-sub">
          직접 기획·개발해 운영하는 자체 프로젝트와, {companies.length}곳의 회사에서 만든 커리어 프로젝트입니다.
        </p>
      </header>

      <div className="segment" role="tablist" aria-label="프로젝트 구분">
        {GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            role="tab"
            aria-selected={group === g.key}
            className={`segment-item${group === g.key ? " is-active" : ""}`}
            onClick={() => select(g.key)}
          >
            {g.label} <span className="segment-count">{counts[g.key]}</span>
          </button>
        ))}
      </div>

      {group !== "career" && (
        <section className="group">
          {group === "all" && (
            <div className="group-head">
              <h2 className="group-title">
                자체 프로젝트 <span className="group-count">{selfProjects.length}</span>
              </h2>
              <p className="group-sub">직접 기획하고 만들어 운영하는 서비스·템플릿·게임</p>
            </div>
          )}
          <Grid list={selfProjects} />
        </section>
      )}

      {group !== "self" && (
        <section className="group">
          {group === "all" && (
            <div className="group-head">
              <h2 className="group-title">
                커리어 프로젝트 <span className="group-count">{careerProjects.length}</span>
              </h2>
              <p className="group-sub">
                회사에 재직하며 만든 프로젝트 · <Link to="/career">회사별로 보기 ›</Link>
              </p>
            </div>
          )}
          <Grid list={careerProjects} />
        </section>
      )}
    </section>
  );
};

const Projects = ({ variant }: Props) => (variant === "games" ? <Games /> : <Work />);

export default Projects;
